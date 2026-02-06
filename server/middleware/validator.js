const { body, param, query, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    };
};

// Validation rules
const validators = {
    register: [
        body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password')
            .isLength({ min: 8 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/)
            .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
        body('role').isIn(['employee', 'manager', 'hr_manager', 'admin']).withMessage('Invalid role')
    ],

    login: [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],

    addStaff: [
        body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name is required'),
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
        body('department').isMongoId().withMessage('Invalid department ID'),
        body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
        body('joiningDate').optional().isISO8601().withMessage('Invalid date format')
    ],

    createTask: [
        body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
        body('assignedTo').isMongoId().withMessage('Invalid employee ID'),
        body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
        body('dueDate').optional().isISO8601().withMessage('Invalid date format')
    ],

    uploadDocument: [
        body('title').trim().isLength({ min: 2, max: 100 }).withMessage('Title is required'),
        body('documentType').isIn([
            'contract', 'id_proof', 'address_proof', 'educational_certificate',
            'experience_letter', 'medical_certificate', 'tax_document', 'nda',
            'offer_letter', 'resignation', 'other'
        ]).withMessage('Invalid document type'),
        body('employeeId').isMongoId().withMessage('Invalid employee ID')
    ]
};

module.exports = { validate, validators };