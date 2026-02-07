const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['super_admin', 'admin', 'hr_manager', 'manager', 'employee']
    },
    displayName: {
        type: String,
        required: true
    },
    permissions: [{
        type: String,
        enum: [
            // Employee permissions
            'employee.view', 'employee.create', 'employee.update', 'employee.delete',
            // Department permissions
            'department.view', 'department.create', 'department.update', 'department.delete',
            // Leave permissions
            'leave.view', 'leave.create', 'leave.update', 'leave.delete', 'leave.approve',
            // Salary permissions
            'salary.view', 'salary.create', 'salary.update', 'salary.delete',
            // Attendance permissions
            'attendance.view', 'attendance.create', 'attendance.update', 'attendance.delete',
            // Performance permissions
            'performance.view', 'performance.create', 'performance.update', 'performance.delete',
            // Document permissions
            'document.view', 'document.create', 'document.update', 'document.delete',
            // Task permissions
            'task.view', 'task.create', 'task.update', 'task.delete',
            // Admin permissions
            'admin.manage', 'settings.manage', 'reports.view'
        ]
    }],
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);