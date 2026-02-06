const Leave = require('../../models/Leave');

const deleteLeave = async (req, res) => {
    try {
        const leaveId = req.params.id;
        if (!leaveId) {
            return res.status(400).json({ success: false, message: 'Leave ID not provided' });
        }
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }
        const deletedLeave = await Leave.findByIdAndDelete(leaveId);
        return res.status(200).json({ success: true, message: 'Leave request deleted successfully', data: deletedLeave });
    } catch (error) {
        console.error('Delete leave error:', error);
        return res.status(500).json({ success: false, message: 'Error deleting leave', error: error.message });
    }
};

module.exports = deleteLeave;
