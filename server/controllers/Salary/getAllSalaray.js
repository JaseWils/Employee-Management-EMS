const Salary = require('../../models/Salary');

const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find().populate('employee', 'fullName email department').sort({ createdAt: -1 });
        res.json({ success: true, message: 'All salaries retrieved', data: salaries });
    } catch (error) {
        console.error('Get salaries error:', error);
        res.status(500).json({ success: false, message: 'Error fetching salaries', error: error.message });
    }
};

module.exports = getAllSalaries;
