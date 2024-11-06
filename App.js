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
const sqldataroute= require("./routes/sqldataroute.js")
const { URL } = require("url");
const https = require('https');


const app = express();
app.use(express.json());


app.use(cors({
  origin: 'https://irisastro.com/' // Replace with your actual website URL
}));

const PORT = process.env.PORT || 3000;

connectDB();


app.use(RegisterLogin);
app.use(Numerologyroute);
app.use(sqldataroute)


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

    const { name, gender, dob, tob, placeOfBirth, zodiacSign, profilePhoto } =
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

app.post('/send-to-slack', (req, res) => {
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
