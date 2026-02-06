const Leave = require('../../models/Leave');

<<<<<<< HEAD
const EmployeeIDLeave = async (req, res) => {
    try {
        const { id: employeeId } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        let query = { employee: employeeId };

        if (status) {
            query.status = status;
        }

        const leaves = await Leave.find(query)
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Leave.countDocuments(query);

        // Get leave summary
        const summary = {
            total: await Leave.countDocuments({ employee: employeeId }),
            pending: await Leave.countDocuments({ employee: employeeId, status: 'pending' }),
            approved: await Leave.countDocuments({ employee: employeeId, status: 'approved' }),
            rejected: await Leave.countDocuments({ employee: employeeId, status: 'rejected' })
        };

        return res.status(200).json({
            success: true,
            data: leaves,
            summary,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get employee leave error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching employee leaves',
=======
const getLeave = async (req, res) => {
    const employeeId = req.params.id;

    if (!employeeId) {
        return res.status(400).json({
            message: "Employee ID is required"
        });
    }

    try {
        const leaveData = await Leave.find({ employee: employeeId })
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        if (!leaveData || leaveData.length === 0) {
            return res.status(404).json({
                message: "No leave records found for this employee"
            });
        }

        return res.status(200).json({
            message: "Leave Record Found For this Particular Employee",
            success: true,
            data: leaveData
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retrieving leave data",
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
            error: error.message
        });
    }
};

<<<<<<< HEAD
module.exports = EmployeeIDLeave;
=======
module.exports = getLeave;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
