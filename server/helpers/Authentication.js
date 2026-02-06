const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
        });
    }
};

module.exports = authenticateUser;
