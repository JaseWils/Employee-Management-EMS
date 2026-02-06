const Role = require('../models/Role');

const defaultRoles = [
    {
        name: 'super_admin',
        displayName: 'Super Administrator',
        description: 'Full system access with all permissions',
        permissions: [
            'employee.view', 'employee.create', 'employee.update', 'employee.delete',
            'department.view', 'department.create', 'department.update', 'department.delete',
            'leave.view', 'leave.create', 'leave.update', 'leave.delete', 'leave.approve',
            'salary.view', 'salary.create', 'salary.update', 'salary.delete',
            'attendance.view', 'attendance.create', 'attendance.update', 'attendance.delete',
            'performance.view', 'performance.create', 'performance.update', 'performance.delete',
            'document.view', 'document.create', 'document.update', 'document.delete',
            'task.view', 'task.create', 'task.update', 'task.delete',
            'admin.manage', 'settings.manage', 'reports.view'
        ]
    },
    {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Administrative access with most permissions',
        permissions: [
            'employee.view', 'employee.create', 'employee.update',
            'department.view', 'department.create', 'department.update',
            'leave.view', 'leave.approve',
            'salary.view', 'salary.create', 'salary.update',
            'attendance.view', 'attendance.create', 'attendance.update',
            'performance.view', 'performance.create', 'performance.update',
            'document.view', 'document.create',
            'task.view', 'task.create', 'task.update',
            'reports.view'
        ]
    },
    {
        name: 'hr_manager',
        displayName: 'HR Manager',
        description: 'Human Resources management access',
        permissions: [
            'employee.view', 'employee.create', 'employee.update',
            'department.view',
            'leave.view', 'leave.approve',
            'salary.view', 'salary.create', 'salary.update',
            'attendance.view',
            'performance.view', 'performance.create', 'performance.update',
            'document.view', 'document.create', 'document.update',
            'reports.view'
        ]
    },
    {
        name: 'manager',
        displayName: 'Manager',
        description: 'Team management access',
        permissions: [
            'employee.view',
            'department.view',
            'leave.view', 'leave.approve',
            'attendance.view',
            'performance.view', 'performance.create', 'performance.update',
            'task.view', 'task.create', 'task.update', 'task.delete'
        ]
    },
    {
        name: 'employee',
        displayName: 'Employee',
        description: 'Basic employee access',
        permissions: [
            'leave.view', 'leave.create',
            'attendance.view',
            'salary.view',
            'document.view',
            'task.view', 'task.update'
        ]
    }
];

const seedRoles = async () => {
    try {
        for (const roleData of defaultRoles) {
            await Role.findOneAndUpdate(
                { name: roleData.name },
                roleData,
                { upsert: true, new: true }
            );
        }
        console.log('✅ Roles seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding roles:', error);
    }
};

module.exports = seedRoles;