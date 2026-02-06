const Task = require('../../models/Task');

const getTasks = async (req, res) => {
    try {
        const {
            assignedTo,
            project,
            status,
            priority,
            dueDate,
            search,
            page = 1,
            limit = 20,
            sortBy = 'dueDate',
            sortOrder = 'asc'
        } = req.query;

        let query = {};

        if (assignedTo) query.assignedTo = assignedTo;
        if (project) query.project = project;
        if (status) query.status = status;
        if (priority) query.priority = priority;

        if (dueDate) {
            const date = new Date(dueDate);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            query.dueDate = { $gte: date, $lt: nextDay };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const tasks = await Task.find(query)
            .populate('assignedTo', 'fullName email department')
            .populate('assignedBy', 'name email')
            .populate('project', 'name status')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Task.countDocuments(query);

        // Get task statistics
        const stats = await Task.aggregate([
            { $match: assignedTo ? { assignedTo: mongoose.Types.ObjectId(assignedTo) } : {} },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statsObj = stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            message: 'Tasks retrieved successfully',
            data: tasks,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            },
            stats: statsObj
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving tasks',
            error: error.message
        });
    }
};

module.exports = getTasks;