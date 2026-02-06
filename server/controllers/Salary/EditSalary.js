const Salary = require('../../models/Salary');

const editSalary = async (req, res) => {
    const salaryId = req.params.id;
    
    try {
        const salary = await Salary.findById(salaryId);

        if (!salary) {
            return res.status(404).json({
                message: 'Salary not found',
                error: true
            });
        }

        const { basicSalary, allowances, deductions, paymentStatus, paymentMethod, paymentDate } = req.body;

        const updateData = {
            ...(basicSalary && { basicSalary }),
            ...(paymentStatus && { paymentStatus }),
            ...(paymentMethod && { paymentMethod }),
            ...(paymentDate && { paymentDate: new Date(paymentDate) })
        };

        if (allowances) {
            updateData.allowances = {
                ...salary.allowances,
                ...allowances
            };
        }

        if (deductions) {
            updateData.deductions = {
                ...salary.deductions,
                ...deductions
            };
        }

        // Recalculate totals
        const allAllowances = updateData.allowances || salary.allowances;
        const allDeductions = updateData.deductions || salary.deductions;
        const basic = updateData.basicSalary || salary.basicSalary;

        const totalAllowances = Object.values(allAllowances).reduce((a, b) => a + b, 0);
        const totalDeductions = Object.values(allDeductions).reduce((a, b) => a + b, 0);
        updateData.totalSalary = basic + totalAllowances;
        updateData.netSalary = updateData.totalSalary - totalDeductions;

        const updatedSalary = await Salary.findByIdAndUpdate(
            salaryId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('employee', 'fullName email');

        res.json({
            message: 'Salary updated successfully',
            data: updatedSalary,
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

module.exports = editSalary;
