const Task = require('../../models/Task');

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        console.error('Delete task error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
};

module.exports = deleteTask;