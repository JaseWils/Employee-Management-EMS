const Leave = require('../../models/Leave');

const rejectLeave = async (req, res) => {
    try {
        const leaveId = req.params.id;
        if (!leaveId) {
            return res.status(400).json({ success: false, message: 'Leave ID not provided' });
        }
        const { rejectionReason, approvedBy } = req.body;
        const leaveRequest = await Leave.findByIdAndUpdate(leaveId, { status: 'rejected', rejectionReason: rejectionReason || '', approvedBy: approvedBy || req.user?.id, approvedAt: new Date() }, { new: true }).populate('employee', 'fullName email');
        if (!leaveRequest) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }
        return res.status(200).json({ success: true, message: 'Leave request rejected', data: leaveRequest });
    } catch (error) {
        console.error('Reject leave error:', error);
        return res.status(500).json({ success: false, message: 'Error rejecting leave', error: error.message });
    }
};

module.exports = rejectLeave;
