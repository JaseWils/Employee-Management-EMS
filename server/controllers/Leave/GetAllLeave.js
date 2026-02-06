const Leave = require('../../models/Leave');

const getAllLeaves = async (req, res) => {
    try {
        const leaveData = await Leave.find()
            .populate('employee', 'fullName email department')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        if (!leaveData || leaveData.length === 0) {
            return res.status(404).json({
                message: "No leave records found"
            });
        }

        return res.status(200).json({
            message: "Leave List Record Found",
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

module.exports = getAllLeaves;
