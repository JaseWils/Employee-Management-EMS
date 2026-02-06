const Leave = require('../../models/Leave');
<<<<<<< HEAD
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
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
module.exports = leaveUserApply;
=======
module.exports = addLeave;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
