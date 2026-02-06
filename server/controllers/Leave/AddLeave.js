const Leave = require('../../models/Leave');
const Staff = require('../../models/Staff');

const addLeave = async (req, res) => {
    const staffId = req.params.id;
    
    if (!staffId) {
        return res.json({
            message: 'Staff ID not provided',
            error: true,
        });
    }

    try {
        // Check if the staff user exists
        const staffMember = await Staff.findById(staffId);

        if (!staffMember) {
            return res.json({
                message: 'Staff member not found',
                error: true,
            });
        }

        const { leaveType, reason, startDate, endDate } = req.body;

        // Validate required fields
        if (!leaveType || !reason || !startDate || !endDate) {
            return res.status(400).json({
                message: 'Please provide all required fields (leaveType, reason, startDate, endDate)',
                error: true,
            });
        }

        // Calculate number of days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        // Create a new leave request document
        const newLeaveRequest = new Leave({
            employee: staffId,
            leaveType,
            reason,
            startDate: start,
            endDate: end,
            numberOfDays
        });

        // Save the leave request to the database
        await newLeaveRequest.save();

        return res.status(201).json({
            message: 'Leave request created successfully',
            success: true,
            data: newLeaveRequest
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

module.exports = addLeave;
