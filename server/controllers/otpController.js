const crypto = require('crypto'); 
const transporter = require('./nodemailer'); 
const User = require('../models/User'); 

// Generate OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send email with OTP
const sendEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code for Employee Management System',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};


const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpire');
        if (!user) {
            return res.status(400).json({ message: 'User not found', error: true });
        }

        // Generate OTP using model method
        const otp = user.generateOTP();
        await user.save();

        // Send email
        await sendEmail(email, otp);

        return res.status(200).json({ message: 'OTP sent successfully', success: true });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: error.message || 'An unexpected error occurred.', error: true });
    }
};


// Verify OTP Endpoint
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpire');
        if (!user) {
            return res.status(400).json({ message: 'User not found', error: true });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP', error: true });
        }

        // Check if OTP has expired
        if (Date.now() > user.otpExpire) {
            return res.status(400).json({ message: 'OTP has expired', error: true });
        }

        // OTP is valid, update user verification status
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        return res.status(200).json({ message: 'Email verified successfully', success: true });
    } catch (error) {
        console.error('Error in OTP verification:', error);
        return res.status(500).json({ message: error.message || 'An unexpected error occurred.', error: true });
    }
};

module.exports = { sendOtp, verifyOtp, generateOTP, sendEmail };
