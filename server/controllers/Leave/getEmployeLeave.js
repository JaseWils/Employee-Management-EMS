const Leave = require('../../models/Leave');

const EmployeeIDLeave = async (req, res) => {
    try {
        const { id: employeeId } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        let query = { employee: employeeId };

        if (status) {
            query.status = status;
        }

        const leaves = await Leave.find(query)
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Leave.countDocuments(query);

        // Get leave summary
        const summary = {
            total: await Leave.countDocuments({ employee: employeeId }),
            pending: await Leave.countDocuments({ employee: employeeId, status: 'pending' }),
            approved: await Leave.countDocuments({ employee: employeeId, status: 'approved' }),
            rejected: await Leave.countDocuments({ employee: employeeId, status: 'rejected' })
        };

        return res.status(200).json({
            success: true,
            data: leaves,
            summary,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get employee leave error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching employee leaves',
            error: error.message
        });
    }
};

module.exports = EmployeeIDLeave;