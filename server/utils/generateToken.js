const jwt = require('jsonwebtoken');

const generateToken = (userId, isAdmin = false) => {
    return jwt.sign(
        { 
            id: userId,
            isAdmin: isAdmin 
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRE || '7d' 
        }
    );
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { generateToken, generateOTP };