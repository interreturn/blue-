const express = require("express");
const User = require('../Userschema.js')


const bcrypt = require('bcryptjs');
const sendEmail= require("../Mailer.js")

const jwt = require("jsonwebtoken");



require('dotenv').config();

const router = express.Router(); 


router.post("/register", async (req, res) => {
    try {
        const { displayName, email, password } = req.body;
     

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // console.log("User already exists:", email); // Log for debugging
            return res.status(400).send("User already exists");
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ displayName, email, password: hashedPassword });
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({
            message: "User registered successfully",
            token, // Send the generated token
            user: { displayName, email } // Send user info if needed
        });

        // Send a welcome email
        try {
            await sendEmail(
                email, 
                "Welcome to MyApp!", 
                `Hello ${displayName},\n\nThank you for registering with MyApp. We're excited to have you on board!`,
                `<p>Hello <strong>${displayName}</strong>,</p><p>Thank you for registering with <strong>MyApp</strong>. We're excited to have you on board!</p>`
            );
            console.log("Welcome email sent successfully.");
        } catch (emailError) {
            console.error("Error sending email during registration:", emailError);
            // Optional: handle email error without affecting user registration
            return res.status(500).send("User registered, but email sending failed.");
        }

        // Respond with success and token
       
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Server error during registration");
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // Respond with user data and token
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: { displayName: user.displayName, email: user.email  } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


// below here is google login

router.post("/saveUserData", async (req, res) => {
    const { displayName, email } = req.body;
    console.log("Received data:", { displayName, email });

    try {
        // Normalize the email to lowercase for comparison
        const normalizedEmail = email.toLowerCase();
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        // console.log("Checking for existing user:", existingUser);

        if (!existingUser) {
            // Create a new user record
            const newUser = new User({ displayName, email: normalizedEmail });
            await newUser.save();

            // Attempt to send a welcome email
            try {
                await sendEmail(
                    normalizedEmail, 
                    "Welcome to MyApp!", 
                    `Hello ${displayName},\n\nThank you for registering with MyApp. We're excited to have you on board!`
                );
                console.log("Welcome email sent successfully.");
            } catch (emailError) {
                console.error("Error sending email during registration:", emailError);
            }

            // Generate a token for the new user
            const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
            // console.log(token)

            return res.status(201).json({ 
                message: "User data saved successfully", 
                token, 
            });
        } else {
            // User already exists, log them in
            const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
            // console.log(token)
            // console.log("User already exists, logging in:", normalizedEmail);
            return res.status(200).json({ 
                message: "User logged in successfully", 
                token, 
            }); 
        }
    } catch (error) {
        console.error("Error in saving user data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
//change the link below here remeber to modify that link
router.post('/forgot', async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If user not found, send error message
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a unique JWT token for the user that contains the user's id
    const token = jwt.sign({ userId: user._id ,pass:user.password}, process.env.JWT_SECRET, { expiresIn: '10m' });

    // Prepare email content
    const subject = "Password Reset Request";
    const text = `Hello ,\n\nPlease use the following link to reset your password:\n\nhttp://localhost:5173/resetpass/${token}\n\nThis link is valid for 10 minutes.\n\nIf you did not request a password reset, please ignore this email.`;
    
    // Send the token to the user's email
    try {
      await sendEmail(user.email, subject, text);
      console.log("Password reset email sent successfully.");
      res.send({ message: "Password reset email sent." });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      res.status(500).send({ message: "Error sending password reset email." });
    }

  } catch (err) {
    console.error("Error in /forgot route:", err);
    res.status(500).send({ message: "An error occurred. Please try again." });
  }
});



router.post('/resetpassword', async (req, res) => {
    try {
      const { password, token } = req.body;  // Extract password and token from the request body
  
      // Verify the token and extract the userId from it
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      const userId = decoded.userId;
      const oldpass = decoded.pass; // Extract old password from the token
  
      // Find the user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Compare the old password (from the token) with the current password stored in the database
      if (oldpass !== user.password) {
        return res.status(401).send({ message: "The reset link is expired." });
      }
  
      // Update the user's password
      user.password = password;  // Directly set the new password (in plain text)
      await user.save();
  
      res.send({ message: "Password has been reset successfully" });  // Send success response
    } catch (err) {
      console.error("Error in /resetpassword route:", err);
      res.status(500).send({ message: "An error occurred. Please try again." });
    }
  });

module.exports = router;