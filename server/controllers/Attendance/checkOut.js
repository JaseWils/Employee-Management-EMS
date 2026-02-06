const Attendance = require('../../models/Attendance');
const moment = require('moment');

const checkOut = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { location } = req.body;

        const today = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();

        // Find today's attendance record
        const attendance = await Attendance.findOne({
            employee: employeeId,
            date: { $gte: today, $lte: todayEnd }
        });

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'No check-in record found for today'
            });
        }

        if (attendance.checkOut && attendance.checkOut.time) {
            return res.status(400).json({
                success: false,
                message: 'Already checked out today'
            });
        }

        attendance.checkOut = {
            time: new Date(),
            location,
            ipAddress: req.ip
        };

        await attendance.save(); // This will trigger the pre-save hook to calculate hours

        return res.status(200).json({
            success: true,
            message: 'Checked out successfully',
            data: attendance
        });
    } catch (error) {
        console.error('Check-out error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during check-out',
            error: error.message
        });
    }
};

module.exports = checkOut;