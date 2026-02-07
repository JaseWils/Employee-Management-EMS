const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
        default: 'planning'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    actualEndDate: Date,
    budget: {
        estimated: Number,
        actual: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    team: [{
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        role: String,
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    client: {
        name: String,
        email: String,
        company: String
    },
    tags: [String],
    attachments: [{
        name: String,
        url: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: Date
    }],
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    milestones: [{
        name: String,
        description: String,
        dueDate: Date,
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }]
}, {
    timestamps: true
});

projectSchema.index({ manager: 1, status: 1 });
projectSchema.index({ 'team.member': 1 });

module.exports = mongoose.model('Project', projectSchema);