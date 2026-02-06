const Salary = require('../../models/Salary');

const editSalary = async (req, res) => {
    try {
        const salaryId = req.params.id;
        const salary = await Salary.findById(salaryId);
        if (!salary) {
            return res.status(404).json({ success: false, message: 'Salary not found' });
        }
        const { basicSalary, allowances, deductions, paymentStatus, paymentMethod, paymentDate } = req.body;
        const updateData = {};
        if (basicSalary) updateData.basicSalary = basicSalary;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (paymentMethod) updateData.paymentMethod = paymentMethod;
        if (paymentDate) updateData.paymentDate = new Date(paymentDate);
        if (allowances) updateData.allowances = { ...salary.allowances, ...allowances };
        if (deductions) updateData.deductions = { ...salary.deductions, ...deductions };
        const updatedSalary = await Salary.findByIdAndUpdate(salaryId, { $set: updateData }, { new: true, runValidators: true }).populate('employee', 'fullName email');
        res.json({ success: true, message: 'Salary updated successfully', data: updatedSalary });
    } catch (error) {
        console.error('Edit salary error:', error);
        res.status(500).json({ success: false, message: 'Error updating salary', error: error.message });
    }
};

module.exports = editSalary;
