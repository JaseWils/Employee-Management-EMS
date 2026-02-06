const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

const checkAdmin = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isAdmin = user.isAdmin || ['admin', 'super_admin', 'hr_manager'].includes(user.role);
        return res.status(200).json({ success: true, isAdmin, role: user.role, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Check admin error:', error);
        return res.status(500).json({ success: false, message: 'Error checking admin status', error: error.message });
    }
};

module.exports = checkAdmin;
