const Leave = require('../../models/Leave');

const getEmployeeLeave = async (req, res) => {
    try {
        const employeeId = req.params.id;
        if (!employeeId) {
            return res.status(400).json({ success: false, message: 'Employee ID is required' });
        }
        const leaves = await Leave.find({ employee: employeeId }).populate('approvedBy', 'name email').sort({ createdAt: -1 });
        const summary = {
            total: leaves.length,
            pending: leaves.filter(l => l.status === 'pending' || l.status === 'Pending').length,
            approved: leaves.filter(l => l.status === 'approved' || l.status === 'Approved').length,
            rejected: leaves.filter(l => l.status === 'rejected' || l.status === 'Rejected').length
        };
        return res.status(200).json({ success: true, message: 'Leave records found', data: leaves, summary });
    } catch (error) {
        console.error('Get employee leave error:', error);
        return res.status(500).json({ success: false, message: 'Error fetching leaves', error: error.message });
    }
};

module.exports = getEmployeeLeave;
