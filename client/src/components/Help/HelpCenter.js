import React from 'react';
import './HelpCenter.css';

const HelpCenter = () => {
    return (
        <div className="help-center-container">
            <div className="help-header">
                <h1><i className="fa fa-question-circle"></i> Help Center</h1>
                <p>Find answers to common questions and get support</p>
            </div>
            
            <div className="help-content">
                <section className="help-section">
                    <h2><i className="fa fa-rocket"></i> Getting Started</h2>
                    <div className="faq-item">
                        <h3>How do I add a new employee?</h3>
                        <p>Navigate to <strong>Employees → Add Employee</strong>, fill in the required details including name, email, department, position, and joining date. Click Submit to add the employee to the system.</p>
                    </div>
                    
                    <div className="faq-item">
                        <h3>How do I process payroll?</h3>
                        <p>Go to <strong>Payroll → Process Payroll</strong>, select the month you want to process, review the employee list and calculated salaries, then click the "Process Payroll" button to generate payslips.</p>
                    </div>

                    <div className="faq-item">
                        <h3>How do I manage employee attendance?</h3>
                        <p>Navigate to <strong>Attendance → Attendance Tracker</strong>. Employees can check in/out using this page. Administrators can view attendance records under <strong>Attendance → Records</strong>.</p>
                    </div>
                </section>

                <section className="help-section">
                    <h2><i className="fa fa-users"></i> Employee Management</h2>
                    <div className="faq-item">
                        <h3>How do I edit employee information?</h3>
                        <p>Go to <strong>Employees → Employee List</strong>, find the employee you want to edit, and click the "Edit" button next to their name. Update the information and click Save.</p>
                    </div>
                    
                    <div className="faq-item">
                        <h3>How do I export employee data?</h3>
                        <p>In the <strong>Employee List</strong> page, click the "Export" button at the top right. This will download a CSV file with all employee information.</p>
                    </div>
                </section>

                <section className="help-section">
                    <h2><i className="fa fa-calendar"></i> Leave Management</h2>
                    <div className="faq-item">
                        <h3>How do employees apply for leave?</h3>
                        <p>Employees can navigate to <strong>Leave → Apply Leave</strong>, select the leave type, enter start and end dates, provide a reason, and optionally attach supporting documents.</p>
                    </div>
                    
                    <div className="faq-item">
                        <h3>How do I approve or reject leave requests?</h3>
                        <p>Administrators can view pending leave requests under <strong>Leave → Leave Requests</strong>. Click on a request to review details and approve or reject it.</p>
                    </div>
                </section>

                <section className="help-section">
                    <h2><i className="fa fa-dollar"></i> Salary & Payroll</h2>
                    <div className="faq-item">
                        <h3>How do I set up employee salary?</h3>
                        <p>Navigate to <strong>Salary → Manage Salary</strong>, click "Add Salary", select the employee, enter basic salary, add allowances (HRA, transport, medical, etc.), and deductions (tax, insurance, etc.). The system automatically calculates net salary.</p>
                    </div>
                    
                    <div className="faq-item">
                        <h3>What are allowances and deductions?</h3>
                        <p><strong>Allowances</strong> are additional benefits added to basic salary (e.g., house rent, transport). <strong>Deductions</strong> are amounts subtracted from total salary (e.g., tax, insurance, loans).</p>
                    </div>
                </section>

                <section className="help-section">
                    <h2><i className="fa fa-file"></i> Document Management</h2>
                    <div className="faq-item">
                        <h3>How do I upload documents?</h3>
                        <p>Go to <strong>Documents → Upload Document</strong>, select the file, choose document type, add title and description, set expiry date if applicable, and click Upload.</p>
                    </div>
                    
                    <div className="faq-item">
                        <h3>What file types are supported?</h3>
                        <p>The system supports PDF, JPG, and PNG files up to 5MB in size.</p>
                    </div>
                </section>

                <section className="help-section">
                    <h2><i className="fa fa-headset"></i> Contact Support</h2>
                    <p>If you need additional assistance, please contact our support team:</p>
                    <div className="contact-info">
                        <p><i className="fa fa-envelope"></i> Email: <a href="mailto:support@ems.com">support@ems.com</a></p>
                        <p><i className="fa fa-phone"></i> Phone: +1 (555) 123-4567</p>
                        <p><i className="fa fa-clock"></i> Support Hours: Monday - Friday, 9:00 AM - 6:00 PM</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HelpCenter;
