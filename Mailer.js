const nodemailer = require('nodemailer');

// Gmail account details for SMTP
const USER_EMAIL = 'touchzinginterns@gmail.com'; // Your Gmail account
const USER_PASSWORD = 'swuu lhdv ingj mxjg'; // You need to generate an app-specific password

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD, // Use an app password instead of your regular Gmail password
  },
});

async function sendEmail(to, subject, text, html) {
  try {
    const mailOptions = {
      from: `touchzing media <${USER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Optional: rethrow to handle it in the calling function
  }
}

module.exports = sendEmail;
