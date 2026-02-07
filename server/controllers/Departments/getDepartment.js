const Department = require('../../models/Department');

const getDepartment = async (req, res) => {
    try {
        const deptId = req.params.id;
        if (deptId) {
            const dept = await Department.findById(deptId).populate('head', 'name email fullName');
            if (!dept) {
                return res.status(404).json({ success: false, message: 'Department not found' });
            }
            return res.json({ success: true, message: 'Department Found', data: dept });
        } else {
            const allDepts = await Department.find({ isActive: true }).populate('head', 'name email fullName');
            return res.json({ success: true, message: 'All Departments Found', data: allDepts });
        }
    } catch (error) {
        console.error('Get department error:', error);
        return res.status(500).json({ success: false, message: 'Error fetching departments', error: error.message });
    }
};

module.exports = getDepartment;
