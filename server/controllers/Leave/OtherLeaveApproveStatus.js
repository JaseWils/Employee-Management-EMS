const Leave = require('../../models/Leave');

<<<<<<< HEAD
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
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
module.exports = OtherLeaveStatus;
=======
module.exports = otherLeaveStatus;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
