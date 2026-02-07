const request = require('supertest');
const app = require('../index');
const User = require('../models/User');

describe('Authentication Tests', () => {
    describe('POST /api/v1/register', () => {
        it('should register a new user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!',
                role: 'employee'
            };

            const response = await request(app)
                .post('/api/v1/register')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(userData.email);
        });

        it('should not register user with existing email', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!',
                role: 'employee'
            };

            await User.create(userData);

            const response = await request(app)
                .post('/api/v1/register')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/password', () => {
        it('should login with valid credentials', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!',
                role: 'employee'
            };

            await request(app)
                .post('/api/v1/register')
                .send(userData);

            const response = await request(app)
                .post('/api/v1/password')
                .send({
                    email: userData.email,
                    password: userData.password
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });

        it('should not login with invalid password', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!',
                role: 'employee'
            };

            await request(app)
                .post('/api/v1/register')
                .send(userData);

            const response = await request(app)
                .post('/api/v1/password')
                .send({
                    email: userData.email,
                    password: 'WrongPassword'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });
});