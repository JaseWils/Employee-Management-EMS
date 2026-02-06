const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
        ref: 'Staff',
=======
        ref: 'User',
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        required: true
    },
    basicSalary: {
        type: Number,
<<<<<<< HEAD
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
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    }
}, {
    timestamps: true
});

<<<<<<< HEAD
// Calculate total salary
salarySchema.virtual('totalSalary').get(function() {
    const totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
    return this.basicSalary + totalAllowances - totalDeductions;
});

salarySchema.set('toJSON', { virtuals: true });
salarySchema.set('toObject', { virtuals: true });

=======
// Calculate total and net salary before saving
salarySchema.pre('save', function(next) {
    const totalAllowances = Object.values(this.allowances).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(this.deductions).reduce((a, b) => a + b, 0);
    
    this.totalSalary = this.basicSalary + totalAllowances;
    this.netSalary = this.totalSalary - totalDeductions;
    
    next();
});

>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
module.exports = mongoose.model('Salary', salarySchema);