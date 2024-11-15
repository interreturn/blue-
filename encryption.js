const CryptoJS = require("crypto-js");
require('dotenv').config();


const secretKey =  process.env.encryptionkey|| 'your-secret-key'; 

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

module.exports = encryptData;