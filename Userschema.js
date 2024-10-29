// userModel.js
const mongoose = require("mongoose");

// Define the user schema
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
// Create and export the user model
const User = mongoose.model("User", userSchema);

module.exports = User;
