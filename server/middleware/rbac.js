const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            // User should be attached by authentication middleware
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Super admin has all permissions
            if (req.user.role === 'super_admin') {
                return next();
            }

            // Check if user has the required permissions
            const userPermissions = req.user.permissions || [];
            const hasPermission = requiredPermissions.some(permission => 
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to perform this action',
                    requiredPermissions
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error checking permissions',
                error: error.message
            });
        }
    };
};

const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Insufficient role privileges.',
                    allowedRoles,
                    userRole: req.user.role
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error checking role',
                error: error.message
            });
        }
    };
};

module.exports = { checkPermission, checkRole };