const Leave = require('../../models/Leave');

const otherLeaveStatus = async (req, res) => {
    const leaveId = req.params.id;

    if (!leaveId) {
        return res.json({
            message: 'Leave ID not provided',
            error: true,
        });
    }

    try {
        const leaveRequest = await Leave.findByIdAndUpdate(
            leaveId,
            {
                status: 'Pending',
                approvedBy: null,
                approvedAt: null,
                rejectionReason: null
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
            message: 'Leave status updated to Pending successfully',
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

module.exports = otherLeaveStatus;
