const connectDB = require('../ConnectDB/db');
const seedRoles = require('./seedRoles');
const User = require('../models/User');
const Department = require('../models/Department');
const Staff = require('../models/Staff');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🌱 Seeding database...');

        // Seed roles
        await seedRoles();

        // Create default admin user
        const adminExists = await User.findOne({ email: 'admin@ems.com' });
        if (!adminExists) {
            await User.create({
                name: 'Super Admin',
                email: 'admin@ems.com',
                password: 'admin123',
                role: 'super_admin',
                isEmailVerified: true
            });
            console.log('✅ Admin user created (admin@ems.com / admin123)');
        }

        // Create default employee user
        const employeeExists = await User.findOne({ email: 'employee@ems.com' });
        if (!employeeExists) {
            const employeeUser = await User.create({
                name: 'John Employee',
                email: 'employee@ems.com',
                password: 'employee123',
                role: 'employee',
                isEmailVerified: true
            });

            // Create corresponding staff record
            const itDept = await Department.findOne({ name: 'IT' });
            await Staff.create({
                user: employeeUser._id,
                employeeId: 'EMP001',
                name: 'John Employee',
                email: 'employee@ems.com',
                department: itDept?._id,
                designation: 'Software Developer',
                joiningDate: new Date(),
                phone: '1234567890'
            });
            console.log('✅ Employee user created (employee@ems.com / employee123)');
        }

        // Create default departments
        const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
        for (const dept of departments) {
            const exists = await Department.findOne({ name: dept });
            if (!exists) {
                await Department.create({ name: dept, description: `${dept} Department` });
            }
        }
        console.log('✅ Departments created');

        console.log('🎉 Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();