const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['employee', 'department', 'attendance', 'leave', 'performance', 'payroll'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    metrics: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    aggregationPeriod: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
        default: 'daily'
    }
}, {
    timestamps: true
});

analyticsSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);