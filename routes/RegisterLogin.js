const express = require("express");
const User = require('../Userschema.js')
const registerUserInFlodesk=require('../registerUserInFlodesk.js')


const bcrypt = require('bcryptjs');
const sendEmail= require("../Mailer.js")

const jwt = require("jsonwebtoken");



require('dotenv').config();

const router = express.Router(); 


router.post("/register", async (req, res) => {
  try {
      const { displayName, email, password, birthdate } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).send("User already exists");
      }

      // Hash the password and create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ displayName, email, password: hashedPassword, dob: birthdate });
      await newUser.save();

      // Generate a JWT token
      const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // Send the user registration success response (this is sent once the user is saved)
      res.status(201).json({
          message: "User registered successfully",
          token, // Send the generated token
          user: { displayName, email } // Send user info if needed
      });

      // Call the Flodesk registration function (Only if registration was successful, don't send another response)
      try {
          const response = await registerUserInFlodesk(email, displayName);

          // Log the Flodesk response if needed
          console.log('Flodesk response:', response);
      } catch (error) {
          console.error("Error during Flodesk registration:", error.message);
          // You can log the error or send an email notification for the failure
      }

      // Send a welcome email (Only if registration was successful, don't send another response)
      try {
        await sendEmail(
            email,
            "🌟 Welcome to Irisastro.com! 🌙",
            `Hi ${displayName},\n\nWelcome to Irisastro.com! 🌠 We're thrilled to have you join our community of stargazers, dreamers, and cosmic enthusiasts.\n\nYour journey through the stars has just begun! Whether you're here for daily horoscope insights, deep zodiac explorations, or personalized astrology readings, we’ve got something special waiting for you.\n\n✨ Here's what you can do now:\n- Check out your daily horoscope to see what the universe has in store for you today.\n- Explore your zodiac sign’s unique traits to uncover hidden aspects of your personality.\n- Dive into relationship and career insights tailored just for you!\n\nThank you for joining us. We can't wait to help you unlock the secrets of the stars. 🌌\n\nStay cosmic,\nThe [Your Horoscope Website Name] Team`,
            `
            <p>Hi <strong>${displayName}</strong>,</p>
            <p>Welcome to <strong>[Your Horoscope Website Name]</strong>! 🌠 We're thrilled to have you join our community of stargazers, dreamers, and cosmic enthusiasts.</p>
            <p>Your journey through the stars has just begun! Whether you're here for daily horoscope insights, deep zodiac explorations, or personalized astrology readings, we’ve got something special waiting for you.</p>
            <p><strong>✨ Here's what you can do now:</strong></p>
            <ul>
              <li>Check out your <strong>daily horoscope</strong> to see what the universe has in store for you today.</li>
              <li>Explore your <strong>zodiac sign’s unique traits</strong> to uncover hidden aspects of your personality.</li>
              <li>Dive into <strong>relationship and career insights</strong> tailored just for you!</li>
            </ul>
            <p>Thank you for joining us. We can't wait to help you unlock the secrets of the stars. 🌌</p>
            <p><strong>Stay cosmic,</strong><br>The Irisastro.com Team</p>
            `
        );
        console.log("Welcome email sent successfully.");
    } catch (emailError) {
        console.error("Error sending email during registration:", emailError);
        // Optional: handle email error without affecting user registration
    }
    

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
  

    try {
        // Normalize the email to lowercase for comparison
        const normalizedEmail = email.toLowerCase();
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
 
      try {
        if (existingUser.password) {
         
          return  res.status(500).json({ message: "try logging in using password" });
         }
      } catch (error) {console.log("first")
        
      }
          


        if (!existingUser) {
            // Create a new user record
            const newUser = new User({ displayName, email: normalizedEmail });
            await newUser.save();

            // Attempt to send a welcome email
            try {
              await sendEmail(
                  email,
                  "🌟 Welcome to Irisastro.com! 🌙",
                  `Hi ${displayName},\n\nWelcome to Irisastro.com! 🌠 We're thrilled to have you join our community of stargazers, dreamers, and cosmic enthusiasts.\n\nYour journey through the stars has just begun! Whether you're here for daily horoscope insights, deep zodiac explorations, or personalized astrology readings, we’ve got something special waiting for you.\n\n✨ Here's what you can do now:\n- Check out your daily horoscope to see what the universe has in store for you today.\n- Explore your zodiac sign’s unique traits to uncover hidden aspects of your personality.\n- Dive into relationship and career insights tailored just for you!\n\nThank you for joining us. We can't wait to help you unlock the secrets of the stars. 🌌\n\nStay cosmic,\nThe [Your Horoscope Website Name] Team`,
                  `
                  <p>Hi <strong>${displayName}</strong>,</p>
                  <p>Welcome to <strong>irisastro.com</strong>! 🌠 We're thrilled to have you join our community of stargazers, dreamers, and cosmic enthusiasts.</p>
                  <p>Your journey through the stars has just begun! Whether you're here for daily horoscope insights, deep zodiac explorations, or personalized astrology readings, we’ve got something special waiting for you.</p>
                  <p><strong>✨ Here's what you can do now:</strong></p>
                  <ul>
                    <li>Check out your <strong>daily horoscope</strong> to see what the universe has in store for you today.</li>
                    <li>Explore your <strong>zodiac sign’s unique traits</strong> to uncover hidden aspects of your personality.</li>
                    <li>Dive into <strong>relationship and career insights</strong> tailored just for you!</li>
                  </ul>
                  <p>Thank you for joining us. We can't wait to help you unlock the secrets of the stars. 🌌</p>
                  <p><strong>Stay cosmic,</strong><br>The Irisastro.com Team</p>
                  `
              );
              console.log("Welcome email sent successfully.");
          } catch (emailError) {
              console.error("Error sending email during registration:", emailError);
              // Optional: handle email error without affecting user registration
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
    if (!user.password) {
        return res.status(404).send({ message: "try using google login" });
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
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;  // Directly set the new password (in plain text)
      await user.save();
  
      res.send({ message: "Password has been reset successfully" });  // Send success response
    } catch (err) {
      console.error("Error in /resetpassword route:", err);
      res.status(500).send({ message: "An error occurred. Please try again." });
    }
  });

module.exports = router;