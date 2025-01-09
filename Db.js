// db.js
const mongoose = require("mongoose");
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected!");

    // Fetch the database stats
   
    // console.log("Database Stats:");
    // console.log(`Data Size: ${stats.dataSize / 1024 / 1024} MB`);
    // console.log(`Storage Size: ${stats.storageSize / 1024 / 1024} MB`);
    // console.log(`Number of Collections: ${stats.collections}`);
    // console.log(`Number of Objects: ${stats.objects}`);
    // console.log(`Index Size: ${stats.indexSize / 1024 / 1024} MB`);

  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
