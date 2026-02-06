const Department = require('../../models/Department');
const Staff = require('../../models/Staff');

const getDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            const department = await Department.findById(id)
                .populate('head', 'fullName email position');

            if (!department) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
            }

            // Get employee count
            const employeeCount = await Staff.countDocuments({ 
                department: id,
                isActive: true 
            });

            return res.status(200).json({
                success: true,
                data: {
                    ...department.toObject(),
                    employeeCount
                }
            });
        }

        // Get all departments
        const departments = await Department.find()
            .populate('head', 'fullName email')
            .sort({ name: 1 });

        // Add employee count for each department
        const departmentsWithCount = await Promise.all(
            departments.map(async (dept) => {
                const count = await Staff.countDocuments({ 
                    department: dept._id,
                    isActive: true 
                });
                return {
                    ...dept.toObject(),
                    employeeCount: count
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: departmentsWithCount
        });

    } catch (error) {
        console.error('Get department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching departments',
            error: error.message
        });
    }
};

module.exports = getDepartment;