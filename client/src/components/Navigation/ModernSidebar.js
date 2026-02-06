import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './ModernSidebar.css';

const ModernSidebar = ({ isOpen, toggleSidebar }) => {
    const [user, setUser] = useState(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Get user from localStorage or context
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
    }, []);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: 'fa-home',
            path: '/',
            badge: null
        },
        {
            title: 'Employees',
            icon: 'fa-users',
            submenu: [
                { title: 'All Employees', path: '/employees', icon: 'fa-list' },
                { title: 'Add Employee', path: '/add-employee', icon: 'fa-user-plus' },
                { title: 'Departments', path: '/departments', icon: 'fa-building' }
            ]
        },
        {
            title: 'Attendance',
            icon: 'fa-clock',
            submenu: [
                { title: 'Check In/Out', path: '/attendance', icon: 'fa-fingerprint' },
                { title: 'View Records', path: '/attendance-records', icon: 'fa-calendar-check' },
                { title: 'Reports', path: '/attendance-reports', icon: 'fa-chart-bar' }
            ]
        },
        {
            title: 'Leave Management',
            icon: 'fa-calendar-times',
            badge: 5,
            submenu: [
                { title: 'Apply Leave', path: '/apply-leave', icon: 'fa-paper-plane' },
                { title: 'Leave Requests', path: '/leave-requests', icon: 'fa-inbox' },
                { title: 'Leave History', path: '/leave-history', icon: 'fa-history' }
            ]
        },
        {
            title: 'Payroll',
            icon: 'fa-money-bill-wave',
            submenu: [
                { title: 'Salary Management', path: '/salary', icon: 'fa-dollar-sign' },
                { title: 'Generate Payroll', path: '/generate-payroll', icon: 'fa-calculator' },
                { title: 'Payslips', path: '/payslips', icon: 'fa-file-invoice-dollar' }
            ]
        },
        {
            title: 'Tasks',
            icon: 'fa-tasks',
            path: '/tasks',
            badge: 3
        },
        {
            title: 'Documents',
            icon: 'fa-folder-open',
            submenu: [
                { title: 'All Documents', path: '/documents', icon: 'fa-file-alt' },
                { title: 'Upload Document', path: '/upload-document', icon: 'fa-upload' },
                { title: 'Verify Documents', path: '/verify-documents', icon: 'fa-check-double' }
            ]
        },
        {
            title: 'Performance',
            icon: 'fa-star',
            submenu: [
                { title: 'Reviews', path: '/performance-reviews', icon: 'fa-clipboard-check' },
                { title: 'Goals', path: '/goals', icon: 'fa-bullseye' },
                { title: 'Feedback', path: '/feedback', icon: 'fa-comments' }
            ]
        },
        {
            title: 'Analytics',
            icon: 'fa-chart-line',
            path: '/analytics'
        },
        {
            title: 'Settings',
            icon: 'fa-cog',
            submenu: [
                { title: 'Profile', path: '/profile', icon: 'fa-user-circle' },
                { title: 'Roles & Permissions', path: '/roles', icon: 'fa-shield-alt' },
                { title: 'System Settings', path: '/settings', icon: 'fa-sliders-h' }
            ]
        }
    ];

    const toggleSubmenu = (index) => {
        setActiveSubmenu(activeSubmenu === index ? null : index);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
            <aside className={`modern-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Sidebar Header */}
                <div className="sidebar-header">
                    <div className="logo-section">
                        <div className="logo-icon">
                            <i className="fa fa-building"></i>
                        </div>
                        <div className="logo-text">
                            <h3>EMS</h3>
                            <p>Management System</p>
                        </div>
                    </div>
                    <button className="sidebar-close" onClick={toggleSidebar}>
                        <i className="fa fa-times"></i>
                    </button>
                </div>

                {/* User Profile Card */}
                <div className="user-profile-card">
                    <div className="user-avatar">
                        <img 
                            src={user?.profileImage || 'https://ui-avatars.com/api/?name=Admin&background=667eea&color=fff'} 
                            alt="User" 
                        />
                        <span className="status-indicator online"></span>
                    </div>
                    <div className="user-info">
                        <h4>{user?.name || 'Admin User'}</h4>
                        <p>{user?.role || 'Administrator'}</p>
                    </div>
                    <div className="user-actions">
                        <button className="btn-icon" title="Settings">
                            <i className="fa fa-cog"></i>
                        </button>
                        <button className="btn-icon" onClick={handleLogout} title="Logout">
                            <i className="fa fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <div key={index} className="nav-item-wrapper">
                            {item.submenu ? (
                                <>
                                    <div 
                                        className={`nav-item has-submenu ${activeSubmenu === index ? 'active' : ''}`}
                                        onClick={() => toggleSubmenu(index)}
                                    >
                                        <div className="nav-link">
                                            <i className={`fa ${item.icon}`}></i>
                                            <span>{item.title}</span>
                                            {item.badge && <span className="nav-badge">{item.badge}</span>}
                                        </div>
                                        <i className={`fa fa-chevron-down submenu-arrow ${activeSubmenu === index ? 'rotated' : ''}`}></i>
                                    </div>
                                    <div className={`submenu ${activeSubmenu === index ? 'open' : ''}`}>
                                        {item.submenu.map((subItem, subIndex) => (
                                            <NavLink
                                                key={subIndex}
                                                to={subItem.path}
                                                className={({ isActive }) => `submenu-link ${isActive ? 'active' : ''}`}
                                            >
                                                <i className={`fa ${subItem.icon}`}></i>
                                                <span>{subItem.title}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="nav-link">
                                        <i className={`fa ${item.icon}`}></i>
                                        <span>{item.title}</span>
                                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                                    </div>
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Quick Actions Footer */}
                <div className="sidebar-footer">
                    <div className="quick-action-card">
                        <div className="qac-icon">
                            <i className="fa fa-rocket"></i>
                        </div>
                        <div className="qac-content">
                            <h5>Need Help?</h5>
                            <p>Check our documentation</p>
                        </div>
                        <button className="qac-btn">
                            <i className="fa fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default ModernSidebar;