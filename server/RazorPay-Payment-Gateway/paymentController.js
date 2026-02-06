

// const Razorpay = require('razorpay');
// const dotenv = require('dotenv');
// const nodemailer = require('nodemailer');
// const EmployeeModel = require('../ConnectDB/models/AddStaffSchema');
// const fs = require('fs');
// const path = require('path');

// dotenv.config(); // To load environment variables from .env file

// const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

// const razorpayInstance = new Razorpay({
//     key_id: RAZORPAY_ID_KEY,
//     key_secret: RAZORPAY_SECRET_KEY
// });

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'amara.batz@ethereal.email',
//         pass: 'J8VNQDSy1uW6fWtdXF'
//     }
// });

// const createSalaryPayment = async (req, res) => {
//     try {
//         const { employeeId, amount, name, email, contact } = req.body;

//         // Check if employee ID exists
//         const employee = await EmployeeModel.findById(employeeId);
//         if (!employee) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Employee not found'
//             });
//         }

//         const paymentAmount = amount * 100; // Convert to smallest currency unit (paise)

//         const options = {
//             amount: paymentAmount,
//             currency: 'INR',
//             receipt: `salary_${employeeId}`,
//             notes: {
//                 employeeId,
//                 name,
//                 email
//             }
//         };

//         razorpayInstance.orders.create(options, async (err, order) => {
//             if (!err) {
//                 // Create a salary slip PDF (for the sake of example, using a dummy text file)
//                 const salarySlipPath = path.join(__dirname, 'salary_slip.txt');
//                 fs.writeFileSync(salarySlipPath, `Salary Slip\n\nEmployee Name: ${name}\nAmount: ₹${amount}`);

//                 // Send email notification
//                 const mailOptions = {
//                     from: 'amara.batz@ethereal.email',
//                     to: email,
//                     subject: 'Salary Payment Order Created',
//                     html: `
//                         <div style="font-family: Arial, sans-serif; line-height: 1.5;">
//                             <h2 style="color: #007BFF;">Hello ${name},</h2>
//                             <p style="font-size: 16px; color: #333;">Your salary payment order has been created successfully.</p>
//                             <p style="font-size: 16px; color: #333;"><strong>Order ID:</strong> ${order.id}</p>
//                             <p style="font-size: 16px; color: #333;"><strong>Amount:</strong> ₹${amount}</p>
//                             <p style="font-size: 16px; color: #333;">Best regards,</p>
//                             <p style="font-size: 16px; color: #333;"><strong>SolvIt</strong></p>
//                             <p style="font-size: 16px; color: #333;">Sandipan Das</p>
//                             <p style="font-size: 16px; color: #333;"><strong>Contact:</strong> 8335019404</p>
//                             <p style="font-size: 16px; color: #333;"><strong>Email:</strong> sd901656@gmail.com</p>
//                         </div>
//                     `,
//                     attachments: [
//                         {
//                             filename: 'salary_slip.txt',
//                             path: salarySlipPath
//                         }
//                     ]
//                 };

//                 try {
//                     await transporter.sendMail(mailOptions);
//                     res.status(200).json({
//                         success: true,
//                         message: 'Salary payment order created and email sent successfully',
//                         order_id: order.id,
//                         amount: paymentAmount,
//                         key_id: RAZORPAY_ID_KEY,
//                         name,
//                         email,
//                         contact
//                     });
//                 } catch (emailError) {
//                     console.error('Error sending email:', emailError.message);
//                     res.status(500).json({
//                         success: false,
//                         message: 'Salary payment order created but failed to send email',
//                         error: emailError.message
//                     });
//                 } finally {
//                     // Clean up the temporary salary slip file
//                     fs.unlinkSync(salarySlipPath);
//                 }
//             } else {
//                 res.status(400).json({ success: false, message: 'Error creating order', error: err });
//             }
//         });

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//     }
// };

// module.exports = {
//     createSalaryPayment
// };

const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const Staff = require('../models/Staff');
const fs = require('fs');
const path = require('path');

dotenv.config(); // To load environment variables from .env file

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY, GMAIL_USER, GMAIL_PASS } = process.env;

// Only initialize Razorpay if keys are provided
let razorpayInstance = null;
if (RAZORPAY_ID_KEY && RAZORPAY_SECRET_KEY) {
    razorpayInstance = new Razorpay({
        key_id: RAZORPAY_ID_KEY,
        key_secret: RAZORPAY_SECRET_KEY
    });
    console.log('✅ Razorpay initialized');
} else {
    console.log('⚠️  Razorpay not configured - payment features disabled');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER || "sd901656@gmail.com",
        pass: GMAIL_PASS || "sdvniwxgoqemxtbl"
    }
});

const createSalaryPayment = async (req, res) => {
    try {
        // Check if Razorpay is configured
        if (!razorpayInstance) {
            return res.status(503).json({
                success: false,
                message: 'Payment service not configured. Please set up Razorpay credentials.'
            });
        }

        const { employeeId, amount, name, email, contact } = req.body;

        // Check if employee ID exists
        const employee = await Staff.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const paymentAmount = amount * 100; // Convert to smallest currency unit (paise)

        const options = {
            amount: paymentAmount,
            currency: 'INR',
            receipt: `salary_${employeeId}`,
            notes: {
                employeeId,
                name,
                email
            }
        };

        razorpayInstance.orders.create(options, async (err, order) => {
            if (!err) {
                // Create a salary slip PDF (for the sake of example, using a dummy text file)
                const salarySlipPath = path.join(__dirname, 'salary_slip.txt');
                fs.writeFileSync(salarySlipPath, `Salary Slip\n\nEmployee Name: ${name}\nAmount: ₹${amount}`);

                // Send email notification
                const mailOptions = {
                    from: GMAIL_USER,
                    to: email,
                    subject: 'Salary Payment Order Created',
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                            <h2 style="color: #007BFF;">Hello ${name},</h2>
                            <p style="font-size: 16px; color: #333;">Your salary payment order has been created successfully.</p>
                            <p style="font-size: 16px; color: #333;"><strong>Order ID:</strong> ${order.id}</p>
                            <p style="font-size: 16px; color: #333;"><strong>Amount:</strong> ₹${amount}</p>
                            <p style="font-size: 16px; color: #333;">Best regards,</p>
                            <p style="font-size: 16px; color: #333;"><strong>SolvIt</strong></p>
                            <p style="font-size: 16px; color: #333;">Sandipan Das</p>
                            <p style="font-size: 16px; color: #333;"><strong>Contact:</strong> 8335019404</p>
                            <p style="font-size: 16px; color: #333;"><strong>Email:</strong> sd901656@gmail.com</p>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: 'salary_slip.txt',
                            path: salarySlipPath
                        }
                    ]
                };

                try {
                    await transporter.sendMail(mailOptions);
                    res.status(200).json({
                        success: true,
                        message: 'Salary payment order created and email sent successfully',
                        order_id: order.id,
                        amount: paymentAmount,
                        key_id: RAZORPAY_ID_KEY,
                        name,
                        email,
                        contact
                    });
                } catch (emailError) {
                    console.error('Error sending email:', emailError.message);
                    res.status(500).json({
                        success: false,
                        message: 'Salary payment order created but failed to send email',
                        error: emailError.message
                    });
                } finally {
                    // Clean up the temporary salary slip file
                    fs.unlinkSync(salarySlipPath);
                }
            } else {
                res.status(400).json({ success: false, message: 'Error creating order', error: err });
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    createSalaryPayment
};
