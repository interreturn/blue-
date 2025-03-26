const express = require("express");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const router = express.Router();

// Connect to the SQLite Database
const db = new sqlite3.Database("zodiacmsg.db", (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Route for love compatibility
router.post("/love-compatibility", (req, res) => {
  const { firstSign, secondSign } = req.body;

  if (!firstSign || !secondSign) {
    return res.status(400).json({ error: "Both signs are required." });
  }

  const query = `
    SELECT messages.message, messages.percentage 
    FROM messages
    JOIN signidselection ON messages.id = signidselection.id
    JOIN sign f ON signidselection.fselection = f.id
    JOIN sign s ON signidselection.sselection = s.id
    WHERE f.signname = ? AND s.signname = ?;
  `;

  db.get(query, [firstSign, secondSign], (err, row) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (!row) {
      return res.status(404).json({ error: "Compatibility data not found." });
    }

    res.json({ 
      compatibilityMessage: row.message, 
      percentage: row.percentage 
    });
  });
});

module.exports = router;
