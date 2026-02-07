const Department = require('../../models/Department');
const Staff = require('../../models/Staff');

const deleteDepartment = async (req, res) => {
    try {
        const deptId = req.params.id;
        const department = await Department.findById(deptId);
        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }
        const employeeCount = await Staff.countDocuments({ department: deptId });
        if (employeeCount > 0) {
            return res.status(400).json({ success: false, message: `Cannot delete department with ${employeeCount} active employees. Please reassign them first.` });
        }
        const deletedDept = await Department.findByIdAndDelete(deptId);
        res.status(200).json({ success: true, message: 'Department deleted successfully', data: deletedDept });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting department', error: error.message });
    }
};

module.exports = deleteDepartment;
