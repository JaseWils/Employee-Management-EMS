import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5800/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/email', data).then(() => api.post('/password', data)),
    verifyOTP: (data) => api.post('/verify-otp', data),
    resendOTP: (data) => api.post('/resend-otp', data),
    logout: () => api.post('/logout')
};

// Staff APIs
export const staffAPI = {
    getAll: () => api.get('/get-staffs'),
    getById: (id) => api.get(`/get-staffs/${id}`),
    create: (data) => api.post('/add-staff', data),
    update: (id, data) => api.patch(`/edit-staffs/${id}`, data),
    delete: (id) => api.delete(`/delete-staffs/${id}`)
};

// Department APIs
export const departmentAPI = {
    getAll: () => api.get('/get-dept'),
    getById: (id) => api.get(`/get-dept/${id}`),
    create: (data) => api.post('/add-dept', data),
    update: (id, data) => api.patch(`/edit-dept/${id}`, data),
    delete: (id) => api.delete(`/delete-dept/${id}`)
};

// Leave APIs
export const leaveAPI = {
    getAll: () => api.get('/get-leaves'),
    getByEmployeeId: (id) => api.get(`/get-leave/${id}`),
    apply: (data) => api.post('/apply-leave', data),
    update: (id, data) => api.patch(`/edit-leave/${id}`, data),
    delete: (id) => api.delete(`/delete-leave/${id}`),
    approve: (id) => api.patch(`/approve-leave/${id}`),
    reject: (id, data) => api.patch(`/reject-leave/${id}`, data)
};

// Salary APIs
export const salaryAPI = {
    getAll: () => api.get('/get-salaries'),
    getByEmployeeId: (id) => api.get(`/get-salary/${id}`),
    create: (data) => api.post('/add-salary', data),
    update: (id, data) => api.patch(`/edit-salary/${id}`, data),
    delete: (id) => api.delete(`/delete-salary/${id}`)
};

// Admin APIs
export const adminAPI = {
    getAll: () => api.get('/admins'),
    update: (id, data) => api.put(`/admins/${id}`, data),
    delete: (id) => api.delete(`/admins/${id}`)
};

export default api;