


const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Your OAuth2 credentials
const CLIENT_ID = '214634605651-2lh78q02270183ooi6shit40uogvgvcf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//0439pE3KF51edCgYIARAAGAQSNwF-L9IrayqvoEw7qPLfTiyTkcsmwOZDfJykuNNOc_pQWslYQvXGlNcttXIwwY57SnCu-Yg6SVc'

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendEmail(to, subject, text, html) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'touchzinginterns@gmail.com', // your Gmail account
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: 'Your Name <touchzinginterns@gmail.com>',
      to,
      subject,
      text,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Optional: rethrow to handle it in the calling function
  }
}

//currently mail is not working due to some credentials issue they are expired  propbaly refresh token is only expired and . its beeter to use nodemailer but you 
//i didnt use it because it needs gmail access or twofactor authentication and for that it needs phone no thats the reason

module.exports = sendEmail;
