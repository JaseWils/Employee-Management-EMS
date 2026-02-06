const Task = require('../../models/Task');
const createNotification = require('../Notification/createNotification');

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            status = 'todo',
            priority = 'medium',
            dueDate,
            estimatedHours,
            tags,
            dependencies
        } = req.body;

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            assignedBy: req.user.id,
            status,
            priority,
            dueDate,
            estimatedHours,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            dependencies,
            watchers: [req.user.id, assignedTo]
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'fullName email')
            .populate('assignedBy', 'name email')
            .populate('project', 'name');

        // Notify assigned user
        await createNotification({
            recipient: assignedTo,
            sender: req.user.id,
            type: 'task_assigned',
            title: 'New Task Assigned',
            message: `You have been assigned a new task: ${title}`,
            data: { taskId: task._id },
            actionUrl: `/tasks/${task._id}`,
            priority: priority === 'urgent' ? 'high' : 'medium'
        });

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