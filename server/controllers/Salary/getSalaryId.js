const Salary = require('../../models/Salary');

const getSalaryByEmployeeId = async (req, res) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
            error: error.message
        });
    }
};

<<<<<<< HEAD
module.exports = getSalaryByEmployeeId;
=======
module.exports = getSalaryByEmployeeId;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
