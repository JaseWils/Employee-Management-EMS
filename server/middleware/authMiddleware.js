const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header or cookie
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                     req.cookies?.token ||
                     req.header('token');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY);
        
        // Add user info to request
        req.user = decoded;
        req.userId = decoded.id || decoded._id;
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            });
        }
        
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

const adminMiddleware = async (req, res, next) => {
    try {
        // Check if user exists and is admin
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const isAdmin = req.user.isAdmin || 
                       ['admin', 'super_admin', 'hr_manager'].includes(req.user.role);
        
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

module.exports = { authMiddleware, adminMiddleware };
