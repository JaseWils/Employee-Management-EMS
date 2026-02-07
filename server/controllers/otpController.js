const User = require('../models/User');
const transporter = require('./nodemailer');

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const otp = user.generateOTP();
        await user.save();
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code - EMS',
            html: `<div style="font-family: Arial;"><h2>Your OTP Code</h2><p style="font-size: 32px; font-weight: bold;">${otp}</p><p>Expires in 10 minutes.</p></div>`
        });
        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() }).select('+otp +otpExpire');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        if (Date.now() > user.otpExpire) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }
        user.isVerified = true;
        user.isEmailVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();
        return res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
    }
};

module.exports = { sendOtp, verifyOtp };
