const Task = require('../../models/Task');
const createNotification = require('../Notification/createNotification');

const addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        task.comments.push({
            user: req.user.id,
            text,
            createdAt: new Date()
        });

        await task.save();

        const populatedTask = await Task.findById(taskId)
            .populate('comments.user', 'name email');

        // Notify watchers
        const watchers = task.watchers.filter(w => w.toString() !== req.user.id);
        
        for (const watcher of watchers) {
            await createNotification({
                recipient: watcher,
                sender: req.user.id,
                type: 'task_assigned',
                title: 'New Comment on Task',
                message: `New comment on task: ${task.title}`,
                data: { taskId: task._id },
                actionUrl: `/tasks/${task._id}`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            data: populatedTask
        });
    } catch (error) {
        console.error('Add comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error adding comment',
            error: error.message
        });
    }
};

module.exports = addComment;