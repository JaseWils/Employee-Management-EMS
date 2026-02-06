const Leave = require('../../models/Leave');

<<<<<<< HEAD
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
=======
const editLeave = async (req, res) => {
    const leaveId = req.params.id;

    if (!leaveId) {
        return res.json({
            message: 'Leave ID not provided',
            error: true,
        });
    }

    try {
        // Find the leave request by ID
        let leaveRequest = await Leave.findById(leaveId);

        if (!leaveRequest) {
            return res.status(404).json({
                message: 'Leave request not found',
                error: true,
            });
        }

        // Update only the fields that are provided
        const updatedFields = {};
        const updateMessages = [];
        const { employee, leaveType, reason, startDate, endDate } = req.body;

        if (employee) {
            updatedFields.employee = employee;
            updateMessages.push('Employee updated successfully');
        }
        if (leaveType) {
            updatedFields.leaveType = leaveType;
            updateMessages.push('Leave type updated successfully');
        }
        if (reason) {
            updatedFields.reason = reason;
            updateMessages.push('Reason updated successfully');
        }
        if (startDate) {
            updatedFields.startDate = new Date(startDate);
            updateMessages.push('Start date updated successfully');
        }
        if (endDate) {
            updatedFields.endDate = new Date(endDate);
            updateMessages.push('End date updated successfully');
        }

        // Recalculate number of days if dates changed
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : leaveRequest.startDate;
            const end = endDate ? new Date(endDate) : leaveRequest.endDate;
            updatedFields.numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        }

        // Perform the update
        leaveRequest = await Leave.findByIdAndUpdate(
            leaveId,
            { $set: updatedFields },
            { new: true, runValidators: true }
        ).populate('employee', 'fullName email');

        return res.json({
            message: 'Leave request updated successfully',
            updateMessages: updateMessages,
            success: true,
            data: leaveRequest
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
module.exports = EditLeaveRequest;
=======
module.exports = editLeave;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
