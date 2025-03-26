const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const sendEmail = require("./Mailer.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./Db.js");
const User = require("./Userschema.js");
const multer = require("multer");
require("dotenv").config();
const Dailyhoroscopetabroute = require("./routes/Dailyhoroscopetabroute.js")
const RegisterLogin = require("./routes/RegisterLogin.js");
const Numerologyroute=require("./routes/Numerologyroute.js")
const Numerologyroute2= require("./routes/Numerologyroute2.js")
const sqldataroute= require("./routes/sqldataroute.js")
const paymentandorderroute=require("./routes/Paymentandorderroute.js")
const chineseroute= require("./routes/Chineseroute.js")
const Nameanalysis= require("./routes/Nameanalysis.js")
const Lovecompatiblity= require("./routes/Lovecompatiblity.js")
const { URL } = require("url");
const https = require('https');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
 
const app = express();
app.use(express.json());

app.use(cors({
  // origin: 'https://irisastro.com/' // Replace with your actual website URL
}));

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
connectDB();


app.use(RegisterLogin);
app.use(Numerologyroute);
app.use(Numerologyroute2)
app.use(sqldataroute)
app.use(chineseroute)
app.use(paymentandorderroute)
app.use(Nameanalysis)
app.use(Lovecompatiblity)
// Set a limit for JSON and URL-encoded data (10MB in this case)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// razor pay
const razorpayInstance = new Razorpay({
  key_id: process.env.razorpay_key_id,     // Replace with your Razorpay key_id
  key_secret: process.env.razorpay_key_secret, // Replace with your Razorpay key_secret
});



app.post('/createorder', async (req, res) => {
  const {userId,  currency , currendata ,plantype} = req.body; // Get amount from frontend request
// console.log(currendata)
const plan= plantype.split(" ")
const price =(plan[0]=="AI" )?1499:2499
console.log(price)
  try {
    const order = await razorpayInstance.orders.create({
      amount:Math.round(price * currendata),

      // Amount in paise (1 INR = 100 paise)
      currency: `${currency}`,
     
      receipt: `#${userId}_${uuidv4().replace(/-/g, '').substring(0, 7)}`, // Customized receipt
      notes: {
        userId: userId,
        // productName: productname,
        customMessage: "Thank you for your purchase!",
      },
     
    });
    
    console.log(order.receipt)
    res.status(200).json({
      id: order.id, amount:order.amount, receipt:order.receipt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error creating order',
    });
  }
});


// app.post('/verify-payment', async (req, res) => {
//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature,formdata,userid } = req.body;

//   // Use the Razorpay SDK to verify the payment signature
//   const crypto = require('crypto');
//   const body = razorpay_order_id + '|' + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac('sha256', 'xRtbtfEmy5Xtj1XDwgVn0BRg')
//     .update(body)
//     .digest('hex');

//   if (razorpay_signature === expectedSignature) {
//     res.status(200).json({ message: 'Payment verified' });


//   } else {
//     res.status(400).json({ message: 'Payment verification failed' });
//   }
// });


//end of razor pay here




// this is for updating the user i mean in profile page it updates data
app.put("/updateUser", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from the header
    let userId;

    // Check if token exists
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      userId = decodedToken.id; // Extract user ID from token
    } else {
      // const { email } = req.body; // Extract email from request body if no token
      // const user = await User.findOne({ email }); // Find user by email
      // if (!user) return res.status(404).send("User not found");
      // userId = user._id; // Get user ID from the found user
    }

    const { name, gender, dob, tob, placeOfBirth, zodiacSign, profilePhoto,notSure } =
      req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    // Update fields only if they are present in the request body
    if (name) user.displayName = name;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (tob) user.tob = tob;
    if (placeOfBirth) user.placeOfBirth = placeOfBirth;
    if (zodiacSign) user.zodiacSign = zodiacSign;
    if (profilePhoto) user.profilePhoto = profilePhoto;
    if (notSure==true) user.tob ="";

    // Save updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Server error");
  }
});



// this is for getting user info it sends all the data of the user i heve used in auth context or other places
app.get("/userinfo", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from the header
    let userId;

    if (token) {
      // If token exists, verify it and get user ID from the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      userId = decodedToken.id;
    } else {
      // If no token, check if an email is passed as a query parameter
      // const email = req.query.email;

      // if (!email) {
      //   return res.status(400).send("Email required");
      // }

      // const user = await User.findOne({ email });
      // if (!user) {
      //   return res.status(404).send("User not found");
      // }
      // userId = user._id;
    }

    // Fetch user data by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user); // Respond with the user data
  } catch (error) {
    console.error("fetching user error:", error);
    res.status(500).send("Server error");
  }
});

app.post('/slack', (req, res) => {
  const webhookUrl = 'https://hooks.slack.com/services/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';
  const messageText = JSON.stringify(req.body);
  
  const url = new URL(webhookUrl); // Parse the URL
  
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(messageText),
    },
  };

  const request = https.request(options, (response) => {
    let responseBody = '';

    response.on('data', (chunk) => {
      responseBody += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        res.status(200).send('Message sent to Slack.');
      } else {
        res.status(response.statusCode).send('Failed to send message: ' + responseBody);
      }
    });
  });

  request.on('error', (error) => {
    console.error('Error forwarding message:', error);
    res.status(500).send('Server error.');
  });

  // Write data to request body
  request.write(messageText);
  request.end();
});

app.use(Dailyhoroscopetabroute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} `);
});
