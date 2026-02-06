const Staff = require('../../models/Staff');
const Department = require('../../models/Department');
const cloudinary = require('cloudinary').v2;

const editStaff = async (req, res) => {
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

        // Handle profile image update with Cloudinary
        if (req.files && req.files.profileImage) {
            const file = req.files.profileImage;
            
            try {
                // Check if Cloudinary is configured
                if (process.env.CLOUDINARY_CLOUD_NAME && 
                    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
                    const result = await cloudinary.uploader.upload(file.tempFilePath, {
                        folder: 'ems/employees',
                        public_id: `employee_${staff.employeeId}`,
                        overwrite: true
                    });
                    updateData.profileImage = result.secure_url;
                } else {
                    console.log('Cloudinary not configured, skipping image upload');
                }
            } catch (uploadError) {
                console.error('Error uploading to Cloudinary:', uploadError);
            }
        }

        // Handle department change
        const oldDepartment = staff.department;
        const newDepartment = updateData.department;

        if (newDepartment && oldDepartment && 
            oldDepartment.toString() !== newDepartment.toString()) {
            // Decrease old department count
            await Department.findByIdAndUpdate(oldDepartment, {
                $inc: { employeeCount: -1 }
            });
            // Increase new department count
            await Department.findByIdAndUpdate(newDepartment, {
                $inc: { employeeCount: 1 }
            });
        }

        // Parse JSON strings if needed
        if (typeof updateData.address === 'string') {
            try {
                updateData.address = JSON.parse(updateData.address);
            } catch (e) {}
        }
        if (typeof updateData.emergencyContact === 'string') {
            try {
                updateData.emergencyContact = JSON.parse(updateData.emergencyContact);
            } catch (e) {}
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

module.exports = editStaff;
