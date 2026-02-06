const Payroll = require('../../models/Payroll');
const Attendance = require('../../models/Attendance');
const Staff = require('../../models/Staff');
const Salary = require('../../models/Salary');
const moment = require('moment');

const generatePayroll = async (req, res) => {
    try {
        const { month, year, employeeIds } = req.body;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                message: 'Month and year are required'
            });
        }

        const employees = employeeIds || await Staff.find({ isActive: true }).select('_id');
        const results = [];
        const errors = [];

        for (const empId of (Array.isArray(employeeIds) ? employeeIds : employees.map(e => e._id))) {
            try {
                // Check if payroll already exists
                const existing = await Payroll.findOne({
                    employee: empId,
                    month,
                    year
                });

                if (existing) {
                    errors.push({
                        employeeId: empId,
                        message: 'Payroll already exists for this period'
                    });
                    continue;
                }

                // Get employee details
                const employee = await Staff.findById(empId);
                if (!employee) {
                    errors.push({
                        employeeId: empId,
                        message: 'Employee not found'
                    });
                    continue;
                }

                // Get salary configuration
                const salaryConfig = await Salary.findOne({ employee: empId })
                    .sort({ createdAt: -1 });

                if (!salaryConfig) {
                    errors.push({
                        employeeId: empId,
                        message: 'Salary configuration not found'
                    });
                    continue;
                }

                // Get attendance data for the month
                const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
                const endDate = moment(`${year}-${month}-01`).endOf('month').toDate();

                const attendanceRecords = await Attendance.find({
                    employee: empId,
                    date: { $gte: startDate, $lte: endDate }
                });

                // Calculate attendance metrics
                const workingDays = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
                const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
                const absentDays = attendanceRecords.filter(a => a.status === 'absent').length;
                const totalWorkHours = attendanceRecords.reduce((sum, a) => sum + (a.workHours || 0), 0);
                const overtimeHours = attendanceRecords.reduce((sum, a) => sum + (a.overtime || 0), 0);

                // Get leave data
                const Leave = require('../../models/Leave');
                const leaves = await Leave.find({
                    employee: empId,
                    startDate: { $gte: startDate, $lte: endDate },
                    status: 'approved'
                });

                const paidLeaves = leaves.filter(l => l.leaveType === 'paid').length;
                const unpaidLeaves = leaves.filter(l => l.leaveType === 'unpaid').length;

                // Create payroll
                const payroll = await Payroll.create({
                    employee: empId,
                    month,
                    year,
                    baseSalary: salaryConfig.basicSalary || 0,
                    allowances: {
                        houseRent: salaryConfig.allowances?.houseRent || 0,
                        transport: salaryConfig.allowances?.transport || 0,
                        medical: salaryConfig.allowances?.medical || 0,
                        food: salaryConfig.allowances?.food || 0,
                        bonus: salaryConfig.allowances?.bonus || 0,
                        other: salaryConfig.allowances?.other || 0
                    },
                    deductions: {
                        tax: calculateTax(salaryConfig.basicSalary),
                        insurance: salaryConfig.deductions?.insurance || 0,
                        providentFund: salaryConfig.deductions?.providentFund || 0,
                        loan: salaryConfig.deductions?.loan || 0,
                        advance: salaryConfig.deductions?.advance || 0,
                        other: salaryConfig.deductions?.other || 0
                    },
                    attendance: {
                        workingDays,
                        presentDays,
                        absentDays,
                        paidLeaves,
                        unpaidLeaves,
                        holidays: workingDays - presentDays - absentDays,
                        totalWorkHours,
                        overtimeHours
                    },
                    calculations: {},
                    status: 'pending'
                });

                results.push(payroll);
            } catch (error) {
                errors.push({
                    employeeId: empId,
                    message: error.message
                });
            }
        }

        return res.status(201).json({
            success: true,
            message: `Generated ${results.length} payroll records`,
            data: results,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Generate payroll error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error generating payroll',
            error: error.message
        });
    }
};

// Simple progressive tax calculation (customize based on your tax laws)
const calculateTax = (salary) => {
    if (salary <= 3000) return 0;
    if (salary <= 5000) return salary * 0.05;
    if (salary <= 10000) return salary * 0.10;
    return salary * 0.15;
};

module.exports = generatePayroll;