const Task = require('../../models/Task');

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate, status } = req.body;

        const task = await Task.create({
            title,
            description,
            assignedTo,
            priority: priority || 'medium',
            dueDate,
            status: status || 'todo',
            createdBy: req.user.id
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'fullName email')
            .populate('createdBy', 'name email');

        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: populatedTask
        });

    } catch (error) {
        console.error('Create task error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating task',
            error: error.message
        });
    }
};

module.exports = createTask;