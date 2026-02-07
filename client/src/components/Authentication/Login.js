import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

    // Inline styles as fallback
    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        left: {
            flex: 1,
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'white',
        },
        right: {
            flex: 1,
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
        },
        formContainer: {
            width: '100%',
            maxWidth: '480px',
        },
        title: {
            margin: '0 0 16px 0',
            fontSize: '42px',
            fontWeight: 700,
        },
        subtitle: {
            margin: 0,
            fontSize: '18px',
            opacity: 0.9,
        },
        heading: {
            margin: '0 0 32px 0',
            fontSize: '32px',
            fontWeight: 700,
            color: '#1a202c',
            textAlign: 'center',
        },
        typeSelector: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '32px',
        },
        typeBtn: {
            padding: '16px',
            border: '2px solid #e2e8f0',
            background: 'white',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: '#4a5568',
            transition: 'all 0.3s',
        },
        typeBtnActive: {
            borderColor: '#667eea',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
        },
        label: {
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#4a5568',
        },
        input: {
            padding: '14px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '15px',
            transition: 'all 0.3s',
            outline: 'none',
        },
        btnShow: {
            marginTop: '8px',
            padding: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '13px',
        },
        btnLogin: {
            padding: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '8px',
        },
        footer: {
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
        },
        footerText: {
            margin: 0,
            color: '#718096',
            fontSize: '14px',
        },
        link: {
            color: '#667eea',
            fontWeight: 600,
            textDecoration: 'none',
        },
    };

    return (
        <div className="login-container" style={styles.container}>
            <div className="login-left" style={styles.left}>
                <div className="login-branding">
                    <h1 style={styles.title}>Employee Management System</h1>
                    <p style={styles.subtitle}>Streamline your workforce management</p>
                </div>
            </div>
            <div className="login-right" style={styles.right}>
                <div className="login-form-container" style={styles.formContainer}>
                    <h2 style={styles.heading}>Welcome Back!</h2>
                    <div className="user-type-selector" style={styles.typeSelector}>
                        <button 
                            type="button" 
                            className={`type-btn ${userType === 'employee' ? 'active' : ''}`}
                            style={{...styles.typeBtn, ...(userType === 'employee' ? styles.typeBtnActive : {})}}
                            onClick={() => setUserType('employee')}
                        >
                            Employee
                        </button>
                        <button 
                            type="button" 
                            className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
                            style={{...styles.typeBtn, ...(userType === 'admin' ? styles.typeBtnActive : {})}}
                            onClick={() => setUserType('admin')}
                        >
                            Admin
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="login-form" style={styles.form}>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="email" style={styles.label}>Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange}
                                style={styles.input}
                                required 
                            />
                        </div>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="password" style={styles.label}>Password</label>
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                id="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange}
                                style={styles.input}
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.btnShow}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <button 
                            type="submit" 
                            className="btn-login" 
                            disabled={loading}
                            style={styles.btnLogin}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="auth-footer" style={styles.footer}>
                        <p style={styles.footerText}>
                            Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
