const Salary = require('../../models/Salary');
const Staff = require('../../models/Staff');

const addSalary = async (req, res) => {
    try {
        const { employee, basicSalary, allowances, deductions, month, year, effectiveFrom, currency, paymentFrequency, paymentMethod } = req.body;
        const staffExists = await Staff.findById(employee);
        if (!staffExists) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        const existingSalary = await Salary.findOne({ employee, isActive: true });
        if (existingSalary) {
            existingSalary.isActive = false;
            await existingSalary.save();
        }
        const newSalary = new Salary({
            employee,
            basicSalary,
            allowances: {
                houseRent: allowances?.houseRent || allowances?.hra || 0,
                transport: allowances?.transport || allowances?.ta || 0,
                medical: allowances?.medical || 0,
                food: allowances?.food || 0,
                bonus: allowances?.bonus || allowances?.da || 0,
                other: allowances?.other || 0
            },
            deductions: {
                tax: deductions?.tax || 0,
                insurance: deductions?.insurance || 0,
                providentFund: deductions?.providentFund || deductions?.pf || 0,
                loan: deductions?.loan || 0,
                advance: deductions?.advance || 0,
                other: deductions?.other || 0
            },
            month,
            year,
            effectiveFrom: effectiveFrom || new Date(),
            currency: currency || 'USD',
            paymentFrequency: paymentFrequency || 'monthly',
            paymentMethod: paymentMethod || 'Bank Transfer',
            isActive: true
        });
        await newSalary.save();
        if (employee) {
            await Staff.findByIdAndUpdate(employee, { salary: newSalary._id });
        }
        await newSalary.populate('employee', 'fullName email employeeId department');
        res.status(201).json({ success: true, message: 'Salary added successfully', data: newSalary });
    } catch (error) {
        console.error('Add salary error:', error);
        res.status(500).json({ success: false, message: 'Error adding salary', error: error.message });
    }
};

module.exports = addSalary;
