const express = require("express");
const router = express.Router(); // Create a new router
const moment = require('moment'); // Use moment.js for date validation
require('dotenv').config();
const CryptoJS = require("crypto-js");
const encryptData = require("../encryption.js")
const { birthDescriptions, descriptions,soulDescriptions,talentDescriptions  } = require('./Data.js'); // Assuming soulDescriptions is in Data.js



// Function to calculate the Destiny Number based on the full name
function calculateDestinyNumber(firstName, middleName, lastName) {
    const nameMapping = {
        A: 1, J: 1, S: 1,
        B: 2, K: 2, T: 2,
        C: 3, L: 3, U: 3,
        D: 4, M: 4, V: 4,
        E: 5, N: 5, W: 5,
        F: 6, O: 6, X: 6,
        G: 7, P: 7, Y: 7,
        H: 8, Q: 8, Z: 8,
        I: 9, R: 9
    };

    const fullName = `${firstName || ''}${middleName || ''}${lastName || ''}`.toUpperCase();
    let nameCount = [...fullName].reduce((sum, letter) => sum + (nameMapping[letter] || 0), 0);

    if (nameCount === 11) {
        return {
            number: 11,
            title: "Intuitive and Motivated",
            description: "The number eleven is a higher octave of number two. People with this number are highly intuitive individuals who draw strength from their spiritual nature. They are motivated and driven, often possessing strong foresight that guides their actions. Their ability to inspire others is notable, making them natural leaders in various aspects of life."
        };
    } else if (nameCount === 22) {
        return {
            number: 22,
            title: "Spiritual and Disciplined",
            description: "The number twenty-two is a higher octave of number four. Individuals with this number are very spiritual in their approach to life. They combine their spiritual insights with practicality and discipline, often becoming effective leaders. Their strong organizational skills and ability to manifest their dreams into reality make them influential figures who can bring significant change."
        };
    }

    // Reduce the number to a single digit if necessary
    while (nameCount >= 10) {
        nameCount = String(nameCount).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    return { number: nameCount, ...descriptions[nameCount] || { title: "Invalid", description: "No valid Destiny Number found." } };
}

// Function to calculate the Birth Number based on birthDate
function calculateBirthNumber(birthDate) {
    let birthNum = parseInt(birthDate.replace(/-/g, "")); // Remove dashes and convert to number
    let sum = 0;

    // Reduce to a single digit
    while (birthNum >= 10) {
        sum = 0;
        while (birthNum !== 0) {
            sum += (birthNum % 10); // sum of all single digits
            birthNum = Math.floor(birthNum / 10);
        }
        birthNum = sum;
    }

    return { number: birthNum, ...birthDescriptions[birthNum] || { title: "Unknown", description: "No valid birth number found." } };
}

// Function to calculate the Soul Number based on the full name
function calculateSoulNumber(fullName) {
    const vowelMapping = {
        A: 1,
        E: 5,
        I: 9,
        O: 6,
        U: 3
    };

    const vowelsOnly = [...fullName.toUpperCase()].filter(letter => vowelMapping[letter]);
    let soulCount = vowelsOnly.reduce((sum, letter) => sum + vowelMapping[letter], 0);

    if (soulCount === 11) {
        return {
            number: 11,
             title: "Intuitive and Motivated",
        description: "Individuals with a Soul Number 11 are highly intuitive, drawing strength from their spiritual nature. They are motivated in all endeavors and possess strong foresight, helping them navigate life. Their helpfulness endears them to others."
        };
    } else if (soulCount === 22) {
        return {
            number: 22,
            title: "Spiritual and Disciplined",
        description: "People with a Soul Number 22 are spiritual in their actions and highly organized in their work. They possess strong leadership skills that drive success. Their psychic sense aids them in making sound decisions."
        };
    }

    while (soulCount >= 10) {
        soulCount = String(soulCount).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    return { number: soulCount, ...soulDescriptions[soulCount] || { title: "Invalid", description: "No valid Soul Number found." } };
}

function calculateHiddenTalent(strFullName) {
    let page4_nameCount = 0;
  
    for (const letter of strFullName.toUpperCase()) {
      if (["A", "J", "S"].includes(letter)) {
        page4_nameCount += 1;
      } else if (["B", "K", "T"].includes(letter)) {
        page4_nameCount += 2;
      } else if (["C", "L", "U"].includes(letter)) {
        page4_nameCount += 3;
      } else if (["D", "M", "V"].includes(letter)) {
        page4_nameCount += 4;
      } else if (["E", "N", "W"].includes(letter)) {
        page4_nameCount += 5;
      } else if (["F", "O", "X"].includes(letter)) {
        page4_nameCount += 6;
      } else if (["G", "P", "Y"].includes(letter)) {
        page4_nameCount += 7;
      } else if (["H", "Q", "Z"].includes(letter)) {
        page4_nameCount += 8;
      } else if (["I", "R"].includes(letter)) {
        page4_nameCount += 9;
      }
    }
  
    if (page4_nameCount === 11 || page4_nameCount === 22) {
      return { number: page4_nameCount, description: talentDescriptions[page4_nameCount] };
    } else {
      let page4_sum = page4_nameCount.toString().split('').reduce((acc, num) => acc + Number(num), 0);
  
      // Reduce to a single digit if needed
      while (page4_sum >= 10) {
        page4_sum = page4_sum.toString().split('').reduce((acc, num) => acc + Number(num), 0);
      }
  
      return { number: page4_sum, description: talentDescriptions[page4_sum] };
    }
  }
  

function extractNames(fullName) {
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

    return { firstName, middleName, lastName };
}

// POST endpoint to handle the birthday data
router.post('/birthdaydata', (req, res) => {
    const { birthDate, name } = req.body; 
    const { firstName, middleName, lastName } = extractNames(name);
    if (!birthDate) {
        return res.status(400).json({ error: "birthDate is required. Please provide it in 'YYYY-MM-DD' format." });
    }


    const birthResult = calculateBirthNumber(birthDate); // Calculate birth number
    const destinyResult = calculateDestinyNumber(firstName, middleName, lastName); // Calculate destiny number
    const soulResult = calculateSoulNumber(`${firstName} ${middleName} ${lastName}`); // Calculate soul number
    const TalentResult = calculateHiddenTalent(name);
    const results = {
        birth: birthResult,
        destiny: destinyResult,
        soul: soulResult,
        hiddentalent:TalentResult // Include soul number in the results
    };

    const encryptedResults = encryptData(results);

    // Send the encrypted result back to the client
    res.json( encryptedResults );
    // Send the result back to the client
  
});

module.exports = router;
