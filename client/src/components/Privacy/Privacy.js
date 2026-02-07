import React from 'react';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-container">
            <div className="privacy-header">
                <h1><i className="fa fa-shield-alt"></i> Privacy Policy</h1>
                <p className="last-updated">Last Updated: January 2024</p>
            </div>

            <section className="privacy-section">
                <h2>1. Introduction</h2>
                <p>
                    This Privacy Policy describes how Employee Management System (EMS) collects, uses, and protects your personal information. 
                    We are committed to ensuring that your privacy is protected and that your data is handled securely.
                </p>
            </section>

            <section className="privacy-section">
                <h2>2. Data Collection</h2>
                <p>We collect the following types of information:</p>
                <ul>
                    <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, and address</li>
                    <li><strong>Employment Information:</strong> Employee ID, department, position, joining date, and salary details</li>
                    <li><strong>Attendance Data:</strong> Check-in/check-out times, leave requests, and attendance records</li>
                    <li><strong>Performance Data:</strong> Task assignments, performance reviews, and ratings</li>
                    <li><strong>Documents:</strong> Uploaded documents such as contracts, certificates, and identification</li>
                    <li><strong>Usage Information:</strong> Login times, IP addresses, and system usage patterns</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>3. How We Use Your Data</h2>
                <p>We use your information for the following purposes:</p>
                <ul>
                    <li>Managing employee records and HR processes</li>
                    <li>Processing payroll and salary payments</li>
                    <li>Tracking attendance and leave management</li>
                    <li>Evaluating performance and productivity</li>
                    <li>Communicating important updates and notifications</li>
                    <li>Complying with legal and regulatory requirements</li>
                    <li>Improving system functionality and user experience</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>4. Data Security</h2>
                <p>We implement industry-standard security measures to protect your data:</p>
                <ul>
                    <li><strong>Encryption:</strong> All data is encrypted both in transit (SSL/TLS) and at rest</li>
                    <li><strong>Access Control:</strong> Role-based access ensures only authorized personnel can view sensitive data</li>
                    <li><strong>Authentication:</strong> Secure login with password requirements and optional two-factor authentication</li>
                    <li><strong>Regular Backups:</strong> Data is regularly backed up to prevent loss</li>
                    <li><strong>Security Audits:</strong> Regular security assessments and vulnerability scans</li>
                    <li><strong>Data Monitoring:</strong> Continuous monitoring for suspicious activities</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>5. Data Sharing and Disclosure</h2>
                <p>
                    We do not sell, trade, or rent your personal information to third parties. Your data may be shared only in the following circumstances:
                </p>
                <ul>
                    <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulations</li>
                    <li><strong>Service Providers:</strong> With trusted third-party services that help us operate the system (e.g., cloud storage, payment processors)</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>6. Your Rights</h2>
                <p>As a user of the Employee Management System, you have the following rights:</p>
                <ul>
                    <li><strong>Access:</strong> Request a copy of your personal data stored in the system</li>
                    <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal and operational requirements)</li>
                    <li><strong>Portability:</strong> Request your data in a portable format</li>
                    <li><strong>Objection:</strong> Object to certain types of data processing</li>
                    <li><strong>Restriction:</strong> Request restriction of data processing in specific situations</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2>7. Data Retention</h2>
                <p>
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
                    comply with legal obligations, resolve disputes, and enforce our agreements. Upon termination of employment, 
                    data is retained according to legal requirements and company policy.
                </p>
            </section>

            <section className="privacy-section">
                <h2>8. Cookies and Tracking</h2>
                <p>
                    Our system may use cookies and similar tracking technologies to enhance user experience, maintain sessions, 
                    and analyze system usage. You can control cookie settings through your browser preferences.
                </p>
            </section>

            <section className="privacy-section">
                <h2>9. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting 
                    the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
                </p>
            </section>

            <section className="privacy-section contact-section">
                <h2>10. Contact Us</h2>
                <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
                <div className="contact-details">
                    <p><i className="fa fa-envelope"></i> <strong>Email:</strong> privacy@ems.com</p>
                    <p><i className="fa fa-phone"></i> <strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><i className="fa fa-map-marker-alt"></i> <strong>Address:</strong> 123 Business St, Suite 100, City, State 12345</p>
                </div>
            </section>
        </div>
    );
};

export default Privacy;
