const User = require('../models/User');

const listAdmins = async (req, res) => {
    try {
        const admins = await User.find({
            role: { $in: ['admin', 'super_admin', 'hr_manager'] }
        }).select('-password');

        return res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching admins',
            error: error.message
        });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        const updates = req.body;

        const admin = await User.findByIdAndUpdate(
            adminId,
            updates,
            { new: true }
        ).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            data: admin
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating admin',
            error: error.message
        });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        await User.findByIdAndDelete(adminId);

        return res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting admin',
            error: error.message
        });
    }
};

module.exports = { listAdmins, updateAdmin, deleteAdmin };