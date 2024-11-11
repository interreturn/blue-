// proxyRoutes.js
const express = require("express");
const https = require("https");
const CryptoJS = require("crypto-js");

const router = express.Router(); // Create a new router
require('dotenv').config();

// Secret key for encryption and decryption (use a strong key and keep it safe)
const secretKey = process.env.SECRET_KEY || 'your-secret-key'; // Store in .env file

// Utility function to encrypt data
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Proxy route for fetching data of the month (not used anywhere currently)
router.get('/proxy', (req, res) => {
    const targetUrl = '';

    https.get(targetUrl, (response) => {
        let data = '';

        // Collect the data chunks
        response.on('data', (chunk) => {
            data += chunk;
        });

        // On end, parse and send the encrypted response
        response.on('end', () => {
            const encryptedData = encryptData(JSON.parse(data));
            res.json({ data: encryptedData });
        });

    }).on('error', (error) => {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Error fetching data' });
    });
});

// Proxy route for fetching today's and tomorrow's data for the daily horoscope
router.get('/proxy1', (req, res) => {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}-${month}-${year}.json`;
    };

    const today = new Date();
    const todayUrl = `${process.env.IDZLINKS}/${formatDate(today)}`;

    https.get(todayUrl, (todayResponse) => {
        if (todayResponse.statusCode !== 200) {
            return res.status(todayResponse.statusCode).json({ error: 'Error fetching today\'s data' });
        }

        let todayData = '';
        todayResponse.on('data', (chunk) => {
            todayData += chunk;
        });

        todayResponse.on('end', () => {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const tomorrowUrl = `https://s3-us-west-2.amazonaws.com/idz-horoscopes/${formatDate(tomorrow)}`;

            https.get(tomorrowUrl, (tomorrowResponse) => {
                if (tomorrowResponse.statusCode !== 200) {
                    return res.status(tomorrowResponse.statusCode).json({ error: 'Error fetching tomorrow\'s data' });
                }

                let tomorrowData = '';
                tomorrowResponse.on('data', (chunk) => {
                    tomorrowData += chunk;
                });

                tomorrowResponse.on('end', () => {
                    const encryptedTodayData = encryptData(JSON.parse(todayData));
                    const encryptedTomorrowData = encryptData(JSON.parse(tomorrowData));

                    // Send encrypted data in response
                    res.json({
                        today: encryptedTodayData,
                        tomorrow: encryptedTomorrowData
                    });
                });

            }).on('error', (error) => {
                console.error("Error fetching tomorrow's data:", error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        });

    }).on('error', (error) => {
        console.error("Error fetching today's data:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

module.exports = router; // Export the router
