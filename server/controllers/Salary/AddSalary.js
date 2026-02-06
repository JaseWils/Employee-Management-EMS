const Salary = require('../../models/Salary');

const addSalary = async (req, res) => {
    try {
        const {
            employee,
            basicSalary,
            allowances,
            deductions,
            effectiveFrom,
            currency,
            paymentFrequency
        } = req.body;

        // Check if employee already has an active salary
        const existingSalary = await Salary.findOne({ 
            employee, 
            isActive: true 
        });

        if (existingSalary) {
            // Deactivate old salary
            existingSalary.isActive = false;
            await existingSalary.save();
        }

        const salary = await Salary.create({
            employee,
            basicSalary,
            allowances: allowances || {},
            deductions: deductions || {},
            effectiveFrom: effectiveFrom || new Date(),
            currency: currency || 'USD',
            paymentFrequency: paymentFrequency || 'monthly',
            isActive: true
        });

        const populatedSalary = await Salary.findById(salary._id)
            .populate('employee', 'fullName email employeeId department');

        return res.status(201).json({
            success: true,
            message: 'Salary configuration created successfully',
            data: populatedSalary
        });

    } catch (error) {
        console.error('Add salary error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating salary configuration',
            error: error.message
        });
    }
};

module.exports = addSalary;