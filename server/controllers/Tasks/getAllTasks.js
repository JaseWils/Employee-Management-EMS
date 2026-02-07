const Task = require('../../models/Task');

const getAllTasks = async (req, res) => {
    try {
        const { status, assignedTo } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'fullName email profileImage')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: tasks
        });

    } catch (error) {
        console.error('Get tasks error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};

module.exports = getAllTasks;