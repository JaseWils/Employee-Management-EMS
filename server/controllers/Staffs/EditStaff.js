const Staff = require('../../models/Staff');
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
