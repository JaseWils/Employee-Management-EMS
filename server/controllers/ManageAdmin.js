const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

const listAdmins = async (req, res) => {
    try {
        const admins = await User.find({ $or: [{ isAdmin: true }, { role: { $in: ['admin', 'super_admin', 'hr_manager'] } }] }).select('-password');
        return res.status(200).json({ success: true, data: admins });
    } catch (error) {
        console.error('Error listing admins:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const { email, name } = req.body;
        const { adminId } = req.params;
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        if (req.files && req.files.photo) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.files.photo.tempFilePath);
                admin.profileImage = uploadResult.secure_url;
            } catch (uploadError) {
                console.error('Error uploading photo:', uploadError);
            }
        }
        if (name) admin.name = name;
        if (email) admin.email = email;
        await admin.save();
        return res.status(200).json({ success: true, message: 'Admin updated successfully', data: admin });
    } catch (error) {
        console.error('Error updating admin:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        await User.findByIdAndDelete(adminId);
        return res.status(200).json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { listAdmins, updateAdmin, deleteAdmin };
