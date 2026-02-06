const Salary = require('../../models/Salary');

const editSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const salary = await Salary.findById(id);

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary configuration not found'
            });
        }

        const updatedSalary = await Salary.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employee', 'fullName email employeeId');

        return res.status(200).json({
            success: true,
            message: 'Salary configuration updated successfully',
            data: updatedSalary
        });

    } catch (error) {
        console.error('Edit salary error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating salary configuration',
            error: error.message
        });
    }
};

module.exports = editSalary;