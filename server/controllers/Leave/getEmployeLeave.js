const Leave = require('../../models/Leave');

const getLeave = async (req, res) => {
    const employeeId = req.params.id;

    if (!employeeId) {
        return res.status(400).json({
            message: "Employee ID is required"
        });
    }

    try {
        const leaveData = await Leave.find({ employee: employeeId })
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        if (!leaveData || leaveData.length === 0) {
            return res.status(404).json({
                message: "No leave records found for this employee"
            });
        }

        return res.status(200).json({
            message: "Leave Record Found For this Particular Employee",
            success: true,
            data: leaveData
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retrieving leave data",
            error: error.message
        });
    }
};

module.exports = getLeave;
