const Attendance = require('../../models/Attendance');

const getAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { date, startDate, endDate } = req.query;

        let query = {};

        if (employeeId) {
            query.employee = employeeId;
        }

        if (date) {
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);
            
            query.date = {
                $gte: targetDate,
                $lt: nextDay
            };
        } else if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const attendance = await Attendance.find(query)
            .populate('employee', 'fullName email employeeId')
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            data: attendance
        });

    } catch (error) {
        console.error('Get attendance error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching attendance',
            error: error.message
        });
    }
};

module.exports = getAttendance;