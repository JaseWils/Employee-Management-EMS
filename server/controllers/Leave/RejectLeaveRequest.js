const Leave = require('../../models/Leave');

const rejectLeave = async (req, res) => {
    const leaveId = req.params.id;

    if (!leaveId) {
        return res.json({
            message: 'Leave ID not provided',
            error: true,
        });
    }

    try {
        const { rejectionReason, approvedBy } = req.body;

        const leaveRequest = await Leave.findByIdAndUpdate(
            leaveId,
            {
                status: 'Rejected',
                rejectionReason: rejectionReason || '',
                approvedBy: approvedBy || undefined,
                approvedAt: new Date()
            },
            { new: true }
        ).populate('employee', 'fullName email');

        if (!leaveRequest) {
            return res.status(404).json({
                message: 'Leave request not found',
                error: true,
            });
        }

        return res.json({
            message: 'Leave request rejected successfully',
            success: true,
            data: leaveRequest
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = rejectLeave;
