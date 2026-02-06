import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('employee'); // 'employee' or 'admin'
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Step 1: Check email
            const emailResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/email`,
                { email: formData.email }
            );

            if (!emailResponse.data.success) {
                toast.error('Email not found');
                setLoading(false);
                return;
            }

            // Step 2: Verify password
            const passwordResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/password`,
                {
                    email: formData.email,
                    password: formData.password
                }
            );

            if (passwordResponse.data.success) {
                const { token, user } = passwordResponse.data;

                // Check if user type matches
                if (userType === 'admin' && !['admin', 'super_admin', 'hr_manager'].includes(user.role)) {
                    toast.error('You do not have admin access');
                    setLoading(false);
                    return;
                }

                if (userType === 'employee' && ['admin', 'super_admin'].includes(user.role)) {
                    toast.error('Please use admin login');
                    setLoading(false);
                    return;
                }

                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userType', userType);

                toast.success(`Welcome back, ${user.name}! 🎉`);

                // Redirect based on user type
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-branding">
                    <div className="brand-logo">
                        <i className="fa fa-building"></i>
                    </div>
                    <h1>Employee Management System</h1>
                    <p>Streamline your workforce management with our modern EMS platform</p>
                </div>

                <div className="features-list">
                    <div className="feature-item">
                        <i className="fa fa-check-circle"></i>
                        <span>Real-time attendance tracking</span>
                    </div>
                    <div className="feature-item">
                        <i className="fa fa-check-circle"></i>
                        <span>Automated payroll processing</span>
                    </div>
                    <div className="feature-item">
                        <i className="fa fa-check-circle"></i>
                        <span>Performance analytics</span>
                    </div>
                    <div className="feature-item">
                        <i className="fa fa-check-circle"></i>
                        <span>Document management</span>
                    </div>
                </div>

                <div className="testimonial">
                    <p>"This EMS has transformed how we manage our team. Highly recommended!"</p>
                    <div className="testimonial-author">
                        <strong>Sarah Johnson</strong>
                        <span>HR Manager, Tech Corp</span>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="login-form-container">
                    <div className="login-header">
                        <h2>Welcome Back! 👋</h2>
                        <p>Sign in to continue to your account</p>
                    </div>

                    {/* User Type Selection */}
                    <div className="user-type-selector">
                        <button
                            type="button"
                            className={`type-btn ${userType === 'employee' ? 'active' : ''}`}
                            onClick={() => setUserType('employee')}
                        >
                            <i className="fa fa-user"></i>
                            <span>Employee</span>
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
                            onClick={() => setUserType('admin')}
                        >
                            <i className="fa fa-user-shield"></i>
                            <span>Admin</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">
                                <i className="fa fa-envelope"></i> Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <i className="fa fa-lock"></i> Password
                            </label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fa fa-eye${showPassword ? '-slash' : ''}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="/forgot-password" className="forgot-password">
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="login-spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-sign-in-alt"></i>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <a href="/signup">Sign up</a></p>
                    </div>

                    {/* Quick Demo Login */}
                    <div className="demo-login">
                        <p>Quick Demo Login:</p>
                        <div className="demo-credentials">
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({ email: 'admin@ems.com', password: 'admin123' });
                                    setUserType('admin');
                                }}
                            >
                                Admin Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({ email: 'employee@ems.com', password: 'employee123' });
                                    setUserType('employee');
                                }}
                            >
                                Employee Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;