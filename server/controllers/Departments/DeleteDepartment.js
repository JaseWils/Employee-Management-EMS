const Department = require('../../models/Department');

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
