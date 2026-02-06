// nodemailer.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure that environment variables are loaded

// Configure your email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true, // Enables logging
    debug: true,  // Outputs detailed debug information
});

module.exports = transporter;
