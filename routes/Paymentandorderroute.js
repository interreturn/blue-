const express = require('express');
const multer = require('multer');
const Order = require('../Orderschema');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.cloudname_api_key,
    api_secret: process.env.cloudname_api_secret
  });

// Configure multer storage (memoryStorage instead of diskStorage)
const storage = multer.memoryStorage(); // Store in memory
const upload = multer({ storage: storage });

// Helper function to upload an image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' }, // Automatically determine the file type (image/video)
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error); // Log error to understand the issue
                    reject(error);
                } else {
                    console.log('Cloudinary upload result:', result); // Log result to ensure successful upload
                    resolve(result);
                }
            }
        );
        uploadStream.end(fileBuffer); // End the stream with the file buffer
    });
};


// This will accept multiple files (lefthandimg and righthandimg)


router.post('/verify-payment', upload.fields([
    { name: 'lefthandimg', maxCount: 1 },
    { name: 'righthandimg', maxCount: 1 }
]), async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, formdata, userid ,name,} = req.body;

    console.log("FormData: ", req.body); // Logs non-file data from the form
    console.log("Files: ", req.files); // Logs uploaded files
console.log("this ",name)


// console.log("FormData: ", formdata);
    // Validate required fields
    // if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !formdata || !userid) {
    //     return res.status(400).json({ message: 'Required fields are missing' });
    // }

    // Razorpay signature verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.razorpay_key_secret)
    .update(body)
    .digest('hex');

    if (razorpay_signature === expectedSignature) {
        try {
            // Upload images to Cloudinary with proper error handling
            const leftImage = req.files.lefthandimg && req.files.lefthandimg[0].buffer
                ? await uploadToCloudinary(req.files.lefthandimg[0].buffer)
                : null;
            const rightImage = req.files.righthandimg && req.files.righthandimg[0].buffer
                ? await uploadToCloudinary(req.files.righthandimg[0].buffer)
                : null;

            // Ensure formdata contains the required fields
            const { name, email, birthdate, birthtime, question, thecard, context, type, totalPrice ,receipt} = req.body;
            console.log(receipt)
            if (!name || !email || !question) {
                return res.status(400).json({ message: 'Form data is incomplete' });
            }

            // Create a new order
            const newOrder = new Order({
                userId: userid,
                userinfo: {
                    name,
                    email,
                    birthdate: birthdate || null,
                    birthtime: birthtime || null,
                    lefthandimg: leftImage ? leftImage.secure_url : null,
                    righthandimg: rightImage ? rightImage.secure_url : null,
                    question,
                    thecard: thecard || null,
                    context: context || null,
                },
                Reporttype: type,
                totalPrice:totalPrice,
                transactionNo: razorpay_payment_id,
                receipt:receipt,
                orderid: razorpay_order_id,
                orderDate: new Date(),
                estimatedtimeforreport: new Date(Date.now() + 24 * 60 * 60 * 1000), // Estimated time for the report (1 day)
                status: 1, // Assuming 1 means order is confirmed/paid
            });

            const savedOrder = await newOrder.save();
            res.status(201).json({ success: true,  });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ success: false, message: 'Error creating order' });
        }
    } else {
        res.status(400).json({ message: 'Payment verification failed' });
    }
});




module.exports = router;
