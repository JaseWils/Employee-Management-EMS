const Salary = require('../../models/Salary');

const getSalaryByEmployeeId = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const salary = await Salary.findOne({ 
            employee: employeeId, 
            isActive: true 
        }).populate('employee', 'fullName email employeeId department');

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: 'No active salary configuration found for this employee'
            });
        }

        return res.status(200).json({
            success: true,
            data: salary
        });

    } catch (error) {
        console.error('Get salary by employee ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching salary configuration',
            error: error.message
        });
    }
};

module.exports = getSalaryByEmployeeId;