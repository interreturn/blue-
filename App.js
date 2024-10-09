const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const sendEmail = require("./Mailer");
const multer = require('multer');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

const PORT = process.env.PORT || 5000; // Use the port provided by the environment or default to 5000


// Connect to MongoDB
mongoose.connect("mongodb+srv://touchzinginterns:CnMCfSG9v2x8cBi8@cluster0.tznnk.mongodb.net/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
// const userSchema = new mongoose.Schema({
//     displayName: String,
//     email: { type: String, unique: true },
//     password: String,
// });
const userSchema = new mongoose.Schema({
    displayName: String,
    email: { type: String, unique: true },
    password: String,
    dob: Date,    // Field for birthdate
    tob: String, // Time of birth as a string (HH:MM format)
    placeOfBirth: String,   // Field for place of birth
    zodiacSign: String, // Field for zodiac sign
    gender: String,
      // Field for address
      profilePhoto: String, // Field for profile image (could store the URL or path to image)
  });
  

const User = mongoose.model("User", userSchema);

// Register endpoint
// Register endpoint
// Register endpoint
app.post("/register", async (req, res) => {
    try {
        const { displayName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email); // Log for debugging
            return res.status(400).send("User already exists");
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ displayName, email, password: hashedPassword });
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

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
            // return res.status(500).send("User registered, but email sending failed.");
        }

        // Respond with success and token
        res.status(201).json({
            message: "User registered successfully",
            token, // Send the generated token
            user: { displayName, email } // Send user info if needed
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Server error during registration");
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
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
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

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

// Save user data endpoint
app.post("/saveUserData", async (req, res) => {
    const { displayName, email } = req.body;
    console.log("Received data:", { displayName, email });

    try {
        // Normalize the email to lowercase for comparison
        const normalizedEmail = email.toLowerCase();
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        console.log("Checking for existing user:", existingUser);

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
            const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            console.log(token)

            return res.status(201).json({ 
                message: "User data saved successfully", 
                token, 
            });
        } else {
            // User already exists, log them in
            const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            console.log(token)
            console.log("User already exists, logging in:", normalizedEmail);
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




app.put("/updateUser", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Get the token from the header
        let userId;

        // Check if token exists
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
            userId = decodedToken.id; // Extract user ID from token
        } else {
            const { email } = req.body; // Extract email from request body if no token
            const user = await User.findOne({ email }); // Find user by email
            if (!user) return res.status(404).send("User not found");
            userId = user._id; // Get user ID from the found user
        }

        const { name, gender, dob, tob, placeOfBirth, zodiacSign, profilePhoto } = req.body;

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

app.get('/userinfo', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Get the token from the header
        let userId;

        if (token) {
            // If token exists, verify it and get user ID from the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
            userId = decodedToken.id;
        } else {
            // If no token, check if an email is passed as a query parameter
            const email = req.query.email;
            
            if (!email) {
                return res.status(400).send("Email required");
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).send("User not found");
            }
            userId = user._id;
        }

        // Fetch user data by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(user);  // Respond with the user data

    } catch (error) {
        console.error("fetching user error:", error);
        res.status(500).send("Server error");
    }
});




  

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
