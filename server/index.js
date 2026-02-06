require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./ConnectDB/db');
const router = require('./routes/routes');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 5800;

// Cloudinary Configuration
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Employee Management System API is running",
        version: "1.0.0",
        endpoints: {
            api: "/api/v1",
            health: "/health"
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/v1', router);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Connect to Database and Start Server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════╗
║   🚀 Employee Management System Server       ║
║   📡 Port: ${PORT}                           ║
║   🌍 Environment: ${process.env.NODE_ENV}    ║
║   📅 Started: ${new Date().toLocaleString()} ║
╚═══════════════════════════════════════════════╝
            `);
        });
    })
    .catch(err => {
        console.error("❌ Failed to connect to database:", err.message);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});

module.exports = app;