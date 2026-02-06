const Leave = require('../../models/Leave');

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
        });
    }
};

module.exports = editLeave;
