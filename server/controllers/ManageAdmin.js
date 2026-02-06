const User = require('../models/User');
<<<<<<< HEAD

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
=======
const cloudinary = require('cloudinary').v2;

// List all admins
const listAdmins = async (req, res) => {
    try {
        // Fetch all users with admin role
        const admins = await User.find({ isAdmin: true });
        return res.status(200).json({
            data: admins,
            success: true
        });
    } catch (error) {
        console.error("Error listing admins:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: true
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
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
=======
// Update admin details
const updateAdmin = async (req, res) => {
    const { email, name } = req.body;
    const { adminId } = req.params;

    if (!email || !name) {
        return res.status(400).json({
            message: "Email and name are required",
            error: true
        });
    }

    try {
        // Find the admin to be updated
        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            return res.status(404).json({
                message: "Admin not found",
                error: true
            });
        }

        // Handle file upload if provided
        if (req.files && req.files.photo) {
            const photo = req.files.photo;

            try {
                const uploadResult = await cloudinary.uploader.upload(photo.tempFilePath);
                admin.profileImage = uploadResult.secure_url;
            } catch (uploadError) {
                console.error("Error uploading photo to Cloudinary:", uploadError);
                return res.status(500).json({
                    message: "Error uploading photo",
                    error: true
                });
            }
        }

        // Update admin details
        admin.name = name;
        admin.email = email;
        await admin.save();

        return res.status(200).json({
            message: "Admin details updated successfully",
            success: true
        });
    } catch (error) {
        console.error("Error updating admin details:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: true
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
=======
// Delete an admin
const deleteAdmin = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            return res.status(404).json({
                message: "Admin not found",
                error: true
            });
        }
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d

        await User.findByIdAndDelete(adminId);

        return res.status(200).json({
<<<<<<< HEAD
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting admin',
            error: error.message
=======
            message: "Admin deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("Error deleting admin:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: true
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
module.exports = { listAdmins, updateAdmin, deleteAdmin };
=======
module.exports = {
    listAdmins,
    updateAdmin,
    deleteAdmin
};
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
