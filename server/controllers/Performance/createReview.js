const PerformanceReview = require('../../models/PerformanceReview');
const createNotification = require('../Notification/createNotification');

const createReview = async (req, res) => {
    try {
        const {
            employeeId,
            reviewPeriod,
            reviewType,
            categories,
            strengths,
            areasOfImprovement,
            achievements,
            goals,
            trainingRecommendations,
            nextReviewDate
        } = req.body;

        const review = await PerformanceReview.create({
            employee: employeeId,
            reviewer: req.user.id,
            reviewPeriod,
            reviewType,
            categories,
            strengths,
            areasOfImprovement,
            achievements,
            goals,
            trainingRecommendations,
            nextReviewDate,
            status: 'draft'
        });

        const populatedReview = await PerformanceReview.findById(review._id)
            .populate('employee', 'fullName email department')
            .populate('reviewer', 'name email');

        return res.status(201).json({
            success: true,
            message: 'Performance review created successfully',
            data: populatedReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating performance review',
            error: error.message
        });
    }
};

module.exports = createReview;