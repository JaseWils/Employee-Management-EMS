const mongoose = require('mongoose');

const performanceReviewSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewPeriod: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    reviewType: {
        type: String,
        enum: ['quarterly', 'half_yearly', 'annual', 'probation', 'project_based'],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'acknowledged', 'completed'],
        default: 'draft'
    },
    overallRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    categories: [{
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        weight: {
            type: Number,
            default: 1
        },
        comments: String
    }],
    strengths: [String],
    areasOfImprovement: [String],
    achievements: [{
        description: String,
        impact: {
            type: String,
            enum: ['low', 'medium', 'high']
        }
    }],
    goals: [{
        description: String,
        targetDate: Date,
        status: {
            type: String,
            enum: ['not_started', 'in_progress', 'completed'],
            default: 'not_started'
        }
    }],
    trainingRecommendations: [String],
    employeeComments: String,
    employeeAcknowledgedAt: Date,
    nextReviewDate: Date,
    attachments: [{
        name: String,
        url: String,
        uploadedAt: Date
    }],
    confidential: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate weighted overall rating
performanceReviewSchema.pre('save', function(next) {
    if (this.categories && this.categories.length > 0) {
        const totalWeight = this.categories.reduce((sum, cat) => sum + cat.weight, 0);
        const weightedSum = this.categories.reduce((sum, cat) => sum + (cat.rating * cat.weight), 0);
        this.overallRating = Math.round((weightedSum / totalWeight) * 10) / 10;
    }
    next();
});

performanceReviewSchema.index({ employee: 1, 'reviewPeriod.endDate': -1 });

module.exports = mongoose.model('PerformanceReview', performanceReviewSchema);