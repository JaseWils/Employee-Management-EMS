const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        const conn = await mongoose.connect(process.env.MONGODB_URL, options);

        console.log(`
╔════════════════════════════════════════════════╗
║   ✅ MongoDB Connected Successfully           ║
║   📡 Host: ${conn.connection.host.padEnd(30)} ║
║   🗄️  Database: ${conn.connection.name.padEnd(27)} ║
╚════════════════════════════════════════════════╝
        `);

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  Mongoose disconnected from MongoDB');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error(`
╔════════════════════════════════════════════════╗
║   ❌ MongoDB Connection Failed                ║
║   Error: ${error.message.substring(0, 35).padEnd(35)} ║
╚════════════════════════════════════════════════╝
        `);
        console.error('Full error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;