const Task = require('../../models/Task');

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const task = await Task.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        )
        .populate('assignedTo', 'fullName email')
        .populate('createdBy', 'name email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task
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