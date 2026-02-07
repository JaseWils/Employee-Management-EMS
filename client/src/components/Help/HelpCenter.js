import React from 'react';
import './HelpCenter.css';

const HelpCenter = () => {
    return (
        <div className="help-center-container">
            <div className="help-header">
                <h1><i className="fa fa-question-circle"></i> Help Center</h1>
                <p>Find answers to commonly asked questions</p>
            </div>
            
            <section className="help-section">
                <h2><i className="fa fa-rocket"></i> Getting Started</h2>
                
                <div className="faq-item">
                    <h3>How do I add a new employee?</h3>
                    <p>Navigate to <strong>Employees → Add Employee</strong>, fill in the required details including name, email, department, position, and other information, then click Submit.</p>
                </div>
                
                <div className="faq-item">
                    <h3>How do I process payroll?</h3>
                    <p>Go to <strong>Payroll → Process Payroll</strong>, select the month you want to process, review the employee data and calculated salaries, and click Process Payroll button.</p>
                </div>

                <div className="faq-item">
                    <h3>How do I apply for leave?</h3>
                    <p>Navigate to <strong>Leave → Apply Leave</strong>, select the leave type, choose start and end dates, provide a reason, and submit your application.</p>
                </div>

                <div className="faq-item">
                    <h3>How do I track attendance?</h3>
                    <p>Go to <strong>Attendance → Mark Attendance</strong>. Click Check In when you arrive and Check Out when you leave. You can view your attendance history in Attendance Records.</p>
                </div>
            </section>

            <section className="help-section">
                <h2><i className="fa fa-cog"></i> Common Tasks</h2>
                
                <div className="faq-item">
                    <h3>How do I upload documents?</h3>
                    <p>Navigate to <strong>Documents</strong>, click Upload Document, fill in the document details, select the file (PDF, JPG, or PNG), and submit.</p>
                </div>

                <div className="faq-item">
                    <h3>How do I manage employee salaries?</h3>
                    <p>Go to <strong>Salary → Manage Salary</strong>. Click Add Salary to create a new salary record, or use Edit/Delete buttons to manage existing records.</p>
                </div>

                <div className="faq-item">
                    <h3>How do I assign tasks?</h3>
                    <p>Navigate to <strong>Tasks</strong>, click Create Task, fill in task details including title, description, assignee, priority, and due date, then save.</p>
                </div>

                <div className="faq-item">
                    <h3">How do I export employee data?</h3>
                    <p>Go to <strong>Employees</strong> list, click the Export button at the top right to download employee data as a CSV file.</p>
                </div>
            </section>

            <section className="help-section">
                <h2><i className="fa fa-shield-alt"></i> Account & Security</h2>
                
                <div className="faq-item">
                    <h3>How do I change my password?</h3>
                    <p>Navigate to <strong>Settings → Profile</strong>, find the Change Password section, enter your current password and new password, then save.</p>
                </div>

                <div className="faq-item">
                    <h3>What should I do if I forget my password?</h3>
                    <p>On the login page, click "Forgot Password" and follow the instructions to reset your password via email.</p>
                </div>
            </section>

            <section className="help-section contact-section">
                <h2><i className="fa fa-headset"></i> Contact Support</h2>
                <p>Can't find what you're looking for? Our support team is here to help!</p>
                
                <div className="contact-info">
                    <div className="contact-item">
                        <i className="fa fa-envelope"></i>
                        <div>
                            <strong>Email</strong>
                            <p>support@ems.com</p>
                        </div>
                    </div>
                    
                    <div className="contact-item">
                        <i className="fa fa-phone"></i>
                        <div>
                            <strong>Phone</strong>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>
                    
                    <div className="contact-item">
                        <i className="fa fa-clock"></i>
                        <div>
                            <strong>Business Hours</strong>
                            <p>Monday - Friday, 9:00 AM - 5:00 PM EST</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpCenter;
