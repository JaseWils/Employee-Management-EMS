<<<<<<< HEAD
const User = require('../models/User');
const Staff = require('../models/Staff');
const sendEmail = require('../helpers/sendEmail');

const UserRegistration = async (req, res) => {
    try {
        const { name, email, password, role = 'employee' } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            otp: {
                code: otp,
                expiresAt: otpExpiry
            }
        });

        // Send OTP email
        try {
            await sendEmail({
                to: email,
                subject: 'Verify Your Email - EMS',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #667eea;">Welcome to EMS!</h2>
                        <p>Your OTP for email verification is:</p>
                        <div style="background: #f7fafc; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 20px 0;">
                            ${otp}
                        </div>
                        <p>This OTP will expire in 10 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        return res.status(201).json({
            success: true,
            message: 'Registration successful. Please verify your email with the OTP sent.',
            data: {
                userId: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

module.exports = UserRegistration;
=======
// controllers/userController.js
const User = require('../models/User');
const transporter = require('./nodemailer');

const UserRegistration = async (req, res) => {
  try {
    const { email, password, confirmPassword, name, phone } = req.body;

    // Check if the email already exists
    const checkEmail = await User.findOne({ email: email.toLowerCase() });
    if (checkEmail) {
      return res.status(400).json({
        message: "Email already exists. Please use a different email.",
        error: true,
      });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
        error: true,
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const newUser = new User({
      name,
      email,
      password,
      phone
    });

    // Generate and set OTP
    const otp = newUser.generateOTP();
    
    // Save user
    await newUser.save();

    // Send OTP email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code for Employee Management System Registration',
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    // Don't return password in response
    const userResponse = await User.findById(newUser._id);

    return res.status(201).json({
      message: "User registered successfully. Please check your email for OTP verification.",
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error("Error in User Registration:", error);
    return res.status(500).json({
      message: error.message || "An unexpected error occurred.",
      error: true,
    });
  }
};

module.exports = UserRegistration;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
