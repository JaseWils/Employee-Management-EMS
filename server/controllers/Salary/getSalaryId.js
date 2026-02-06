const Salary = require('../../models/Salary');

const getSalaryByEmployeeId = async (req, res) => {
    const employeeId = req.params.id;
    
    try {
        const salaries = await Salary.find({ employee: employeeId })
            .sort({ year: -1, month: -1 });

        if (salaries.length === 0) {
            return res.status(404).json({
                message: 'No salary records found for this employee',
                error: true
            });
        }

        res.json({
            message: 'Salaries retrieved successfully for employee',
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

module.exports = getSalaryByEmployeeId;
