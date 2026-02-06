const Staff = require('../../models/Staff');
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
