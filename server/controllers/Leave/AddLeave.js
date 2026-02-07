const Leave = require('../../models/Leave');
const Staff = require('../../models/Staff');

const addLeave = async (req, res) => {
    try {
        const staffId = req.params.id;
        if (!staffId) {
            return res.status(400).json({ success: false, message: 'Staff ID not provided' });
        }
        const staffMember = await Staff.findById(staffId);
        if (!staffMember) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }
        const { leaveType, reason, startDate, endDate } = req.body;
        if (!leaveType || !reason || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
            return res.status(400).json({ success: false, message: 'End date must be after start date' });
        }
        const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const newLeave = new Leave({ employee: staffId, leaveType, reason, startDate: start, endDate: end, numberOfDays, status: 'pending' });
        await newLeave.save();
        const populatedLeave = await Leave.findById(newLeave._id).populate('employee', 'fullName email employeeId');
        return res.status(201).json({ success: true, message: 'Leave request created successfully', data: populatedLeave });
    } catch (error) {
        console.error('Add leave error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

module.exports = addLeave;
