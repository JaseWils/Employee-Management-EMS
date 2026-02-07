const request = require('supertest');
const app = require('../index');
const User = require('../models/User');

describe('Signup Controller Tests', () => {
    describe('POST /api/v1/signup', () => {
        it('should create a new user account with valid data', async () => {
            const userData = {
                name: 'New Signup User',
                email: 'signup@example.com',
                password: 'Password123!',
                role: 'employee'
            };

            const response = await request(app)
                .post('/api/v1/signup')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Account created successfully');
            expect(response.body.token).toBeDefined();
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.name).toBe(userData.name);
            expect(response.body.user.role).toBe(userData.role);
        });

        it('should not create user with existing email', async () => {
            const userData = {
                name: 'Existing User',
                email: 'existing@example.com',
                password: 'Password123!',
                role: 'employee'
            };

            // First create a user
            await User.create(userData);

            // Try to create another user with same email
            const response = await request(app)
                .post('/api/v1/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User with this email already exists');
        });

        it('should return error for missing required fields', async () => {
            const userData = {
                email: 'incomplete@example.com'
                // Missing name and password
            };

            const response = await request(app)
                .post('/api/v1/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Please provide all required fields');
        });

        it('should default to employee role if not specified', async () => {
            const userData = {
                name: 'Default Role User',
                email: 'defaultrole@example.com',
                password: 'Password123!'
                // No role specified
            };

            const response = await request(app)
                .post('/api/v1/signup')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.user.role).toBe('employee');
        });

        it('should accept admin role when specified', async () => {
            const userData = {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'Password123!',
                role: 'admin'
            };

            const response = await request(app)
                .post('/api/v1/signup')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.user.role).toBe('admin');
        });
    });
});
