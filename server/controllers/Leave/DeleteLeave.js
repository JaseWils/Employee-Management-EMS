const Leave = require('../../models/Leave');

<<<<<<< HEAD
const deleteLeaveRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        // Only allow deleting pending leaves
        if (leave.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete leave request that has been processed'
            });
        }

        await Leave.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Leave request deleted successfully'
        });

    } catch (error) {
        console.error('Delete leave error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting leave request',
            error: error.message
=======
const deleteLeave = async (req, res) => {
    const leaveId = req.params.id;

    if (!leaveId) {
        return res.json({
            message: 'Leave ID not provided',
            error: true,
        });
    }

    try {
        // Find the leave request by ID and delete it
        const deletedLeave = await Leave.findByIdAndDelete(leaveId);

        if (!deletedLeave) {
            return res.status(404).json({
                message: 'Leave request not found',
                error: true,
            });
        }

        return res.json({
            message: 'Leave request deleted successfully',
            success: true,
            data: deletedLeave
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
module.exports = deleteLeaveRequest;
=======
module.exports = deleteLeave;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
