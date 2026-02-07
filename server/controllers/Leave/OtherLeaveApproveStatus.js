const Leave = require('../../models/Leave');

const otherLeaveStatus = async (req, res) => {
    try {
        const leaveId = req.params.id;
        if (!leaveId) {
            return res.status(400).json({ success: false, message: 'Leave ID not provided' });
        }
        const { status, comments } = req.body;
        const updateData = { status: status || 'pending', approvedBy: req.user?.id, approvedAt: new Date() };
        if (comments) updateData.rejectionReason = comments;
        const leaveRequest = await Leave.findByIdAndUpdate(leaveId, updateData, { new: true }).populate('employee', 'fullName email');
        if (!leaveRequest) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }
        return res.status(200).json({ success: true, message: 'Leave status updated', data: leaveRequest });
    } catch (error) {
        console.error('Update leave status error:', error);
        return res.status(500).json({ success: false, message: 'Error updating leave', error: error.message });
    }
};

module.exports = otherLeaveStatus;
