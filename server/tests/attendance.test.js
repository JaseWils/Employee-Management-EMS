const request = require('supertest');
const app = require('../index');
const Staff = require('../models/Staff');
const Attendance = require('../models/Attendance');

describe('Attendance Tests', () => {
    let authToken;
    let employeeId;

    beforeEach(async () => {
        // Create test user and get token
        const userResponse = await request(app)
            .post('/api/v1/register')
            .send({
                name: 'Test Employee',
                email: 'employee@test.com',
                password: 'Password123!',
                role: 'employee'
            });

        authToken = userResponse.body.token;

        // Create test employee
        const employee = await Staff.create({
            fullName: 'John Doe',
            email: 'john@test.com',
            employeeId: 'EMP001',
            department: 'IT',
            isActive: true
        });

        employeeId = employee._id;
    });

    describe('POST /api/v1/attendance/check-in/:employeeId', () => {
        it('should check in employee successfully', async () => {
            const response = await request(app)
                .post(`/api/v1/attendance/check-in/${employeeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    location: 'Office',
                    method: 'web'
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.employee).toBe(employeeId.toString());
        });

        it('should not allow duplicate check-in', async () => {
            await request(app)
                .post(`/api/v1/attendance/check-in/${employeeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ location: 'Office' });

            const response = await request(app)
                .post(`/api/v1/attendance/check-in/${employeeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ location: 'Office' })
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/attendance/check-out/:employeeId', () => {
        it('should check out employee successfully', async () => {
            await request(app)
                .post(`/api/v1/attendance/check-in/${employeeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ location: 'Office' });

            const response = await request(app)
                .post(`/api/v1/attendance/check-out/${employeeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ location: 'Office' })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.checkOut).toBeDefined();
        });
    });
});