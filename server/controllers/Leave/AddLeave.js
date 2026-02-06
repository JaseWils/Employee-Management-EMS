const Leave = require('../../models/Leave');
const createNotification = require('../Notification/createNotification');

const leaveUserApply = async (req, res) => {
    try {
        const { id: employeeId } = req.params;
        const { leaveType, startDate, endDate, reason } = req.body;

        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        const leave = await Leave.create({
            employee: employeeId,
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'pending'
        });

        const populatedLeave = await Leave.findById(leave._id)
            .populate('employee', 'fullName email employeeId');

        // Notify admin/HR
        // You can implement notification logic here

        return res.status(201).json({
            success: true,
            message: 'Leave application submitted successfully',
            data: populatedLeave
        });

    } catch (error) {
        console.error('Apply leave error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error submitting leave application',
            error: error.message
        });
    }
};

module.exports = leaveUserApply;