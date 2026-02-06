const Department = require('../../models/Department');
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