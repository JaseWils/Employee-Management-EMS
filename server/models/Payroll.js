const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    baseSalary: {
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
    attendance: {
        workingDays: Number,
        presentDays: Number,
        absentDays: Number,
        paidLeaves: Number,
        unpaidLeaves: Number,
        holidays: Number,
        totalWorkHours: Number,
        overtimeHours: Number
    },
    calculations: {
        grossSalary: Number,
        totalAllowances: Number,
        totalDeductions: Number,
        overtimePay: Number,
        netSalary: Number
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['bank_transfer', 'cash', 'cheque', 'online'],
            default: 'bank_transfer'
        },
        bankAccount: String,
        transactionId: String,
        paidDate: Date,
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'paid', 'rejected'],
        default: 'draft'
    },
    payslipUrl: String,
    notes: String,
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date
}, {
    timestamps: true
});

// Index for unique payroll per employee per month/year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

// Calculate totals before saving
payrollSchema.pre('save', function(next) {
    // Calculate total allowances
    this.calculations.totalAllowances = Object.values(this.allowances).reduce((sum, val) => sum + val, 0);
    
    // Calculate total deductions
    this.calculations.totalDeductions = Object.values(this.deductions).reduce((sum, val) => sum + val, 0);
    
    // Calculate overtime pay (1.5x hourly rate)
    if (this.attendance.overtimeHours && this.baseSalary) {
        const hourlyRate = this.baseSalary / (this.attendance.workingDays * 8);
        this.calculations.overtimePay = this.attendance.overtimeHours * hourlyRate * 1.5;
    }
    
    // Calculate gross salary
    this.calculations.grossSalary = this.baseSalary + this.calculations.totalAllowances + (this.calculations.overtimePay || 0);
    
    // Adjust for absent days
    if (this.attendance.absentDays > 0 && this.attendance.workingDays > 0) {
        const perDayDeduction = this.baseSalary / this.attendance.workingDays;
        this.calculations.grossSalary -= (perDayDeduction * this.attendance.absentDays);
    }
    
    // Calculate net salary
    this.calculations.netSalary = this.calculations.grossSalary - this.calculations.totalDeductions;
    
    next();
});

module.exports = mongoose.model('Payroll', payrollSchema);