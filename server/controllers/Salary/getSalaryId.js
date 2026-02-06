const Salary = require('../../models/Salary');

const getSalaryByEmployeeId = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const salaries = await Salary.find({ employee: employeeId }).sort({ year: -1, month: -1 });
        if (salaries.length === 0) {
            return res.status(404).json({ success: false, message: 'No salary records found' });
        }
        res.json({ success: true, message: 'Salaries retrieved', data: salaries });
    } catch (error) {
        console.error('Get salary error:', error);
        res.status(500).json({ success: false, message: 'Error fetching salary', error: error.message });
    }
};

module.exports = getSalaryByEmployeeId;
