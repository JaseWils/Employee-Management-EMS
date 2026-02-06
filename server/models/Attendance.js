const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day', 'late'],
        default: 'absent'
    },
    workHours: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        default: 'Office'
    },
    method: {
        type: String,
        enum: ['web', 'mobile', 'biometric'],
        default: 'web'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Index for faster queries
attendanceSchema.index({ employee: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);