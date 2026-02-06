const jwt = require('jsonwebtoken');
const User = require('../models/User');
<<<<<<< HEAD
const Role = require('../models/Role');

const authenticated = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check for token in cookies
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. No token provided.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Get user's role and permissions
            const role = await Role.findOne({ name: user.role });
            
            req.user = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                permissions: role ? role.permissions : []
            };

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or expired'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
=======

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "No token provided",
            error: true
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({
                message: "User not found",
                error: true
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
            error: true
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        });
    }
};

<<<<<<< HEAD
module.exports = authenticated;
=======
module.exports = authenticateUser;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
