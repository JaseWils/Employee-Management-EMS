const responseTime = require('response-time');
const logger = require('../utils/logger');

const performanceMonitor = responseTime((req, res, time) => {
    if (req.url !== '/health') {
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            responseTime: `${time.toFixed(2)}ms`,
            userAgent: req.get('user-agent')
        });
    }

    // Alert on slow requests (>1000ms)
    if (time > 1000) {
        logger.warn({
            message: 'Slow request detected',
            method: req.method,
            url: req.url,
            responseTime: `${time.toFixed(2)}ms`
        });
    }
});

module.exports = performanceMonitor;