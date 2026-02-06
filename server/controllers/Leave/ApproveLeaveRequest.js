const Leave = require('../../models/Leave');
const createNotification = require('../Notification/createNotification');

const ApproveLeave = async (req, res) => {
    try {
        const { id } = req.params;
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

        leave.status = 'approved';
        leave.approvedBy = userId;
        leave.approvedAt = new Date();
        await leave.save();

        // Send notification to employee
        if (createNotification) {
            await createNotification({
                recipient: leave.employee._id,
                sender: userId,
                type: 'leave_approved',
                title: 'Leave Request Approved',
                message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been approved.`,
                data: { leaveId: leave._id },
                actionUrl: `/leave-history`,
                priority: 'high'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Leave request approved successfully',
            data: leave
        });

    } catch (error) {
        console.error('Approve leave error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error approving leave request',
            error: error.message
        });
    }
};

module.exports = ApproveLeave;