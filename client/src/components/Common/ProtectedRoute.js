import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userType = localStorage.getItem('userType');

    // Check token expiration
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = payload.exp * 1000;
                
                if (Date.now() >= expirationTime) {
                    localStorage.clear();
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Invalid token');
            }
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && !['admin', 'super_admin', 'hr_manager'].includes(user.role)) {
        toast.error('Access denied. Admin privileges required.');
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;