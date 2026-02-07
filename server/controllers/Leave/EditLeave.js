const Leave = require('../../models/Leave');

const editLeave = async (req, res) => {
    try {
        const leaveId = req.params.id;
        if (!leaveId) {
            return res.status(400).json({ success: false, message: 'Leave ID not provided' });
        }
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }
        if (leave.status !== 'pending' && leave.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Cannot edit processed leave request' });
        }
        const { leaveType, reason, startDate, endDate } = req.body;
        const updateFields = {};
        if (leaveType) updateFields.leaveType = leaveType;
        if (reason) updateFields.reason = reason;
        if (startDate) updateFields.startDate = new Date(startDate);
        if (endDate) updateFields.endDate = new Date(endDate);
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : leave.startDate;
            const end = endDate ? new Date(endDate) : leave.endDate;
            updateFields.numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        }
        const updatedLeave = await Leave.findByIdAndUpdate(leaveId, { $set: updateFields }, { new: true, runValidators: true }).populate('employee', 'fullName email');
        return res.status(200).json({ success: true, message: 'Leave request updated successfully', data: updatedLeave });
    } catch (error) {
        console.error('Edit leave error:', error);
        return res.status(500).json({ success: false, message: 'Error updating leave', error: error.message });
    }
};

module.exports = editLeave;
