const Salary = require('../../models/Salary');
const Staff = require('../../models/Staff');

const deleteSalary = async (req, res) => {
    try {
        const salaryId = req.params.id;
        const salary = await Salary.findById(salaryId);
        if (!salary) {
            return res.status(404).json({ success: false, message: 'Salary not found' });
        }
        await Staff.findByIdAndUpdate(salary.employee, { $unset: { salary: 1 } });
        const deletedSalary = await Salary.findByIdAndDelete(salaryId);
        res.json({ success: true, message: 'Salary deleted successfully', data: deletedSalary });
    } catch (error) {
        console.error('Delete salary error:', error);
        res.status(500).json({ success: false, message: 'Error deleting salary', error: error.message });
    }
};

module.exports = deleteSalary;
