const User = require('../models/User');

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        const user = await User.findOne({ email: email.toLowerCase() }).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found with this email' });
        }
        return res.status(200).json({ success: true, message: 'Email found', data: { email: user.email, name: user.name, role: user.role, _id: user._id } });
    } catch (error) {
        console.error('Check email error:', error);
        return res.status(500).json({ success: false, message: 'Error checking email', error: error.message });
    }
};

module.exports = checkEmail;
