const express=require('express')
const router=express.Router()
const bodyParser=require('body-parser')
//login and registration user and admin
const UserRegistration=require('../controllers/UserRegistration')
const checkEmail=require('.././controllers/checkEmail')
const checkPassword=require('.././controllers/checkPassword')
const checkAdmin=require("../controllers/checkAdmin");
const authenticated=require('../helpers/Authentication')
const otpController = require('../controllers/otpController');
//razorpay payment gateway
const paymentController=require('../RazorPay-Payment-Gateway/paymentController')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


//OTP routes
router.post('/verify-otp', otpController.verifyOtp);
router.post('/resend-otp',otpController.sendOtp)


//staff related end points
const addStaff=require('../controllers/Staffs/AddStaff');
const getStaffs=require('../controllers/Staffs/GetStaff');
const editStaffs=require('../controllers/Staffs/EditStaff');
const deleteStaffs=require('../controllers/Staffs/DeleteStaff')






//department related endpoints
const addDepartment=require('../controllers/Departments/addDepartment');
const getDepartment=require("../controllers/Departments/getDepartment");
const editDepartment=require('../controllers/Departments/editDepartment')
const deleteDepartment=require('../controllers/Departments/DeleteDepartment');




//leave related endpoints
const leaveUserApply=require('../controllers/Leave/AddLeave');
const getAllLeaves=require('../controllers/Leave/GetAllLeave');
const EmployeeIDLeave=require('../controllers/Leave/getEmployeLeave');
const EditLeaveRequest=require('../controllers/Leave/EditLeave');
const deleteLeaveRequest =require('../controllers/Leave/DeleteLeave');
const ApproveLeave=require('../controllers/Leave/ApproveLeaveRequest');
const rejectLeave=require('../controllers/Leave/RejectLeaveRequest');
const OtherLeaveStatus=require('../controllers/Leave/OtherLeaveApproveStatus')
const adminController=require('../controllers/ManageAdmin')


//Salary Related Endpoints

const addSalary = require('../controllers/Salary/AddSalary');
const editSalary = require('../controllers/Salary/EditSalary');
const deleteSalary = require('../controllers/Salary/DeleteSalary');
const getAllSalaries = require('../controllers/Salary/getAllSalaray');
const getSalaryByEmployeeId = require('../controllers/Salary/getSalaryId')


//controllers


// Registration Controller
router.post('/register',UserRegistration)
//Email
router.post('/email',checkEmail)
//Check Password
router.post('/password',checkPassword)
//check admin
router.post('/admin',authenticated,checkAdmin)

// List all admins
router.get('/admins', authenticated, adminController.listAdmins);

// Update admin details
router.put('/admins/:adminId', authenticated, adminController.updateAdmin);

// Delete an admin
router.delete('/admins/:adminId', authenticated, adminController.deleteAdmin);


// Staff Endpoints Starts


//add staff
router.post('/add-staff',addStaff);
//get all staffs
router.get('/get-staffs',getStaffs)
//get particular staffs
router.get('/get-staffs/:id',getStaffs);
//edit staff
router.patch('/edit-staffs/:id',editStaffs);
//delete staffs
router.delete('/delete-staffs/:id',deleteStaffs)





// Department Endpoints Starts


//add department
router.post('/add-dept',addDepartment);
//get all department
router.get('/get-dept',getDepartment);
//get particular departments
router.get('/get-dept/:id',getDepartment);
//edit department
router.patch('/edit-dept/:id',editDepartment);
//delete department
router.delete('/delete-dept/:id',deleteDepartment);


//leave Endpoits Starts




//leave user Apply
router.post('/apply-leave/:id',leaveUserApply);
//get All Leaves
router.get('/get-leave',getAllLeaves);
//get leave with id
router.get('/get-leave/:id',EmployeeIDLeave)
//edit leave request
router.put('/edit-leave/:id',EditLeaveRequest)
//delete leave request
router.delete('/delete-leave/:id',deleteLeaveRequest);
//approve leave
router.put('/leave/approve/:id',ApproveLeave);
//reject leave
router.put('/leave/reject/:id',rejectLeave);
//other leave status
router.put('/leave/other-status/:id',OtherLeaveStatus)





//salary endpoints

router.post('/add-salary/:id', addSalary);
router.put('/edit-salary/:id', editSalary);
router.delete('/delete-salary/:id', deleteSalary);
router.get('/all-salary', getAllSalaries);
router.get('/emp-salary/:id', getSalaryByEmployeeId);


//razorpay gateway

router.post('/createSalaryPayment', paymentController.createSalaryPayment);

module.exports=router;

// "_id": "667e392345872e70203db1da",
// "employeeId": "667d605fe472f13047a00717",