const Notification = require('../../models/Notification');
const { getIO } = require('../../socket/socketHandler');

const createNotification = async (data) => {
    try {
        const {
            recipient,
            sender,
            type,
            title,
            message,
            data: notifData,
            actionUrl,
            priority
        } = data;

        const notification = await Notification.create({
            recipient,
            sender,
            type,
            title,
            message,
            data: notifData,
            actionUrl,
            priority: priority || 'medium',
            isRead: false
        });

        // Emit real-time notification via Socket.IO
        const io = getIO();
        if (io) {
            io.to(`user_${recipient}`).emit('new_notification', notification);
        }

        return notification;

    } catch (error) {
        console.error('Create notification error:', error);
        throw error;
    }
};

module.exports = createNotification;