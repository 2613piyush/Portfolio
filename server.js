const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (important for local file testing)
app.use(cors());
app.use(express.json());

// Check if credentials exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-16-character-app-password') {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: EMAIL_USER or EMAIL_PASS is not correctly set in .env file!');
}

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test the transporter on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Nodemailer verification failed:', error.message);
    } else {
        console.log('Server is ready to send emails!');
    }
});

// Routes
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Received message from: ${name} (${email})`);

    // Email content
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `New Portfolio Message from ${name}`,
        text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
        `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
        console.log('Email sent successfully!');
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `--------------------------------------------------`);
    console.log('\x1b[36m%s\x1b[0m', `Backend Server is running on: http://localhost:${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', `Press Ctrl + C to stop the server`);
    console.log('\x1b[36m%s\x1b[0m', `--------------------------------------------------`);
});
