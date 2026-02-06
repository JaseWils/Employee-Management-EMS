const Staff = require('../../models/Staff');
<<<<<<< HEAD
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
=======
const Department = require('../../models/Department');

const editStaff = async (req, res) => {
  const staffId = req.params.id;

  try {
    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({
        message: "Staff Not Found",
        error: true,
      });
    }

    const {
      fullName,
      department,
      gender,
      email,
      mobile,
      photo,
      dateOfBirth,
      dateOfJoining,
      city,
      street,
      state,
      country,
      postalCode,
      designation,
      isActive
    } = req.body;

    // Handle department change
    if (department && department !== staff.department?.toString()) {
      // Verify new department exists
      const deptExists = await Department.findById(department);
      if (!deptExists) {
        return res.status(400).json({ error: 'Department not found' });
      }
      // Decrease old department count
      if (staff.department) {
        await Department.findByIdAndUpdate(staff.department, { $inc: { employeeCount: -1 } });
      }
      // Increase new department count
      await Department.findByIdAndUpdate(department, { $inc: { employeeCount: 1 } });
    }

    const updatedData = {
      ...(fullName && { fullName }),
      ...(department && { department }),
      ...(gender && { gender }),
      ...(email && { email }),
      ...(mobile && { mobile }),
      ...(photo !== undefined && { photo }),
      ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
      ...(dateOfJoining && { dateOfJoining: new Date(dateOfJoining) }),
      ...(designation && { designation }),
      ...(isActive !== undefined && { isActive }),
      address: {
        ...staff.address,
        ...(city && { city }),
        ...(street && { street }),
        ...(state && { state }),
        ...(country && { country }),
        ...(postalCode && { postalCode })
      }
    };

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      updatedData,
      { new: true, runValidators: true }
    ).populate('department', 'name');

    res.status(200).json({
      message: 'Staff Details Updated Successfully',
      data: updatedStaff,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating staff',
      error: error.message,
    });
  }
};

module.exports = editStaff;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
