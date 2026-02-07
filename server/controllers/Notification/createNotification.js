const Notification = require('../../models/Notification');
const { sendNotificationToUser } = require('../../socket/socketHandler');
const nodemailer = require('nodemailer');

const createNotification = async (notificationData) => {
    try {
        const notification = await Notification.create(notificationData);
        
        // Send real-time notification via Socket.IO
        sendNotificationToUser(notificationData.recipient, notification);

        // Optionally send email notification
        if (notificationData.sendEmail) {
            await sendEmailNotification(notification);
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

const sendEmailNotification = async (notification) => {
    // Email sending logic (use your existing nodemailer setup)
    // This is a placeholder - implement based on your email configuration
};

module.exports = createNotification;