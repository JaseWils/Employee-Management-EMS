const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const userSockets = new Map(); // Map userId to socketId

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Authentication middleware for socket
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.userId}`);
        
        // Store user's socket connection
        userSockets.set(socket.userId, socket.id);

        // Join user to their personal room
        socket.join(`user_${socket.userId}`);

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.userId}`);
            userSockets.delete(socket.userId);
        });

        // Handle typing indicator for chat (future feature)
        socket.on('typing', (data) => {
            socket.to(data.room).emit('user_typing', {
                userId: socket.userId,
                isTyping: data.isTyping
            });
        });
    });

    return io;
};

// Send notification to specific user
const sendNotificationToUser = (userId, notification) => {
    if (io) {
        io.to(`user_${userId}`).emit('notification', notification);
    }
};

// Send notification to multiple users
const sendNotificationToUsers = (userIds, notification) => {
    if (io) {
        userIds.forEach(userId => {
            io.to(`user_${userId}`).emit('notification', notification);
        });
    }
};

// Broadcast to all connected users
const broadcastNotification = (notification) => {
    if (io) {
        io.emit('notification', notification);
    }
};

module.exports = {
    initializeSocket,
    sendNotificationToUser,
    sendNotificationToUsers,
    broadcastNotification,
    getIO: () => io
};