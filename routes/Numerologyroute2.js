const express = require('express');
const { initialMessages, responses } = require('./Data2.js');  // Destructure from Data2.js
const router = express.Router();
const encryptData = require("../encryption.js")

// Function to calculate pagesLast_sum based on birthDate
function calculatePagesLastSum(birthDate) {
  let pagesLast_val = birthDate ?? 0;
  let pagesLast_sum = 0;
  let pagesLast_len = String(pagesLast_val).length;

  while (pagesLast_len > 1) {
    pagesLast_sum = 0;
    while (pagesLast_val !== 0) {
      pagesLast_sum += pagesLast_val % 10;
      pagesLast_val = Math.floor(pagesLast_val / 10);
    }
    pagesLast_val = pagesLast_sum;
    if (pagesLast_sum === 11) {
      return 2;  // Return 2 if sum is 11
    } else if (pagesLast_sum === 22) {
      return 4;  // Return 4 if sum is 22
    }
    pagesLast_len = String(pagesLast_sum).length;
  }
  return pagesLast_sum;
}

// Function to get responses based on pagesLast_sum
function getResponses(pagesLast_sum) {
  // console.log(pagesLast_sum);
  return responses[pagesLast_sum] || "No responses available for this sum.";
}

// Function to extract first, middle, and last names
function extractNames(fullName) {
  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const middleName = nameParts.length > 2 ? nameParts.slice(1, nameParts.length - 1).join(" ") : "";
  return { firstName, middleName, lastName };
}

// Function to get initials and random messages
function getInitialsAndMessages(firstName, middleName = "", lastName = "") {
  const char_fn = firstName.charAt(0).toUpperCase();
  const char_mn = middleName ? middleName.charAt(0).toUpperCase() : "";
  const char_ln = lastName ? lastName.charAt(0).toUpperCase() : "";

  // Helper function to get a random message based on an initial
  function getRandomMessage(initial) {
    const messages = initialMessages[initial] || ["No specific traits available for this initial."];
      // Log the available messages for debugging
    return messages[Math.floor(Math.random() * 3)];
  }

  const initials = `${char_fn}${char_mn}${char_ln}`.replace(/ /g, '');
  const messages = [
    char_fn ? getRandomMessage(char_fn) : "",
    char_mn ? getRandomMessage(char_mn) : "",
    char_ln ? getRandomMessage(char_ln) : ""
  ].filter(Boolean);

  return { initials, messages };
}

// Route to get pagesLast_sum and responses based on birthDate
router.post('/bd', (req, res) => {
  const { birthDate ,name} = req.body;
  if (isNaN(birthDate)) {
    return res.status(400).json({ error: 'Invalid birthDate parameter' });
  }
  
  const pagesLast_sum = calculatePagesLastSum(Number(birthDate));
  const responseData = getResponses(pagesLast_sum);

  const fullName =name;
  const { firstName, middleName, lastName } = extractNames(fullName);
  const result = getInitialsAndMessages(firstName, middleName, lastName);
  

  const encryptedResults = encryptData(result)
  const encryptresponse=encryptData(responseData)

  res.json({
    nameinitials: encryptedResults, responses:encryptresponse,
  
  });
});

module.exports = router;
