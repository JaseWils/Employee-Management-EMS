import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('employee');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const emailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/email`, { email: formData.email });
            if (!emailResponse.data.success) {
                toast.error('Email not found');
                setLoading(false);
                return;
            }
            const passwordResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/password`, { email: formData.email, password: formData.password });
            if (passwordResponse.data.success) {
                const { token, user } = passwordResponse.data;
                if (userType === 'admin' && !['admin', 'super_admin', 'hr_manager'].includes(user.role)) {
                    toast.error('You do not have admin access');
                    setLoading(false);
                    return;
                }
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userType', userType);
                toast.success('Welcome back, ' + user.name + '!');
                setTimeout(() => navigate('/'), 1000);
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
                    <h1>Employee Management System</h1>
                    <p>Streamline your workforce management</p>
                </div>
            </div>
            <div className="login-right">
                <div className="login-form-container">
                    <h2>Welcome Back!</h2>
                    <div className="user-type-selector">
                        <button type="button" className={`type-btn ${userType === 'employee' ? 'active' : ''}`} onClick={() => setUserType('employee')}>Employee</button>
                        <button type="button" className={`type-btn ${userType === 'admin' ? 'active' : ''}`} onClick={() => setUserType('admin')}>Admin</button>
                    </div>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>Show</button>
                        </div>
                        <button type="submit" className="btn-login" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                    </form>
                    <p>Don't have an account? <a href="/signup">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
