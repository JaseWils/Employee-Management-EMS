const Leave = require('../../models/Leave');

const approveLeave = async (req, res) => {
    try {
        const leaveId = req.params.id;
        if (!leaveId) {
            return res.status(400).json({ success: false, message: 'Leave ID not provided' });
        }
        const { approvedBy } = req.body;
        const leaveRequest = await Leave.findByIdAndUpdate(leaveId, { status: 'approved', approvedBy: approvedBy || req.user?.id, approvedAt: new Date() }, { new: true }).populate('employee', 'fullName email');
        if (!leaveRequest) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }
        return res.status(200).json({ success: true, message: 'Leave request approved successfully', data: leaveRequest });
    } catch (error) {
        console.error('Approve leave error:', error);
        return res.status(500).json({ success: false, message: 'Error approving leave', error: error.message });
    }
};

module.exports = approveLeave;
