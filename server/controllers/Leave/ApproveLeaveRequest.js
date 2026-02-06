const Leave = require('../../models/Leave');
<<<<<<< HEAD
const createNotification = require('../Notification/createNotification');

const ApproveLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const leave = await Leave.findById(id).populate('employee', 'fullName email');

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        if (leave.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Leave request has already been processed'
            });
        }

        leave.status = 'approved';
        leave.approvedBy = userId;
        leave.approvedAt = new Date();
        await leave.save();

        // Send notification to employee
        if (createNotification) {
            await createNotification({
                recipient: leave.employee._id,
                sender: userId,
                type: 'leave_approved',
                title: 'Leave Request Approved',
                message: `Your leave request from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()} has been approved.`,
                data: { leaveId: leave._id },
                actionUrl: `/leave-history`,
                priority: 'high'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Leave request approved successfully',
            data: leave
        });

    } catch (error) {
        console.error('Approve leave error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error approving leave request',
            error: error.message
=======

const approveLeave = async (req, res) => {
    const leaveId = req.params.id;

    if (!leaveId) {
        return res.json({
            message: 'Leave ID not provided',
            error: true,
        });
    }

    try {
        const { approvedBy } = req.body;

        const leaveRequest = await Leave.findByIdAndUpdate(
            leaveId,
            {
                status: 'Approved',
                approvedBy: approvedBy || undefined,
                approvedAt: new Date()
            },
            { new: true }
        ).populate('employee', 'fullName email');

        if (!leaveRequest) {
            return res.status(404).json({
                message: 'Leave request not found',
                error: true,
            });
        }

        return res.json({
            message: 'Leave request approved successfully',
            success: true,
            data: leaveRequest
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
module.exports = ApproveLeave;
=======
module.exports = approveLeave;



// {
//     "message": "Leave Record Found For this Particular Employee ",
//     "data": [
//       {
//         "status": "Pending",
//         "_id": "667d7805b1eadf93f315f77b",
//         "employeeId": "667d605fe472f13047a00717",
//         "reason": "Medical",
//         "description": "Medical leave for surgery",
//         "fromdate": "2023-06-01",
//         "todate": "2023-06-10",
//         "documentproof": "medical_certificate.jpg",
//         "__v": 0
//       },
//       {
//         "status": "Pending",
//         "_id": "667e2bf208d207c366dbc127",
//         "employeeId": "667d605fe472f13047a00717",
//         "reason": "Medical",
//         "description": "Medical leave for surgery",
//         "fromdate": "2023-06-01",
//         "todate": "2023-06-10",
//         "documentproof": "medical_certificate.jpg",
//         "__v": 0
//       },
//       {
//         "status": "Pending",
//         "_id": "667e2bf808d207c366dbc12a",
//         "employeeId": "667d605fe472f13047a00717",
//         "reason": "Medicahhhl",
//         "description": "Medical leave for surgery",
//         "fromdate": "2023-06-01",
//         "todate": "2023-06-10",
//         "documentproof": "medical_certificate.jpg",
//         "__v": 0
//       },
//       {
//         "status": "Pending",
//         "_id": "667e2c0008d207c366dbc12d",
//         "employeeId": "667d605fe472f13047a00717",
//         "reason": "Medicahhhl",
//         "description": "Medical leave r surgery",
//         "fromdate": "2023-06-01",
//         "todate": "2023-06-10",
//         "documentproof": "medical_certificate.jpg",
//         "__v": 0
//       }
//     ]
//   }
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
