<<<<<<< HEAD
const User = require('../models/User');
const sendEmail = require('../helpers/sendEmail');
=======
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

>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

<<<<<<< HEAD
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = {
            code: otp,
            expiresAt: otpExpiry
        };
        await user.save();

        // Send OTP email
        await sendEmail({
            to: email,
            subject: 'Your OTP Code - EMS',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">Your OTP Code</h2>
                    <p>Your OTP for verification is:</p>
                    <div style="background: #f7fafc; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        });

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error sending OTP',
            error: error.message
        });
    }
};

=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

<<<<<<< HEAD
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.otp || !user.otp.code) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found. Please request a new one.'
            });
        }

        if (new Date() > user.otp.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        if (user.otp.code !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.otp = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying OTP',
            error: error.message
        });
    }
};

module.exports = { sendOtp, verifyOtp };
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
