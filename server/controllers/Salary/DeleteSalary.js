const Salary = require('../../models/Salary');

const deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;

        const salary = await Salary.findById(id);

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'Salary configuration not found'
            });
        }

        // Soft delete - deactivate instead of removing
        salary.isActive = false;
        await salary.save();

        return res.status(200).json({
            success: true,
            message: 'Salary configuration deleted successfully'
        });

    } catch (error) {
        console.error('Delete salary error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting salary configuration',
            error: error.message
        });
    }
};

module.exports = deleteSalary;