const transporter = require('./configureEmail'); // Import the configured nodemailer transporter

async function sendEmail({ to, subject, message }) {
    try {
        // Send email using nodemailer
        await transporter.sendMail({
            from: 'testforuserdevelopment@gmail.com', // Your email address
            to,
            subject,
            html: message, // Assuming the message is in HTML format
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;
