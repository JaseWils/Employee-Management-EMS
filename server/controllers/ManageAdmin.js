const User = require('../models/User');
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
        });
    }
};

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
        });
    }
};

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

        await User.findByIdAndDelete(adminId);

        return res.status(200).json({
            message: "Admin deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("Error deleting admin:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: true
        });
    }
};

module.exports = {
    listAdmins,
    updateAdmin,
    deleteAdmin
};
