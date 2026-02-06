const PerformanceReview = require('../../models/PerformanceReview');

const getReviews = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { reviewType, status, year, page = 1, limit = 20 } = req.query;

        let query = {};

        if (employeeId) {
            query.employee = employeeId;
        }

        if (reviewType) {
            query.reviewType = reviewType;
        }

        if (status) {
            query.status = status;
        }

        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31`);
            query['reviewPeriod.endDate'] = { $gte: startDate, $lte: endDate };
        }

        const reviews = await PerformanceReview.find(query)
            .populate('employee', 'fullName email department')
            .populate('reviewer', 'name email')
            .sort({ 'reviewPeriod.endDate': -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await PerformanceReview.countDocuments(query);

        // Calculate average rating
        const avgRating = await PerformanceReview.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$overallRating' }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: 'Reviews retrieved successfully',
            data: reviews,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            },
            stats: {
                averageRating: avgRating.length > 0 ? avgRating[0].averageRating : 0
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving reviews',
            error: error.message
        });
    }
};

module.exports = getReviews;