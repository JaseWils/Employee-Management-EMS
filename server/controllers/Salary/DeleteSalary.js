const Salary = require('../../models/Salary');
<<<<<<< HEAD

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
=======
const Staff = require('../../models/Staff');

const deleteSalary = async (req, res) => {
    const salaryId = req.params.id;
    
    try {
        const salaryToDelete = await Salary.findById(salaryId);

        if (!salaryToDelete) {
            return res.status(404).json({
                message: 'Salary not found',
                error: true
            });
        }

        // Remove salary reference from staff
        await Staff.findByIdAndUpdate(salaryToDelete.employee, { $unset: { salary: 1 } });

        const deletedSalary = await Salary.findByIdAndDelete(salaryId);

        res.json({
            message: 'Salary deleted successfully',
            data: deletedSalary,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
            error: error.message
        });
    }
};

<<<<<<< HEAD
module.exports = deleteSalary;
=======
module.exports = deleteSalary;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
