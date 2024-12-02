// proxyRoutes.js
const express = require("express");
const https = require("https");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const router = express.Router(); // Create a new router
require('dotenv').config();

// Secret key for encryption and decryption (use a strong key and keep it safe)
const secretKey =  process.env.encryptionkey|| 'your-secret-key'; // Store in .env file

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

    const fetchData = (url) =>
        new Promise((resolve, reject) => {
            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    return reject({ status: response.statusCode, error: `Error fetching data from ${url}` });
                }

                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => resolve(data));
            }).on('error', (error) => reject({ status: 500, error }));
        });

    const tomorrow = new Date(today);
    const yesterday = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    yesterday.setDate(today.getDate() - 1);

    const tomorrowUrl = `https://s3-us-west-2.amazonaws.com/idz-horoscopes/${formatDate(tomorrow)}`;
    const yesterdayUrl = `https://s3-us-west-2.amazonaws.com/idz-horoscopes/${formatDate(yesterday)}`;

    // Fetch data for today, tomorrow, and yesterday
    Promise.all([
        fetchData(todayUrl),
        fetchData(tomorrowUrl),
        fetchData(yesterdayUrl)
    ])
        .then(([todayData, tomorrowData, yesterdayData]) => {
            const encryptedTodayData = encryptData(JSON.parse(todayData));
            const encryptedTomorrowData = encryptData(JSON.parse(tomorrowData));
            const encryptedyesterdayData = encryptData(JSON.parse(yesterdayData));

            res.json({
                today: encryptedTodayData,
                tomorrow: encryptedTomorrowData,
                yesterday: encryptedyesterdayData
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(error.status || 500).json({ error: error.error || 'Internal Server Error' });
        });
});


module.exports = router; // Export the router
