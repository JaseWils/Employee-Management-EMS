const Salary = require('../../models/Salary');

const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find()
            .populate('employee', 'fullName email department')
            .sort({ year: -1, month: -1 });

        res.json({
            message: 'All salaries retrieved successfully',
            data: salaries,
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

module.exports = getAllSalaries;
