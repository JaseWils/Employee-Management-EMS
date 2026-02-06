const Salary = require('../../models/Salary');
const Staff = require('../../models/Staff');

const addSalary = async (req, res) => {
    const {
        employee,
        basicSalary,
        allowances,
        deductions,
        month,
        year,
        paymentMethod
    } = req.body;

    try {
        // Verify employee exists
        const staffExists = await Staff.findById(employee);
        if (!staffExists) {
            return res.status(404).json({
                message: 'Employee not found',
                error: true
            });
        }

        // Check if salary for this month/year already exists
        const existingSalary = await Salary.findOne({ employee, month, year });
        if (existingSalary) {
            return res.status(400).json({
                message: `Salary for ${month} ${year} already exists for this employee`,
                error: true
            });
        }

        const newSalary = new Salary({
            employee,
            basicSalary,
            allowances: {
                hra: allowances?.hra || 0,
                da: allowances?.da || 0,
                ta: allowances?.ta || 0,
                medical: allowances?.medical || 0,
                other: allowances?.other || 0
            },
            deductions: {
                pf: deductions?.pf || 0,
                tax: deductions?.tax || 0,
                insurance: deductions?.insurance || 0,
                other: deductions?.other || 0
            },
            month,
            year,
            paymentMethod: paymentMethod || 'Bank Transfer'
        });

        await newSalary.save();

        // Link salary to staff
        await Staff.findByIdAndUpdate(employee, { salary: newSalary._id });

        // Populate employee details
        await newSalary.populate('employee', 'fullName email');

        res.status(201).json({
            message: 'Salary added successfully',
            data: newSalary,
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

module.exports = addSalary;
