const Department = require('../../models/Department');
<<<<<<< HEAD
const Staff = require('../../models/Staff');

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Check if department has employees
        const employeeCount = await Staff.countDocuments({ department: id });

        if (employeeCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete department with ${employeeCount} active employees. Please reassign them first.`
            });
        }

        await Department.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });

    } catch (error) {
        console.error('Delete department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting department',
            error: error.message
        });
    }
};

module.exports = deleteDepartment;
=======

const deleteDept = async (req, res) => {
  const deptId = req.params.id;

  try {
    const deletedDept = await Department.findByIdAndDelete(deptId);

    if (!deletedDept) {
      return res.status(404).json({
        message: 'Department not found',
        error: true
      });
    }

    res.status(200).json({
      message: 'Department deleted successfully',
      data: deletedDept,
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting department',
      error: error.message,
    });
  }
};

module.exports = deleteDept;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
