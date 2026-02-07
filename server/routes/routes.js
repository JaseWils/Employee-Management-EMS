const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// ============================================
// AUTHENTICATION ROUTES
// ============================================
const UserRegistration = require('../controllers/UserRegistration');
const checkEmail = require('../controllers/checkEmail');
const checkPassword = require('../controllers/checkPassword');
const checkAdmin = require('../controllers/checkAdmin');
const { sendOtp, verifyOtp } = require('../controllers/otpController');

router.post('/register', UserRegistration);
router.post('/email', checkEmail);
router.post('/password', checkPassword);
router.get('/check-admin', authMiddleware, checkAdmin);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// ============================================
// STAFF/EMPLOYEE ROUTES
// ============================================
const addStaff = require('../controllers/Staffs/AddStaff');
const getStaffs = require('../controllers/Staffs/GetStaff');
const editStaffs = require('../controllers/Staffs/EditStaff');
const deleteStaffs = require('../controllers/Staffs/DeleteStaff');

router.post('/add-staff', authMiddleware, addStaff);
router.get('/get-staffs', authMiddleware, getStaffs);
router.get('/get-staffs/:id', authMiddleware, getStaffs);
router.put('/edit-staffs/:id', authMiddleware, editStaffs);
router.delete('/delete-staffs/:id', authMiddleware, deleteStaffs);

// ============================================
// DEPARTMENT ROUTES
// ============================================
const addDepartment = require('../controllers/Departments/addDepartment');
const getDepartment = require('../controllers/Departments/getDepartment');
const editDepartment = require('../controllers/Departments/editDepartment');
const deleteDepartment = require('../controllers/Departments/DeleteDepartment');

router.post('/add-dept', authMiddleware, addDepartment);
router.get('/get-dept', authMiddleware, getDepartment);
router.get('/get-dept/:id', authMiddleware, getDepartment);
router.put('/edit-dept/:id', authMiddleware, editDepartment);
router.delete('/delete-dept/:id', authMiddleware, deleteDepartment);

// ============================================
// LEAVE ROUTES
// ============================================
const leaveUserApply = require('../controllers/Leave/AddLeave');
const getAllLeaves = require('../controllers/Leave/GetAllLeave');
const EmployeeIDLeave = require('../controllers/Leave/getEmployeLeave');
const EditLeaveRequest = require('../controllers/Leave/EditLeave');
const deleteLeaveRequest = require('../controllers/Leave/DeleteLeave');
const ApproveLeave = require('../controllers/Leave/ApproveLeaveRequest');
const rejectLeave = require('../controllers/Leave/RejectLeaveRequest');

router.post('/leave/apply/:id', authMiddleware, leaveUserApply);
router.get('/leave/all', authMiddleware, getAllLeaves);
router.get('/leave/employee/:id', authMiddleware, EmployeeIDLeave);
router.put('/leave/edit/:id', authMiddleware, EditLeaveRequest);
router.delete('/leave/delete/:id', authMiddleware, deleteLeaveRequest);
router.patch('/leave/approve/:id', authMiddleware, ApproveLeave);
router.patch('/leave/reject/:id', authMiddleware, rejectLeave);

// ============================================
// SALARY ROUTES
// ============================================
const addSalary = require('../controllers/Salary/AddSalary');
const getAllSalaries = require('../controllers/Salary/getAllSalaray');
const getSalaryByEmployeeId = require('../controllers/Salary/getSalaryId');
const editSalary = require('../controllers/Salary/EditSalary');
const deleteSalary = require('../controllers/Salary/DeleteSalary');

router.post('/salary/add', authMiddleware, addSalary);
router.get('/salary/all', authMiddleware, getAllSalaries);
router.get('/salary/employee/:employeeId', authMiddleware, getSalaryByEmployeeId);
router.put('/salary/edit/:id', authMiddleware, editSalary);
router.delete('/salary/delete/:id', authMiddleware, deleteSalary);

// ============================================
// PAYROLL ROUTES
// ============================================
const generatePayroll = require('../controllers/Payroll/generatePayroll');
const generatePayslip = require('../controllers/Payroll/generatePayslip');

router.post('/payroll/generate', authMiddleware, generatePayroll);
router.get('/payroll/payslip/:payrollId', authMiddleware, generatePayslip);

// ============================================
// ATTENDANCE ROUTES
// ============================================
const checkIn = require('../controllers/Attendance/CheckIn');
const checkOut = require('../controllers/Attendance/CheckOut');
const getAttendance = require('../controllers/Attendance/GetAttendance');

router.post('/attendance/check-in/:employeeId', authMiddleware, checkIn);
router.post('/attendance/check-out/:employeeId', authMiddleware, checkOut);
router.get('/attendance/:employeeId', authMiddleware, getAttendance);
router.get('/attendance', authMiddleware, getAttendance);

// ============================================
// TASK ROUTES
// ============================================
const createTask = require('../controllers/Tasks/CreateTask');
const getAllTasks = require('../controllers/Tasks/GetAllTasks');
const updateTask = require('../controllers/Tasks/UpdateTask');
const deleteTask = require('../controllers/Tasks/DeleteTask');

router.post('/tasks', authMiddleware, createTask);
router.get('/tasks', authMiddleware, getAllTasks);
router.patch('/tasks/:id', authMiddleware, updateTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);

// ============================================
// DOCUMENT ROUTES
// ============================================
const uploadDocument = require('../controllers/Document/uploadDocument');
const getAllDocuments = require('../controllers/Document/getDocuments');
const verifyDocument = require('../controllers/Document/verifyDocument');

router.post('/documents/upload', authMiddleware, uploadDocument);
router.get('/documents', authMiddleware, getAllDocuments);
router.patch('/documents/verify/:id', authMiddleware, verifyDocument);

// ============================================
// ANALYTICS/DASHBOARD ROUTES
// ============================================
const getDashboardAnalytics = require('../controllers/Analytics/GetDashboardAnalytics');

router.get('/analytics/dashboard', authMiddleware, getDashboardAnalytics);

// ============================================
// NOTIFICATION ROUTES
// ============================================
const getNotifications = require('../controllers/Notification/getNotifications');
const { markAsRead, markAllAsRead } = require('../controllers/Notification/markAsRead');

router.get('/notifications', authMiddleware, getNotifications);
router.patch('/notifications/:id/read', authMiddleware, markAsRead);
router.patch('/notifications/read-all', authMiddleware, markAllAsRead);

// ============================================
// ADMIN MANAGEMENT ROUTES
// ============================================
const { listAdmins, updateAdmin, deleteAdmin } = require('../controllers/ManageAdmin');

router.get('/admins', authMiddleware, adminMiddleware, listAdmins);
router.put('/admins/:adminId', authMiddleware, adminMiddleware, updateAdmin);
router.delete('/admins/:adminId', authMiddleware, adminMiddleware, deleteAdmin);

module.exports = router;