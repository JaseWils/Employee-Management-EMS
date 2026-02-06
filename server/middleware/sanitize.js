const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const sanitizeMiddleware = (app) => {
    // Prevent MongoDB injection
    app.use(mongoSanitize());

    // Prevent XSS attacks
    app.use(xss());

    // Custom sanitization for specific fields
    app.use((req, res, next) => {
        if (req.body) {
            Object.keys(req.body).forEach(key => {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = req.body[key].trim();
                }
            });
        }
        next();
    });
};

module.exports = sanitizeMiddleware;