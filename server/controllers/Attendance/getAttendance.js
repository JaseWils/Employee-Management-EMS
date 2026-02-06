const Attendance = require('../../models/Attendance');
const moment = require('moment');

const getAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { startDate, endDate, month, year } = req.query;

        let query = {};

        if (employeeId) {
            query.employee = employeeId;
        }

        // Date filtering
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (month && year) {
            const start = moment(`${year}-${month}-01`).startOf('month').toDate();
            const end = moment(`${year}-${month}-01`).endOf('month').toDate();
            query.date = { $gte: start, $lte: end };
        }

        const attendance = await Attendance.find(query)
            .populate('employee', 'fullName email department')
            .populate('approvedBy', 'name email')
            .sort({ date: -1 });

        // Calculate summary
        const summary = {
            totalDays: attendance.length,
            present: attendance.filter(a => a.status === 'present').length,
            absent: attendance.filter(a => a.status === 'absent').length,
            halfDay: attendance.filter(a => a.status === 'half_day').length,
            late: attendance.filter(a => a.status === 'late').length,
            totalWorkHours: attendance.reduce((sum, a) => sum + (a.workHours || 0), 0),
            totalOvertime: attendance.reduce((sum, a) => sum + (a.overtime || 0), 0)
        };

        return res.status(200).json({
            success: true,
            message: 'Attendance records retrieved successfully',
            data: attendance,
            summary
        });
    } catch (error) {
        console.error('Get attendance error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving attendance',
            error: error.message
        });
    }
};

module.exports = getAttendance;