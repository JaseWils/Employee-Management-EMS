const Staff = require('../../models/Staff');
const Leave = require('../../models/Leave');
const Attendance = require('../../models/Attendance');
const Salary = require('../../models/Salary');

const getDashboardAnalytics = async (req, res) => {
    try {
        // Get total employees
        const totalEmployees = await Staff.countDocuments({ isActive: true });

        // Get new employees this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newEmployees = await Staff.countDocuments({
            joiningDate: { $gte: startOfMonth },
            isActive: true
        });

        // Get pending leave requests
        const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

        // Calculate attendance rate for this month
        const totalWorkDays = new Date().getDate();
        const totalAttendance = await Attendance.countDocuments({
            date: { $gte: startOfMonth },
            status: 'present'
        });
        const attendanceRate = totalEmployees > 0 
            ? Math.round((totalAttendance / (totalEmployees * totalWorkDays)) * 100)
            : 0;

        // Calculate total payroll
        const salaries = await Salary.find({ isActive: true });
        const totalPayroll = salaries.reduce((sum, salary) => {
            const totalAllowances = Object.values(salary.allowances || {}).reduce((a, b) => a + b, 0);
            const totalDeductions = Object.values(salary.deductions || {}).reduce((a, b) => a + b, 0);
            return sum + (salary.basicSalary + totalAllowances - totalDeductions);
        }, 0);

        return res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalEmployees,
                    newEmployees,
                    pendingLeaves,
                    attendanceRate,
                    totalPayroll,
                    overdueTasks: 0,
                    documentsToVerify: 0
                }
            }
        });

    } catch (error) {
        console.error('Dashboard analytics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard analytics',
            error: error.message
        });
    }
};

module.exports = getDashboardAnalytics;