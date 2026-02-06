const Leave = require('../../models/Leave');

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
        });
    }
};

module.exports = deleteLeaveRequest;