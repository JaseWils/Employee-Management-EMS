const PerformanceReview = require('../../models/PerformanceReview');
const createNotification = require('../Notification/createNotification');

const submitReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await PerformanceReview.findById(reviewId)
            .populate('employee', 'fullName email');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (review.status !== 'draft') {
            return res.status(400).json({
                success: false,
                message: 'Review has already been submitted'
            });
        }

        review.status = 'submitted';
        await review.save();

        // Notify employee
        await createNotification({
            recipient: review.employee._id,
            sender: req.user.id,
            type: 'performance_review',
            title: 'Performance Review Available',
            message: `Your ${review.reviewType} performance review is ready for your acknowledgment`,
            data: { reviewId: review._id },
            actionUrl: `/performance/reviews/${review._id}`,
            priority: 'high'
        });

        return res.status(200).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    } catch (error) {
        console.error('Submit review error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error submitting review',
            error: error.message
        });
    }
};

module.exports = submitReview;