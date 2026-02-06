const User = require('../models/User');
const transporter = require('./nodemailer');

const UserRegistration = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, role = 'employee' } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const newUser = new User({ name, email: email.toLowerCase(), password, phone, role });
        const otp = newUser.generateOTP();
        await newUser.save();

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify Your Email - EMS',
                html: `<div style="font-family: Arial;"><h2>Welcome to EMS!</h2><p>Your OTP: <strong>${otp}</strong></p><p>Expires in 10 minutes.</p></div>`
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        const userResponse = await User.findById(newUser._id);
        return res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.', data: userResponse });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
    }
};

module.exports = UserRegistration;
