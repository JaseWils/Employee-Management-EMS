const Notification = require('../../models/Notification');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10, page = 1 } = req.query;

        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        return res.status(200).json({
            success: true,
            data: notifications,
            unreadCount
        });

    } catch (error) {
        console.error('Get notifications error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

module.exports = getNotifications;