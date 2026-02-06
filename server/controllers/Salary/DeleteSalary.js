const Salary = require('../../models/Salary');
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
            error: error.message
        });
    }
};

module.exports = deleteSalary;
