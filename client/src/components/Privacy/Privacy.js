import React from 'react';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-container">
            <div className="privacy-header">
                <h1><i className="fa fa-shield-alt"></i> Privacy Policy</h1>
                <p>Last Updated: February 7, 2026</p>
            </div>
            
            <div className="privacy-content">
                <section className="privacy-section">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to the Employee Management System (EMS). This Privacy Policy explains how we collect, 
                        use, disclose, and safeguard your information when you use our employee management platform. 
                        Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
                        policy, please do not access the application.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>2. Information We Collect</h2>
                    <p>We collect information that you provide directly to us, including:</p>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, and address</li>
                        <li><strong>Employment Information:</strong> Employee ID, department, position, joining date, and salary details</li>
                        <li><strong>Attendance Data:</strong> Check-in/check-out times, leave applications, and absence records</li>
                        <li><strong>Performance Data:</strong> Performance reviews, goals, and achievements</li>
                        <li><strong>Documents:</strong> Uploaded files such as resumes, certificates, and identification documents</li>
                        <li><strong>System Usage Data:</strong> Login times, IP addresses, and activity logs</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>3. How We Use Your Information</h2>
                    <p>We use the information we collect for the following purposes:</p>
                    <ul>
                        <li>To manage employee records and HR operations</li>
                        <li>To process payroll and manage compensation</li>
                        <li>To track attendance and manage leave requests</li>
                        <li>To conduct performance evaluations and reviews</li>
                        <li>To communicate with employees regarding work-related matters</li>
                        <li>To generate reports and analytics for management decisions</li>
                        <li>To ensure compliance with labor laws and regulations</li>
                        <li>To maintain system security and prevent unauthorized access</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>4. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational security measures to protect your 
                        personal information against unauthorized access, alteration, disclosure, or destruction. 
                        These measures include:
                    </p>
                    <ul>
                        <li>Encryption of data in transit and at rest</li>
                        <li>Secure authentication and authorization mechanisms</li>
                        <li>Regular security audits and vulnerability assessments</li>
                        <li>Access controls limiting data access to authorized personnel only</li>
                        <li>Regular backups to prevent data loss</li>
                        <li>Employee training on data protection and security best practices</li>
                    </ul>
                    <p className="security-note">
                        <i className="fa fa-lock"></i> All sensitive data is encrypted using industry-standard 
                        encryption protocols. Access is restricted to authorized personnel only.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>5. Data Sharing and Disclosure</h2>
                    <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                    <ul>
                        <li><strong>With Your Consent:</strong> When you have given explicit permission</li>
                        <li><strong>Legal Requirements:</strong> To comply with applicable laws, regulations, or legal processes</li>
                        <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in our operations (e.g., cloud hosting, payroll processing)</li>
                        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    </ul>
                </section>

                <section className="privacy-section">
                    <h2>6. Your Rights</h2>
                    <p>As an employee, you have the following rights regarding your personal data:</p>
                    <ul>
                        <li><strong>Right to Access:</strong> Request access to your personal information</li>
                        <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                        <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                        <li><strong>Right to Data Portability:</strong> Request a copy of your data in a structured format</li>
                        <li><strong>Right to Object:</strong> Object to certain types of data processing</li>
                        <li><strong>Right to Withdraw Consent:</strong> Withdraw previously given consent at any time</li>
                    </ul>
                    <p>To exercise any of these rights, please contact the HR department or system administrator.</p>
                </section>

                <section className="privacy-section">
                    <h2>7. Data Retention</h2>
                    <p>
                        We retain your personal information for as long as necessary to fulfill the purposes outlined 
                        in this privacy policy, unless a longer retention period is required or permitted by law. 
                        After termination of employment, we may retain certain information for legal, tax, and 
                        regulatory compliance purposes.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>8. Cookies and Tracking Technologies</h2>
                    <p>
                        Our system may use cookies and similar tracking technologies to enhance user experience, 
                        maintain session information, and analyze system usage. You can control cookie settings 
                        through your browser preferences.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>9. Changes to This Privacy Policy</h2>
                    <p>
                        We may update this privacy policy from time to time to reflect changes in our practices or 
                        for other operational, legal, or regulatory reasons. We will notify you of any material 
                        changes by posting the new privacy policy on this page and updating the "Last Updated" date.
                    </p>
                </section>

                <section className="privacy-section">
                    <h2>10. Contact Information</h2>
                    <p>If you have questions or concerns about this privacy policy or our data practices, please contact:</p>
                    <div className="contact-box">
                        <p><i className="fa fa-building"></i> <strong>HR Department</strong></p>
                        <p><i className="fa fa-envelope"></i> privacy@ems.com</p>
                        <p><i className="fa fa-phone"></i> +1 (555) 123-4567</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
