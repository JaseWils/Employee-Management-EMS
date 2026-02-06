const Leave = require('../../models/Leave');

const EditLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { leaveType, startDate, endDate, reason } = req.body;

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        // Only allow editing pending leaves
        if (leave.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cannot edit leave request that has been processed'
            });
        }

        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        const updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { leaveType, startDate, endDate, reason },
            { new: true, runValidators: true }
        ).populate('employee', 'fullName email employeeId');

        return res.status(200).json({
            success: true,
            message: 'Leave request updated successfully',
            data: updatedLeave
        });

    } catch (error) {
        console.error('Edit leave error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating leave request',
            error: error.message
        });
    }
};

module.exports = EditLeaveRequest;