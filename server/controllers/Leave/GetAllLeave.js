const Leave = require('../../models/Leave');

const getAllLeaves = async (req, res) => {
    try {
<<<<<<< HEAD
        const { status, leaveType, page = 1, limit = 20 } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (leaveType) {
            query.leaveType = leaveType;
        }

        const leaves = await Leave.find(query)
            .populate('employee', 'fullName email employeeId department')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Leave.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: leaves,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get all leaves error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching leaves',
=======
        const leaveData = await Leave.find()
            .populate('employee', 'fullName email department')
            .populate('approvedBy', 'name email')
            .sort({ createdAt: -1 });

        if (!leaveData || leaveData.length === 0) {
            return res.status(404).json({
                message: "No leave records found"
            });
        }

        return res.status(200).json({
            message: "Leave List Record Found",
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
module.exports = getAllLeaves;
=======
module.exports = getAllLeaves;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
