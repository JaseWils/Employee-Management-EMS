const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: {
        time: {
            type: Date,
            required: true
        },
        location: {
            type: String
        },
        ipAddress: String,
        method: {
            type: String,
            enum: ['manual', 'biometric', 'web', 'mobile'],
            default: 'web'
        }
    },
    checkOut: {
        time: Date,
        location: String,
        ipAddress: String
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half_day', 'late', 'on_leave', 'holiday', 'weekend'],
        default: 'present'
    },
    workHours: {
        type: Number, // in hours
        default: 0
    },
    overtime: {
        type: Number, // in hours
        default: 0
    },
    breaks: [{
        startTime: Date,
        endTime: Date,
        duration: Number // in minutes
    }],
    notes: String,
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isManualEntry: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
attendanceSchema.index({ employee: 1, date: 1 });

// Calculate work hours before saving
attendanceSchema.pre('save', function(next) {
    if (this.checkIn.time && this.checkOut.time) {
        const diffMs = this.checkOut.time - this.checkIn.time;
        const diffHours = diffMs / (1000 * 60 * 60);
        
        // Calculate break time
        let totalBreakHours = 0;
        if (this.breaks && this.breaks.length > 0) {
            this.breaks.forEach(breakItem => {
                if (breakItem.endTime && breakItem.startTime) {
                    totalBreakHours += (breakItem.endTime - breakItem.startTime) / (1000 * 60 * 60);
                }
            });
        }
        
        this.workHours = Math.max(0, diffHours - totalBreakHours);
        
        // Calculate overtime (assuming 8 hour work day)
        const standardHours = 8;
        this.overtime = Math.max(0, this.workHours - standardHours);
    }
    next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);