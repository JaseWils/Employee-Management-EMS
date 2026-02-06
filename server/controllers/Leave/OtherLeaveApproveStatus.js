const Leave = require('../../models/Leave');

const OtherLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comments } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved or rejected'
            });
        }

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        leave.status = status;
        leave.approvedBy = req.user.id;
        leave.approvedAt = new Date();
        if (comments) {
            leave.rejectionReason = comments;
        }
        await leave.save();

        return res.status(200).json({
            success: true,
            message: `Leave request ${status}`,
            data: leave
        });

    } catch (error) {
        console.error('Update leave status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating leave status',
            error: error.message
        });
    }
};

module.exports = OtherLeaveStatus;