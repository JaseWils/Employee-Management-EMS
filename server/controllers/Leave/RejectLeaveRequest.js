const Leave = require('../../models/Leave');
<<<<<<< HEAD
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
=======

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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
module.exports = rejectLeave;
=======
module.exports = rejectLeave;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
