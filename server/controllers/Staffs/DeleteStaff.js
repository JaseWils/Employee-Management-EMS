const Staff = require('../../models/Staff');
<<<<<<< HEAD
const cloudinary = require('cloudinary').v2;

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
            const file = req.files.profileImage;
            
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'ems/employees',
                public_id: `employee_${staff.employeeId}`,
                overwrite: true
            });

            updateData.profileImage = result.secure_url;
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
=======
const Department = require('../../models/Department');

const deleteStaff = async (req, res) => {
  const staffId = req.params.id;

  try {
    const staffToDelete = await Staff.findById(staffId);

    if (!staffToDelete) {
      return res.status(404).json({
        message: "Staff Not Found",
        error: true
      });
    }

    // Decrease department employee count
    if (staffToDelete.department) {
      await Department.findByIdAndUpdate(
        staffToDelete.department, 
        { $inc: { employeeCount: -1 } }
      );
    }

    const deletedStaff = await Staff.findByIdAndDelete(staffId);

    res.status(200).json({
      message: "Staff deleted successfully",
      data: deletedStaff,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting staff',
      error: error.message,
    });
  }
};

module.exports = deleteStaff;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
