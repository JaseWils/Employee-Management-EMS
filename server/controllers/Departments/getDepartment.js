const Department = require('../../models/Department');
<<<<<<< HEAD
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
=======

const getDepartment = async (req, res) => {
    const deptId = req.params.id;

    try {
        if (deptId) {
            const dept = await Department.findById(deptId).populate('head', 'name email');
            if (!dept) {
                return res.status(404).json({ error: 'Department not found' });
            }   
            return res.json({
                message: "Department Found",
                data: dept,
                success: true
            });
        } else {
            // Get all departments
            const allDepts = await Department.find({ isActive: true }).populate('head', 'name email');
            return res.json({
                message: "All Departments Found",
                data: allDepts,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in get department Controller", error)
        console.error('Error fetching departments', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = getDepartment;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
