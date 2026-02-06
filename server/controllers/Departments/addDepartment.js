const Department = require('../../models/Department');

const addDepartment = async (req, res) => {
    try {
        const { name, description, head } = req.body;
        const existingDept = await Department.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingDept) {
            return res.status(400).json({ success: false, message: 'Department already exists' });
        }
        const department = await Department.create({ name, description, head: head || undefined, isActive: true });
        const populatedDept = await Department.findById(department._id).populate('head', 'fullName email');
        return res.status(201).json({ success: true, message: 'Department created successfully', data: populatedDept });
    } catch (error) {
        console.error('Add department error:', error);
        return res.status(500).json({ success: false, message: 'Error creating department', error: error.message });
    }
};

module.exports = addDepartment;
