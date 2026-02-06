const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    basicSalary: {
        type: Number,
        required: [true, 'Basic salary is required'],
        min: [0, 'Salary cannot be negative']
    },
    allowances: {
        houseRent: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        bonus: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    deductions: {
        tax: { type: Number, default: 0 },
        insurance: { type: Number, default: 0 },
        providentFund: { type: Number, default: 0 },
        loan: { type: Number, default: 0 },
        advance: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    month: { type: String },
    year: { type: Number },
    totalSalary: { type: Number },
    netSalary: { type: Number },
    effectiveFrom: { type: Date, default: Date.now },
    currency: { type: String, default: 'USD' },
    paymentFrequency: { type: String, enum: ['monthly', 'bi-weekly', 'weekly'], default: 'monthly' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'pending', 'paid'], default: 'Pending' },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ['Bank Transfer', 'Cash', 'Cheque', 'Online'], default: 'Bank Transfer' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

salarySchema.pre('save', function(next) {
    const totalAllowances = Object.values(this.allowances).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(this.deductions).reduce((a, b) => a + b, 0);
    this.totalSalary = this.basicSalary + totalAllowances;
    this.netSalary = this.totalSalary - totalDeductions;
    next();
});

salarySchema.virtual('calculatedTotal').get(function() {
    const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
    return this.basicSalary + totalAllowances - totalDeductions;
});

salarySchema.set('toJSON', { virtuals: true });
salarySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Salary', salarySchema);
