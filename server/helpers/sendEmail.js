const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Send email
        const info = await transporter.sendMail({
            from: `"EMS" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });

        console.log('Email sent:', info.messageId);
        return info;

    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
};

module.exports = sendEmail;