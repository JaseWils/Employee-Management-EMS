const Staff = require('../../models/Staff');
const Department = require('../../models/Department');
const Leave = require('../../models/Leave');
const Attendance = require('../../models/Attendance');
const Task = require('../../models/Task');
const Payroll = require('../../models/Payroll');
const moment = require('moment');

const getDashboardStats = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        // Date range calculation
        let startDate, endDate;
        if (period === 'week') {
            startDate = moment().startOf('week').toDate();
            endDate = moment().endOf('week').toDate();
        } else if (period === 'month') {
            startDate = moment().startOf('month').toDate();
            endDate = moment().endOf('month').toDate();
        } else if (period === 'year') {
            startDate = moment().startOf('year').toDate();
            endDate = moment().endOf('year').toDate();
        } else {
            startDate = moment().subtract(30, 'days').toDate();
            endDate = new Date();
        }

        // Employee Statistics
        const totalEmployees = await Staff.countDocuments({ isActive: true });
        const newEmployees = await Staff.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });
        const employeesByDepartment = await Staff.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'departmentInfo'
                }
            },
            {
                $project: {
                    department: { $arrayElemAt: ['$departmentInfo.name', 0] },
                    count: 1
                }
            }
        ]);

        // Attendance Statistics
        const attendanceStats = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const avgAttendanceRate = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRecords: { $sum: 1 },
                    presentRecords: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    attendanceRate: {
                        $multiply: [
                            { $divide: ['$presentRecords', '$totalRecords'] },
                            100
                        ]
                    }
                }
            }
        ]);

        // Leave Statistics
        const leaveStats = await Leave.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const pendingLeaves = await Leave.countDocuments({
            status: 'pending'
        });

        // Task Statistics
        const taskStats = await Task.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $nin: ['completed', 'cancelled'] }
        });

        // Payroll Statistics
        const currentMonth = moment().month() + 1;
        const currentYear = moment().year();
        
        const payrollStats = await Payroll.aggregate([
            {
                $match: {
                    month: currentMonth,
                    year: currentYear
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$calculations.netSalary' }
                }
            }
        ]);

        const totalPayrollAmount = await Payroll.aggregate([
            {
                $match: {
                    month: currentMonth,
                    year: currentYear,
                    status: 'paid'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$calculations.netSalary' }
                }
            }
        ]);

        // Department Performance
        const departmentPerformance = await Department.aggregate([
            {
                $lookup: {
                    from: 'staffs',
                    localField: '_id',
                    foreignField: 'department',
                    as: 'employees'
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    let: { deptId: '$_id' },
                    pipeline: [
                        {
                            $lookup: {
                                from: 'staffs',
                                localField: 'assignedTo',
                                foreignField: '_id',
                                as: 'employee'
                            }
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $arrayElemAt: ['$employee.department', 0] }, '$$deptId']
                                }
                            }
                        }
                    ],
                    as: 'tasks'
                }
            },
            {
                $project: {
                    name: 1,
                    employeeCount: { $size: '$employees' },
                    totalTasks: { $size: '$tasks' },
                    completedTasks: {
                        $size: {
                            $filter: {
                                input: '$tasks',
                                as: 'task',
                                cond: { $eq: ['$$task.status', 'completed'] }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    completionRate: {
                        $cond: [
                            { $eq: ['$totalTasks', 0] },
                            0,
                            {
                                $multiply: [
                                    { $divide: ['$completedTasks', '$totalTasks'] },
                                    100
                                ]
                            }
                        ]
                    }
                }
            }
        ]);

        // Attendance Trends (last 7 days)
        const attendanceTrends = await Attendance.aggregate([
            {
                $match: {
                    date: {
                        $gte: moment().subtract(7, 'days').toDate(),
                        $lte: new Date()
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$date' }
                    },
                    present: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
                        }
                    },
                    absent: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
                        }
                    },
                    late: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top Performers (based on task completion)
        const topPerformers = await Task.aggregate([
            {
                $match: {
                    status: 'completed',
                    completedAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$assignedTo',
                    completedTasks: { $sum: 1 },
                    avgCompletionTime: {
                        $avg: {
                            $subtract: ['$completedAt', '$createdAt']
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            {
                $project: {
                    employeeName: '$employee.fullName',
                    employeeId: '$employee.employeeId',
                    department: '$employee.department',
                    completedTasks: 1,
                    avgCompletionDays: {
                        $divide: ['$avgCompletionTime', 1000 * 60 * 60 * 24]
                    }
                }
            },
            { $sort: { completedTasks: -1 } },
            { $limit: 10 }
        ]);

        return res.status(200).json({
            success: true,
            message: 'Dashboard statistics retrieved successfully',
            data: {
                overview: {
                    totalEmployees,
                    newEmployees,
                    pendingLeaves,
                    overdueTasks,
                    attendanceRate: avgAttendanceRate.length > 0 ? avgAttendanceRate[0].attendanceRate.toFixed(2) : 0,
                    totalPayroll: totalPayrollAmount.length > 0 ? totalPayrollAmount[0].total : 0
                },
                employeesByDepartment,
                attendanceStats,
                leaveStats,
                taskStats,
                payrollStats,
                departmentPerformance,
                attendanceTrends,
                topPerformers
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving dashboard statistics',
            error: error.message
        });
    }
};

module.exports = getDashboardStats;