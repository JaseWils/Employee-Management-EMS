const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authenticated = require('../helpers/Authentication');
const { checkPermission, checkRole } = require('../middleware/rbac');

// Authentication Controllers
const UserRegistration = require('../controllers/UserRegistration');
const checkEmail = require('../controllers/checkEmail');
const checkPassword = require('../controllers/checkPassword');
const checkAdmin = require("../controllers/checkAdmin");
const otpController = require('../controllers/otpController');

// Staff Controllers
const addStaff = require('../controllers/Staffs/AddStaff');
const getStaffs = require('../controllers/Staffs/GetStaff');
const editStaffs = require('../controllers/Staffs/EditStaff');
const deleteStaffs = require('../controllers/Staffs/DeleteStaff');

// Department Controllers
const addDepartment = require('../controllers/Departments/addDepartment');
const getDepartment = require('../controllers/Departments/getDepartment');
const editDepartment = require('../controllers/Departments/editDepartment');
const deleteDepartment = require('../controllers/Departments/DeleteDepartment');

// Leave Controllers
const leaveUserApply = require('../controllers/Leave/AddLeave');
const getAllLeaves = require('../controllers/Leave/GetAllLeave');
const EmployeeIDLeave = require('../controllers/Leave/getEmployeLeave');
const EditLeaveRequest = require('../controllers/Leave/EditLeave');
const deleteLeaveRequest = require('../controllers/Leave/DeleteLeave');
const ApproveLeave = require('../controllers/Leave/ApproveLeaveRequest');
const rejectLeave = require('../controllers/Leave/RejectLeaveRequest');
const OtherLeaveStatus = require('../controllers/Leave/OtherLeaveApproveStatus');

// Salary Controllers
const addSalary = require('../controllers/Salary/AddSalary');
const editSalary = require('../controllers/Salary/EditSalary');
const deleteSalary = require('../controllers/Salary/DeleteSalary');
const getAllSalaries = require('../controllers/Salary/getAllSalaray');
const getSalaryByEmployeeId = require('../controllers/Salary/getSalaryId');

// Attendance Controllers
const checkIn = require('../controllers/Attendance/checkIn');
const checkOut = require('../controllers/Attendance/checkOut');
const getAttendance = require('../controllers/Attendance/getAttendance');
const addBreak = require('../controllers/Attendance/addBreak');

// Notification Controllers
const getNotifications = require('../controllers/Notification/getNotifications');
const { markAsRead, markAllAsRead } = require('../controllers/Notification/markAsRead');

// Document Controllers
const uploadDocument = require('../controllers/Document/uploadDocument');
const getDocuments = require('../controllers/Document/getDocuments');
const verifyDocument = require('../controllers/Document/verifyDocument');
const deleteDocument = require('../controllers/Document/deleteDocument');

// Task Controllers
const createTask = require('../controllers/Task/createTask');
const updateTask = require('../controllers/Task/updateTask');
const getTasks = require('../controllers/Task/getTasks');
const addComment = require('../controllers/Task/addComment');

// Performance Controllers
const createReview = require('../controllers/Performance/createReview');
const submitReview = require('../controllers/Performance/submitReview');
const getReviews = require('../controllers/Performance/getReviews');

// Payroll Controllers
const generatePayroll = require('../controllers/Payroll/generatePayroll');
const generatePayslip = require('../controllers/Payroll/generatePayslip');

// Analytics Controllers
const getDashboardStats = require('../controllers/Analytics/getDashboardStats');

// Admin Controller
const adminController = require('../controllers/ManageAdmin');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ============ AUTHENTICATION ROUTES ============
router.post('/register', UserRegistration);
router.post('/email', checkEmail);
router.post('/password', checkPassword);
router.post('/admin', authenticated, checkAdmin);
router.post('/verify-otp', otpController.verifyOtp);
router.post('/resend-otp', otpController.sendOtp);

// ============ ADMIN ROUTES ============
router.get('/admins', authenticated, checkRole(['super_admin', 'admin']), adminController.listAdmins);
router.put('/admins/:adminId', authenticated, checkRole(['super_admin']), adminController.updateAdmin);
router.delete('/admins/:adminId', authenticated, checkRole(['super_admin']), adminController.deleteAdmin);

// ============ STAFF ROUTES ============
router.post('/add-staff', authenticated, checkPermission(['employee.create']), addStaff);
router.get('/get-staffs', authenticated, checkPermission(['employee.view']), getStaffs);
router.get('/get-staffs/:id', authenticated, checkPermission(['employee.view']), getStaffs);
router.patch('/edit-staffs/:id', authenticated, checkPermission(['employee.update']), editStaffs);
router.delete('/delete-staffs/:id', authenticated, checkPermission(['employee.delete']), deleteStaffs);

// ============ DEPARTMENT ROUTES ============
router.post('/add-dept', authenticated, checkPermission(['department.create']), addDepartment);
router.get('/get-dept', authenticated, checkPermission(['department.view']), getDepartment);
router.get('/get-dept/:id', authenticated, checkPermission(['department.view']), getDepartment);
router.patch('/edit-dept/:id', authenticated, checkPermission(['department.update']), editDepartment);
router.delete('/delete-dept/:id', authenticated, checkPermission(['department.delete']), deleteDepartment);

// ============ LEAVE ROUTES ============
router.post('/apply-leave/:id', authenticated, checkPermission(['leave.create']), leaveUserApply);
router.get('/get-leave', authenticated, checkPermission(['leave.view']), getAllLeaves);
router.get('/get-leave/:id', authenticated, checkPermission(['leave.view']), EmployeeIDLeave);
router.put('/edit-leave/:id', authenticated, checkPermission(['leave.update']), EditLeaveRequest);
router.delete('/delete-leave/:id', authenticated, checkPermission(['leave.delete']), deleteLeaveRequest);
router.put('/leave/approve/:id', authenticated, checkPermission(['leave.approve']), ApproveLeave);
router.put('/leave/reject/:id', authenticated, checkPermission(['leave.approve']), rejectLeave);
router.put('/leave/other-status/:id', authenticated, checkPermission(['leave.approve']), OtherLeaveStatus);

// ============ SALARY ROUTES ============
router.post('/add-salary', authenticated, checkPermission(['salary.create']), addSalary);
router.put('/edit-salary/:id', authenticated, checkPermission(['salary.update']), editSalary);
router.delete('/delete-salary/:id', authenticated, checkPermission(['salary.delete']), deleteSalary);
router.get('/get-salaries', authenticated, checkPermission(['salary.view']), getAllSalaries);
router.get('/get-salary/:employeeId', authenticated, checkPermission(['salary.view']), getSalaryByEmployeeId);

// ============ ATTENDANCE ROUTES ============
router.post('/attendance/check-in/:employeeId', authenticated, checkPermission(['attendance.create']), checkIn);
router.post('/attendance/check-out/:employeeId', authenticated, checkPermission(['attendance.create']), checkOut);
router.post('/attendance/break/:employeeId', authenticated, checkPermission(['attendance.create']), addBreak);
router.get('/attendance', authenticated, checkPermission(['attendance.view']), getAttendance);
router.get('/attendance/:employeeId', authenticated, checkPermission(['attendance.view']), getAttendance);

// ============ NOTIFICATION ROUTES ============
router.get('/notifications', authenticated, getNotifications);
router.patch('/notifications/:notificationId/read', authenticated, markAsRead);
router.patch('/notifications/read-all', authenticated, markAllAsRead);

// ============ DOCUMENT ROUTES ============
router.post('/documents/upload', authenticated, checkPermission(['document.create']), uploadDocument);
router.get('/documents', authenticated, checkPermission(['document.view']), getDocuments);
router.get('/documents/:employeeId', authenticated, checkPermission(['document.view']), getDocuments);
router.patch('/documents/:documentId/verify', authenticated, checkPermission(['document.update']), verifyDocument);
router.delete('/documents/:documentId', authenticated, checkPermission(['document.delete']), deleteDocument);

// ============ TASK ROUTES ============
router.post('/tasks', authenticated, checkPermission(['task.create']), createTask);
router.put('/tasks/:taskId', authenticated, checkPermission(['task.update']), updateTask);
router.get('/tasks', authenticated, checkPermission(['task.view']), getTasks);
router.post('/tasks/:taskId/comment', authenticated, checkPermission(['task.update']), addComment);

// ============ PERFORMANCE REVIEW ROUTES ============
router.post('/performance/reviews', authenticated, checkPermission(['performance.create']), createReview);
router.patch('/performance/reviews/:reviewId/submit', authenticated, checkPermission(['performance.update']), submitReview);
router.get('/performance/reviews', authenticated, checkPermission(['performance.view']), getReviews);
router.get('/performance/reviews/:employeeId', authenticated, checkPermission(['performance.view']), getReviews);

// ============ PAYROLL ROUTES ============
router.post('/payroll/generate', authenticated, checkPermission(['salary.create']), generatePayroll);
router.post('/payroll/:payrollId/payslip', authenticated, checkPermission(['salary.view']), generatePayslip);

// ============ ANALYTICS ROUTES ============
router.get('/analytics/dashboard', authenticated, checkPermission(['reports.view']), getDashboardStats);

module.exports = router;