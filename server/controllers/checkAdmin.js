const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

const assignAdminRole = async (req, res) => {
    const { email, name } = req.body;
    console.log("Request Files:", req.files);
    console.log("Request Body:", req.body);

    // Validate input
    if (!email || !name) {
        return res.status(400).json({
            message: "Email and name are required",
            error: true
        });
    }

    // Check if the requesting user is an admin
    if (!req.user) {
        return res.status(401).json({
            message: "User not authenticated",
            error: true
        });
    }

    const requestingUser = req.user;
    if (!requestingUser.isAdmin) {
        return res.status(403).json({
            message: "You do not have permission to assign admin roles",
            error: true
        });
    }

    try {
        // Find the user to be promoted
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true
            });
        }

        // Check if the user is already an admin
        if (user.isAdmin) {
            return res.status(400).json({
                message: "User is already an admin",
                error: true
            });
        }

        // Handle file upload if provided
        if (req.files && req.files.photo) {
            const photo = req.files.photo;

            try {
                const uploadResult = await cloudinary.uploader.upload(photo.tempFilePath);
                user.profileImage = uploadResult.secure_url;
            } catch (uploadError) {
                console.error("Error uploading photo to Cloudinary:", uploadError);
                return res.status(500).json({
                    message: "Error uploading photo",
                    error: true
                });
            }
        }

        // Update the user's role to admin
        user.isAdmin = true;
        user.name = name;
        await user.save();

        return res.status(200).json({
            message: "User role updated to admin successfully",
            success: true
        });
    } catch (error) {
        console.error("Error in Assign Admin Role Controller:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: true
        });
    }
};

module.exports = assignAdminRole;
