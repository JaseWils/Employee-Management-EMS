const Department = require('../../models/Department');

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
