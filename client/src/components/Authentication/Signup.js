import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
        agreeToTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateEmail = (email) => {
        // Use a more permissive email regex that handles modern email formats
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const getPasswordStrength = (password) => {
        if (password.length < 6) return { strength: 'weak', color: '#f56565' };
        if (password.length < 10) return { strength: 'medium', color: '#ecc94b' };
        if (password.length >= 10 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return { strength: 'strong', color: '#48bb78' };
        }
        return { strength: 'medium', color: '#ecc94b' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please provide all required fields');
            return;
        }

        if (!validateEmail(formData.email)) {
            toast.error('Please provide a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!formData.agreeToTerms) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/signup`,
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                }
            );

            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                toast.success('Account created successfully!');
                setTimeout(() => navigate('/'), 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating account');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="signup-container">
            <div className="signup-left">
                <div className="signup-branding">
                    <div className="brand-logo">
                        <i className="fa fa-building"></i>
                    </div>
                    <h1>Join Our Platform</h1>
                    <p>Create your account and start managing your workforce efficiently</p>
                </div>

                <div className="features-list">
                    <div className="feature-item">
                        <i className="fa fa-check-circle"></i>
                        <span>Easy employee management</span>
                    </div>
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
                </div>
            </div>

            <div className="signup-right">
                <div className="signup-form-container">
                    <div className="signup-header">
                        <h2>Create Account</h2>
                        <p>Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-group">
                            <label htmlFor="name">
                                <i className="fa fa-user"></i> Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

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
                                    placeholder="Min 6 characters"
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
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        <div
                                            className="strength-fill"
                                            style={{
                                                width: passwordStrength.strength === 'weak' ? '33%' :
                                                       passwordStrength.strength === 'medium' ? '66%' : '100%',
                                                backgroundColor: passwordStrength.color
                                            }}
                                        ></div>
                                    </div>
                                    <span style={{ color: passwordStrength.color, fontSize: '12px' }}>
                                        {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                <i className="fa fa-lock"></i> Confirm Password
                            </label>
                            <div className="password-input">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <i className={`fa fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">
                                <i className="fa fa-user-tag"></i> Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="form-group-checkbox">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="agreeToTerms">
                                I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
                            </label>
                        </div>

                        <button type="submit" className="btn-signup" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="signup-spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-user-plus"></i>
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
