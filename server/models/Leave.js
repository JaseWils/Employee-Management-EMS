const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    leaveType: {
        type: String,
        required: [true, 'Leave type is required'],
        enum: ['Sick', 'Casual', 'Earned', 'Maternity', 'Paternity', 'Other']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function(value) {
                return value >= this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true,
        minlength: [10, 'Reason must be at least 10 characters'],
        maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    numberOfDays: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Calculate number of days before saving
leaveSchema.pre('save', function(next) {
    if (this.startDate && this.endDate) {
        const timeDiff = this.endDate - this.startDate;
        this.numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    }
    next();
});

module.exports = mongoose.model('Leave', leaveSchema);