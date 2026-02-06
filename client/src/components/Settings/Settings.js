import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import './Settings.css';

const Settings = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        setFormData({
            ...formData,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || ''
        });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/v1/profile/update`,
                {
                    name: formData.name,
                    phone: formData.phone
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                const updatedUser = { ...user, name: formData.name, phone: formData.phone };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            toast.error('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/v1/password/change`,
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Password changed successfully!');
                setFormData({
                    ...formData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error changing password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1><i className="fa fa-cog"></i> Settings</h1>
                <p>Manage your account and preferences</p>
            </div>

            <div className="settings-layout">
                {/* Sidebar */}
                <div className="settings-sidebar">
                    <button
                        className={`setting-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="fa fa-user"></i>
                        Profile
                    </button>
                    <button
                        className={`setting-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <i className="fa fa-lock"></i>
                        Security
                    </button>
                    <button
                        className={`setting-tab ${activeTab === 'appearance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appearance')}
                    >
                        <i className="fa fa-palette"></i>
                        Appearance
                    </button>
                    <button
                        className={`setting-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <i className="fa fa-bell"></i>
                        Notifications
                    </button>
                </div>

                {/* Content */}
                <div className="settings-content">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="settings-panel">
                            <h2>Profile Information</h2>
                            <p className="panel-description">Update your personal information</p>

                            <form onSubmit={handleProfileUpdate} className="settings-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="disabled-input"
                                    />
                                    <small>Email cannot be changed</small>
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="settings-panel">
                            <h2>Change Password</h2>
                            <p className="panel-description">Ensure your account is secure</p>

                            <form onSubmit={handlePasswordChange} className="settings-form">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="Enter current password"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-save" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="settings-panel">
                            <h2>Appearance</h2>
                            <p className="panel-description">Customize how EMS looks</p>

                            <div className="appearance-options">
                                <div className="option-item">
                                    <div className="option-info">
                                        <h4><i className="fa fa-moon"></i> Dark Mode</h4>
                                        <p>Switch between light and dark theme</p>
                                    </div>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            id="dark-mode-toggle"
                                            checked={isDarkMode}
                                            onChange={toggleTheme}
                                        />
                                        <label htmlFor="dark-mode-toggle"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="settings-panel">
                            <h2>Notification Preferences</h2>
                            <p className="panel-description">Manage your notification settings</p>

                            <div className="notification-options">
                                <div className="option-item">
                                    <div className="option-info">
                                        <h4><i className="fa fa-envelope"></i> Email Notifications</h4>
                                        <p>Receive updates via email</p>
                                    </div>
                                    <div className="toggle-switch">
                                        <input type="checkbox" id="email-notif" defaultChecked />
                                        <label htmlFor="email-notif"></label>
                                    </div>
                                </div>

                                <div className="option-item">
                                    <div className="option-info">
                                        <h4><i className="fa fa-bell"></i> Push Notifications</h4>
                                        <p>Receive browser notifications</p>
                                    </div>
                                    <div className="toggle-switch">
                                        <input type="checkbox" id="push-notif" defaultChecked />
                                        <label htmlFor="push-notif"></label>
                                    </div>
                                </div>

                                <div className="option-item">
                                    <div className="option-info">
                                        <h4><i className="fa fa-calendar"></i> Leave Updates</h4>
                                        <p>Get notified about leave requests</p>
                                    </div>
                                    <div className="toggle-switch">
                                        <input type="checkbox" id="leave-notif" defaultChecked />
                                        <label htmlFor="leave-notif"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;