const Attendance = require('../../models/Attendance');
const moment = require('moment');

const checkIn = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { location, method = 'web' } = req.body;

        const today = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();

        // Check if already checked in today
        const existingAttendance = await Attendance.findOne({
            employee: employeeId,
            date: { $gte: today, $lte: todayEnd }
        });

        if (existingAttendance && existingAttendance.checkIn.time) {
            return res.status(400).json({
                success: false,
                message: 'Already checked in today',
                data: existingAttendance
            });
        }

        const attendanceData = {
            employee: employeeId,
            date: new Date(),
            checkIn: {
                time: new Date(),
                location,
                ipAddress: req.ip,
                method
            },
            status: 'present'
        };

        const attendance = await Attendance.create(attendanceData);
        
        return res.status(201).json({
            success: true,
            message: 'Checked in successfully',
            data: attendance
        });
    } catch (error) {
        console.error('Check-in error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during check-in',
            error: error.message
        });
    }
};

module.exports = checkIn;