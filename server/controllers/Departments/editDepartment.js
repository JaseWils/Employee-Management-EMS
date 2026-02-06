const Department = require('../../models/Department');

const editDepartment = async (req, res) => {
    try {
        const deptId = req.params.id;
        const { name, description, head, isActive } = req.body;
        if (!deptId) {
            return res.status(400).json({ success: false, message: 'Department ID not found' });
        }
        if (name) {
            const existingDept = await Department.findOne({ _id: { $ne: deptId }, name: { $regex: new RegExp(`^${name}$`, 'i') } });
            if (existingDept) {
                return res.status(400).json({ success: false, message: 'Department name already exists' });
            }
        }
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (head !== undefined) updateFields.head = head;
        if (description !== undefined) updateFields.description = description;
        if (isActive !== undefined) updateFields.isActive = isActive;
        const updatedDept = await Department.findByIdAndUpdate(deptId, updateFields, { new: true, runValidators: true }).populate('head', 'fullName email');
        if (!updatedDept) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }
        res.status(200).json({ success: true, message: 'Department Updated Successfully', data: updatedDept });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating department', error: error.message });
    }
};

module.exports = editDepartment;
