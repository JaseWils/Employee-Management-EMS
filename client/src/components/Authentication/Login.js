<<<<<<< HEAD
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
=======
import React from 'react'
import { NavLink } from "react-router-dom";
import './login.css'
const Login = () => {
  return (
    <div className='stylishBG d-flex justify-content-center align-items-center flex-column ' style={{height:'100vh'}}>
      <div className="form-container">
      <p className="title">Welcome back</p>
      <form className="form">
        <input type="email" className="input" placeholder="Email"/>
        <input type="password" className="input" placeholder="Password"/>
        <p className="page-link">
          <span className="page-link-label">Forgot Password?</span>
        </p>
        <button className="form-btn">Log in</button>
      </form>
      <p className="sign-up-label">
        Don't have an account?<NavLink to='/signup' className="sign-up-link">Sign up</NavLink>
      </p>
      <div className="buttons-container">
        <div className="apple-login-button">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" className="apple-icon" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z"></path>
          </svg>
          <span>Log in with Apple</span>
        </div>
        <div className="google-login-button">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" x="0px" y="0px" className="google-icon" viewBox="0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          <span>Log in with Google</span>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
