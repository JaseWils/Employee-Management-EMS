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
