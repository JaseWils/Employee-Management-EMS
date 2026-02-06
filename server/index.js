require('dotenv').config();
const express = require('express');
const app = express();
<<<<<<< HEAD
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./ConnectDB/db');
const router = require('./routes/routes');
const fileUpload = require('express-fileupload');
const { initializeSocket } = require('./socket/socketHandler');
const seedRoles = require('./helpers/seedRoles');

const PORT = process.env.PORT || 5800;

// Initialize Socket.IO
const io = initializeSocket(server);

// Cloudinary Configuration
const cloudinary = require('cloudinary').v2;
const isCloudinaryConfigured = 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_KEY !== 'your-cloudinary-api-key' &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-cloud-name';

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
} else {
    console.log('⚠️  Cloudinary not configured - image uploads will be disabled');
    console.log('   To enable: Sign up at https://cloudinary.com and update .env');
}

// Export for use in controllers
app.locals.cloudinaryConfigured = isCloudinaryConfigured;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('dev'));

// IMPORTANT: File upload middleware BEFORE body parser
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
=======
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
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
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
<<<<<<< HEAD
        version: "2.0.0",
        timestamp: new Date().toISOString()
=======
        version: "1.0.0",
        endpoints: {
            api: "/api/v1",
            health: "/health"
        }
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    });
});

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
<<<<<<< HEAD
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
=======
        timestamp: new Date().toISOString()
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    });
});

// API Routes
app.use('/api/v1', router);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
<<<<<<< HEAD
        message: "Route not found",
        path: req.path
=======
        message: "Route not found"
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
<<<<<<< HEAD
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            error: err 
        })
=======
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
    });
});

// Connect to Database and Start Server
connectDB()
<<<<<<< HEAD
    .then(async () => {
        // Seed roles on startup
        await seedRoles();
        
        server.listen(PORT, () => {
            const cloudinaryStatus = isCloudinaryConfigured ? '✅ Connected' : '⚠️  Not configured';
=======
    .then(() => {
        app.listen(PORT, () => {
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
            console.log(`
╔═══════════════════════════════════════════════╗
║   🚀 Employee Management System Server       ║
║   📡 Port: ${PORT}                           ║
<<<<<<< HEAD
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
║   📅 Started: ${new Date().toLocaleString()} ║
║   🔌 Socket.IO: ✅ Enabled                    ║
║   ☁️  Cloudinary: ${cloudinaryStatus.padEnd(25)}║
╚═══════════════════════════════════════════════╝

🔗 API: http://localhost:${PORT}
🔗 Health: http://localhost:${PORT}/health
=======
║   🌍 Environment: ${process.env.NODE_ENV}    ║
║   📅 Started: ${new Date().toLocaleString()} ║
╚═══════════════════════════════════════════════╝
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
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
<<<<<<< HEAD
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
=======
    process.exit(0);
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
});

module.exports = app;