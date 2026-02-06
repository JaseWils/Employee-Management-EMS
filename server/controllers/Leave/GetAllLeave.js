const Leave = require('../../models/Leave');

const getAllLeaves = async (req, res) => {
    try {
        const { status, leaveType } = req.query;
        let query = {};
        if (status) query.status = status;
        if (leaveType) query.leaveType = leaveType;
        const leaves = await Leave.find(query).populate('employee', 'fullName email department').populate('approvedBy', 'name email').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: 'Leave records found', data: leaves });
    } catch (error) {
        console.error('Get all leaves error:', error);
        return res.status(500).json({ success: false, message: 'Error fetching leaves', error: error.message });
    }
};

module.exports = getAllLeaves;
