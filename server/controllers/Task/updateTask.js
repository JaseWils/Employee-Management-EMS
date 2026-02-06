const Task = require('../../models/Task');
const createNotification = require('../Notification/createNotification');

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Track status change
        const statusChanged = updates.status && updates.status !== task.status;
        const oldStatus = task.status;

        // If marking as completed, set completedAt
        if (updates.status === 'completed' && task.status !== 'completed') {
            updates.completedAt = new Date();
        }

        Object.assign(task, updates);
        await task.save();

        const populatedTask = await Task.findById(taskId)
            .populate('assignedTo', 'fullName email')
            .populate('assignedBy', 'name email')
            .populate('project', 'name');

        // Notify watchers about status change
        if (statusChanged) {
            const watchers = task.watchers.filter(w => w.toString() !== req.user.id);
            
            for (const watcher of watchers) {
                await createNotification({
                    recipient: watcher,
                    sender: req.user.id,
                    type: 'task_assigned',
                    title: 'Task Status Updated',
                    message: `Task "${task.title}" status changed from ${oldStatus} to ${updates.status}`,
                    data: { taskId: task._id },
                    actionUrl: `/tasks/${task._id}`
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: populatedTask
        });
    } catch (error) {
        console.error('Update task error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating task',
            error: error.message
        });
    }
};

module.exports = updateTask;