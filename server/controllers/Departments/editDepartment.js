const Department = require('../../models/Department');

const editDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, head, isActive } = req.body;

        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Check if new name conflicts with existing department
        if (name && name !== department.name) {
            const existingDept = await Department.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp(`^${name}$`, 'i') }
            });

            if (existingDept) {
                return res.status(400).json({
                    success: false,
                    message: 'Department name already exists'
                });
            }
        }

        const updatedDepartment = await Department.findByIdAndUpdate(
            id,
            { name, description, head, isActive },
            { new: true, runValidators: true }
        ).populate('head', 'fullName email');

        return res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: updatedDepartment
        });

    } catch (error) {
        console.error('Edit department error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating department',
            error: error.message
        });
    }
};

module.exports = editDepartment;