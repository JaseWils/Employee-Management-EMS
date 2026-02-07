const Payroll = require('../../models/Payroll');
const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const generatePayslip = async (req, res) => {
    try {
        const { payrollId } = req.params;

        const payroll = await Payroll.findById(payrollId)
            .populate('employee', 'fullName email employeeId department')
            .populate('paidBy', 'name email');

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: 'Payroll record not found'
            });
        }

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `payslip_${payroll.employee.employeeId}_${payroll.month}_${payroll.year}.pdf`;
        const filePath = path.join('/tmp', fileName);
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('PAYSLIP', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text('Employee Management System', { align: 'center' });
        doc.moveDown(2);

        // Employee Details
        doc.fontSize(10).font('Helvetica-Bold').text('Employee Details:', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica');
        doc.text(`Name: ${payroll.employee.fullName}`);
        doc.text(`Employee ID: ${payroll.employee.employeeId}`);
        doc.text(`Department: ${payroll.employee.department}`);
        doc.text(`Email: ${payroll.employee.email}`);
        doc.text(`Pay Period: ${getMonthName(payroll.month)} ${payroll.year}`);
        doc.moveDown(2);

        // Earnings
        doc.font('Helvetica-Bold').text('EARNINGS', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica');
        
        const earnings = [
            { label: 'Basic Salary', amount: payroll.baseSalary },
            { label: 'House Rent Allowance', amount: payroll.allowances.houseRent },
            { label: 'Transport Allowance', amount: payroll.allowances.transport },
            { label: 'Medical Allowance', amount: payroll.allowances.medical },
            { label: 'Food Allowance', amount: payroll.allowances.food },
            { label: 'Bonus', amount: payroll.allowances.bonus },
            { label: 'Overtime Pay', amount: payroll.calculations.overtimePay || 0 }
        ];

        earnings.forEach(item => {
            if (item.amount > 0) {
                doc.text(`${item.label}:`, 50, doc.y, { continued: true });
                doc.text(`$${item.amount.toFixed(2)}`, { align: 'right' });
            }
        });

        doc.moveDown();
        doc.font('Helvetica-Bold');
        doc.text('Gross Salary:', 50, doc.y, { continued: true });
        doc.text(`$${payroll.calculations.grossSalary.toFixed(2)}`, { align: 'right' });
        doc.moveDown(2);

        // Deductions
        doc.font('Helvetica-Bold').text('DEDUCTIONS', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica');

        const deductions = [
            { label: 'Income Tax', amount: payroll.deductions.tax },
            { label: 'Insurance', amount: payroll.deductions.insurance },
            { label: 'Provident Fund', amount: payroll.deductions.providentFund },
            { label: 'Loan', amount: payroll.deductions.loan },
            { label: 'Advance', amount: payroll.deductions.advance }
        ];

        deductions.forEach(item => {
            if (item.amount > 0) {
                doc.text(`${item.label}:`, 50, doc.y, { continued: true });
                doc.text(`$${item.amount.toFixed(2)}`, { align: 'right' });
            }
        });

        doc.moveDown();
        doc.font('Helvetica-Bold');
        doc.text('Total Deductions:', 50, doc.y, { continued: true });
        doc.text(`$${payroll.calculations.totalDeductions.toFixed(2)}`, { align: 'right' });
        doc.moveDown(2);

        // Net Salary
        doc.fontSize(14).font('Helvetica-Bold');
        doc.rect(50, doc.y, 500, 30).fillAndStroke('#667eea', '#667eea');
        doc.fillColor('white').text('NET SALARY:', 60, doc.y + 8, { continued: true });
        doc.text(`$${payroll.calculations.netSalary.toFixed(2)}`, { align: 'right' });
        doc.fillColor('black');
        doc.moveDown(3);

        // Attendance Summary
        doc.fontSize(10).font('Helvetica-Bold').text('ATTENDANCE SUMMARY', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica');
        doc.text(`Working Days: ${payroll.attendance.workingDays}`);
        doc.text(`Present Days: ${payroll.attendance.presentDays}`);
        doc.text(`Absent Days: ${payroll.attendance.absentDays}`);
        doc.text(`Paid Leaves: ${payroll.attendance.paidLeaves}`);
        doc.text(`Total Work Hours: ${payroll.attendance.totalWorkHours?.toFixed(2) || 0}`);
        doc.text(`Overtime Hours: ${payroll.attendance.overtimeHours?.toFixed(2) || 0}`);
        doc.moveDown(2);

        // Footer
        doc.fontSize(8).font('Helvetica').fillColor('gray');
        doc.text('This is a computer-generated payslip and does not require a signature.', { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });

        doc.end();

        // Wait for PDF to be written
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'ems/payslips',
            resource_type: 'auto',
            public_id: `payslip_${payroll.employee.employeeId}_${payroll.month}_${payroll.year}`
        });

        // Update payroll with payslip URL
        payroll.payslipUrl = result.secure_url;
        await payroll.save();

        // Clean up temp file
        fs.unlinkSync(filePath);

        return res.status(200).json({
            success: true,
            message: 'Payslip generated successfully',
            data: {
                payslipUrl: result.secure_url
            }
        });
    } catch (error) {
        console.error('Generate payslip error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error generating payslip',
            error: error.message
        });
    }
};

const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
};

module.exports = generatePayslip;