const Staff = require('../../models/Staff');
const cloudinary = require('cloudinary').v2;

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
    return process.env.CLOUDINARY_API_KEY && 
           process.env.CLOUDINARY_API_KEY !== 'your-cloudinary-api-key' &&
           process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-cloud-name';
};

const editStaffs = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const staff = await Staff.findById(id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Handle profile image update
        if (req.files && req.files.profileImage) {
            if (isCloudinaryConfigured()) {
                const file = req.files.profileImage;
                
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'ems/employees',
                    public_id: `employee_${staff.employeeId}`,
                    overwrite: true
                });

                updateData.profileImage = result.secure_url;
            } else {
                console.log('⚠️  Cloudinary not configured - skipping image upload');
                // Generate avatar URL based on full name
                const fullName = updateData.fullName || staff.fullName;
                updateData.profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=667eea&color=fff&size=200`;
            }
        }

        // Parse JSON strings if needed
        if (typeof updateData.address === 'string') {
            updateData.address = JSON.parse(updateData.address);
        }
        if (typeof updateData.emergencyContact === 'string') {
            updateData.emergencyContact = JSON.parse(updateData.emergencyContact);
        }

        // Update staff
        const updatedStaff = await Staff.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('department', 'name');

        return res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: updatedStaff
        });

    } catch (error) {
        console.error('Edit staff error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
};

module.exports = editStaffs;