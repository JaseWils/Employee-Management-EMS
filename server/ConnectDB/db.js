const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURL = process.env.MONGODB_URL;
        
        if (!dbURL) {
            throw new Error("MongoDB connection string is not defined in environment variables");
        }

        const conn = await mongoose.connect(dbURL);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        // Handle connection errors after initial connection
        mongoose.connection.on('error', err => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });

        return conn;
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        throw error;
    }
};

module.exports = connectDB;