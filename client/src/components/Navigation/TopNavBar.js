import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../Notifications/NotificationBell';
import DarkModeToggle from '../Common/DarkModeToggle';
import toast from 'react-hot-toast';
import './TopNavBar.css';

const TopNavBar = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // Clear all stored data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            
            toast.success('Logged out successfully! 👋');
            
            // Redirect to login
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
    };

    return (
        <nav className="top-navbar">
            <div className="topnav-left">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    <i className="fa fa-bars"></i>
                </button>

                <div className={`search-bar ${showSearch ? 'active' : ''}`}>
                    <form onSubmit={handleSearch}>
                        <i className="fa fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search employees, tasks, documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <kbd className="keyboard-shortcut">Ctrl K</kbd>
                    </form>
                </div>
            </div>

            <div className="topnav-right">
                <button className="topnav-icon mobile-search" onClick={() => setShowSearch(!showSearch)}>
                    <i className="fa fa-search"></i>
                </button>

                <DarkModeToggle />

                <button className="topnav-icon">
                    <i className="fa fa-th"></i>
                </button>

                <button className="topnav-icon">
                    <i className="fa fa-envelope"></i>
                    <span className="icon-badge">3</span>
                </button>

                <NotificationBell />

                <div className="user-menu" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
                    <button className="user-menu-trigger">
                        <img
                            src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=667eea&color=fff`}
                            alt="User"
                        />
                        <span className="user-name">{user.name || 'User'}</span>
                        <i className="fa fa-chevron-down"></i>
                    </button>
                    
                    <div className={`user-dropdown ${showUserMenu ? 'show' : ''}`}>
                        <div className="user-dropdown-header">
                            <img
                                src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=667eea&color=fff`}
                                alt="User"
                            />
                            <div>
                                <strong>{user.name || 'User'}</strong>
                                <span>{user.email || 'user@example.com'}</span>
                            </div>
                        </div>
                        <hr />
                        <a href="/profile"><i className="fa fa-user"></i> My Profile</a>
                        <a href="/settings"><i className="fa fa-cog"></i> Settings</a>
                        <a href="/help"><i className="fa fa-question-circle"></i> Help Center</a>
                        <a href="/privacy"><i className="fa fa-shield-alt"></i> Privacy</a>
                        <hr />
                        <button onClick={handleLogout} className="logout-btn">
                            <i className="fa fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavBar;