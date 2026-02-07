const Attendance = require('../../models/Attendance');
const moment = require('moment');

const addBreak = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { type } = req.body; // 'start' or 'end'

        const today = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();

        const attendance = await Attendance.findOne({
            employee: employeeId,
            date: { $gte: today, $lte: todayEnd }
        });

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'No attendance record found for today'
            });
        }

        if (type === 'start') {
            // Start a new break
            attendance.breaks.push({
                startTime: new Date()
            });
        } else if (type === 'end') {
            // End the last break
            const lastBreak = attendance.breaks[attendance.breaks.length - 1];
            if (!lastBreak || lastBreak.endTime) {
                return res.status(400).json({
                    success: false,
                    message: 'No active break to end'
                });
            }
            lastBreak.endTime = new Date();
            lastBreak.duration = (lastBreak.endTime - lastBreak.startTime) / (1000 * 60); // in minutes
        }

        await attendance.save();

        return res.status(200).json({
            success: true,
            message: `Break ${type === 'start' ? 'started' : 'ended'} successfully`,
            data: attendance
        });
    } catch (error) {
        console.error('Break error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error managing break',
            error: error.message
        });
    }
};

module.exports = addBreak;