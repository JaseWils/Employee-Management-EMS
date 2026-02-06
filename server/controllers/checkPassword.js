const User = require('../models/User');
const jwt = require('jsonwebtoken');

const checkPassword = async (req, res) => {
    try {
        const { email, password, userId } = req.body;
        let user;
        if (email) {
            user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        } else if (userId) {
            user = await User.findById(userId).select('+password');
        }
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE || '7d' });
        user.lastLogin = new Date();
        await user.save();
        const userResponse = await User.findById(user._id);
        return res.status(200).json({ success: true, message: 'Login successful', token, user: { id: userResponse._id, name: userResponse.name, email: userResponse.email, role: userResponse.role } });
    } catch (error) {
        console.error('Password check error:', error);
        return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

module.exports = checkPassword;
