const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, // Set to true if using SSL/TLS
    auth: {
        user: 'testforuserdevelopment@gmail.com', // Your email address
        pass: '299792.458', // Your email password or app password
    },
});

module.exports = transporter;
