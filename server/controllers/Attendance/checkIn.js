const Attendance = require('../../models/Attendance');

const checkIn = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { location, method } = req.body;

        // Check if already checked in today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            employee: employeeId,
            date: { $gte: today }
        });

        if (existingAttendance && existingAttendance.checkIn) {
            return res.status(400).json({
                success: false,
                message: 'Already checked in today'
            });
        }

        const attendance = existingAttendance || new Attendance({
            employee: employeeId,
            date: new Date()
        });

        attendance.checkIn = new Date();
        attendance.location = location || 'Office';
        attendance.method = method || 'web';
        attendance.status = 'present';

        await attendance.save();

        return res.status(200).json({
            success: true,
            message: 'Checked in successfully',
            data: attendance
        });

    } catch (error) {
        console.error('Check-in error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking in',
            error: error.message
        });
    }
};

module.exports = checkIn;