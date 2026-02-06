const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
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
    effectiveFrom: {
        type: Date,
        default: Date.now
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentFrequency: {
        type: String,
        enum: ['monthly', 'bi-weekly', 'weekly'],
        default: 'monthly'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate total salary
salarySchema.virtual('totalSalary').get(function() {
    const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
    return this.basicSalary + totalAllowances - totalDeductions;
});

salarySchema.set('toJSON', { virtuals: true });
salarySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Salary', salarySchema);