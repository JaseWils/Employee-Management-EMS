const Attendance = require('../../models/Attendance');

const checkOut = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { location } = req.body;

        // Find today's attendance
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            employee: employeeId,
            date: { $gte: today }
        });

        if (!attendance || !attendance.checkIn) {
            return res.status(400).json({
                success: false,
                message: 'No check-in record found for today'
            });
        }

        if (attendance.checkOut) {
            return res.status(400).json({
                success: false,
                message: 'Already checked out today'
            });
        }

        attendance.checkOut = new Date();

        // Calculate work hours
        const checkInTime = new Date(attendance.checkIn);
        const checkOutTime = new Date(attendance.checkOut);
        const diffMs = checkOutTime - checkInTime;
        attendance.workHours = Math.round((diffMs / 1000 / 60 / 60) * 100) / 100;

        await attendance.save();

        return res.status(200).json({
            success: true,
            message: 'Checked out successfully',
            data: attendance
        });

    } catch (error) {
        console.error('Check-out error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking out',
            error: error.message
        });
    }
};

module.exports = checkOut;