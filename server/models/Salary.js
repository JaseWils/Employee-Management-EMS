const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    basicSalary: {
        type: Number,
        required: [true, 'Basic salary is required'],
        min: [0, 'Salary cannot be negative']
    },
    allowances: {
        hra: { type: Number, default: 0 },
        da: { type: Number, default: 0 },
        ta: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    deductions: {
        pf: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        insurance: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalSalary: {
        type: Number,
        required: true
    },
    netSalary: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    paymentDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Cash', 'Cheque', 'Online'],
        default: 'Bank Transfer'
    }
}, {
    timestamps: true
});

// Calculate total and net salary before saving
salarySchema.pre('save', function(next) {
    const totalAllowances = Object.values(this.allowances).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(this.deductions).reduce((a, b) => a + b, 0);
    
    this.totalSalary = this.basicSalary + totalAllowances;
    this.netSalary = this.totalSalary - totalDeductions;
    
    next();
});

module.exports = mongoose.model('Salary', salarySchema);