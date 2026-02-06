const mongoose = require('mongoose');

const connectDB = async () => {
    try {
<<<<<<< HEAD
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
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });

        return conn;
    } catch (error) {
<<<<<<< HEAD
        console.error(`
╔════════════════════════════════════════════════╗
║   ❌ MongoDB Connection Failed                ║
║   Error: ${error.message.substring(0, 35).padEnd(35)} ║
╚════════════════════════════════════════════════╝
        `);
        console.error('Full error:', error);
        process.exit(1);
=======
        console.error("❌ Error connecting to MongoDB:", error.message);
        throw error;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    }
};

module.exports = connectDB;