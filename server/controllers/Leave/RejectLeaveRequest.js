const Leave = require('../../models/Leave');
const createNotification = require('../Notification/createNotification');

const rejectLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        const userId = req.user.id;

        const leave = await Leave.findById(id).populate('employee', 'fullName email');

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        if (leave.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Leave request has already been processed'
            });
        }

        leave.status = 'rejected';
        leave.approvedBy = userId;
        leave.approvedAt = new Date();
        leave.rejectionReason = rejectionReason;
        await leave.save();

        // Send notification to employee
        if (createNotification) {
            await createNotification({
                recipient: leave.employee._id,
                sender: userId,
                type: 'leave_rejected',
                title: 'Leave Request Rejected',
                message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been rejected.${rejectionReason ? ' Reason: ' + rejectionReason : ''}`,
                data: { leaveId: leave._id },
                actionUrl: `/leave-history`,
                priority: 'high'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Leave request rejected',
            data: leave
        });

    } catch (error) {
        console.error('Reject leave error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error rejecting leave request',
            error: error.message
        });
    }
};

module.exports = rejectLeave;