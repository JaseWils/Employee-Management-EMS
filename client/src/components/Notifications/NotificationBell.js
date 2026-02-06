import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        fetchNotifications();

        if (socket) {
            socket.on('new_notification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });

            return () => {
                socket.off('new_notification');
            };
        }
    }, [socket]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/notifications?limit=10`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                const notifs = response.data.data || [];
                setNotifications(notifs);
                setUnreadCount(notifs.filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Demo notifications
            setNotifications([
                {
                    _id: '1',
                    title: 'Leave Approved',
                    message: 'Your leave request has been approved',
                    type: 'leave_approved',
                    isRead: false,
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    title: 'New Task Assigned',
                    message: 'You have been assigned a new task',
                    type: 'task',
                    isRead: false,
                    createdAt: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString()
                }
            ]);
            setUnreadCount(2);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/notifications/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // Update locally anyway
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/notifications/mark-all-read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            leave_approved: 'check-circle',
            leave_rejected: 'times-circle',
            task: 'tasks',
            document: 'file-alt',
            payroll: 'money-bill-wave',
            system: 'info-circle'
        };
        return icons[type] || 'bell';
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="notification-bell-container">
            <button 
                className="notification-bell-btn" 
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <i className="fa fa-bell"></i>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="notification-overlay" onClick={() => setShowDropdown(false)}></div>
                    <div className="notification-dropdown">
                        <div className="notification-header">
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                                <button className="mark-all-read" onClick={markAllAsRead}>
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="notification-list">
                            {notifications.length === 0 ? (
                                <div className="no-notifications">
                                    <i className="fa fa-bell-slash"></i>
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif._id}
                                        className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                                        onClick={() => markAsRead(notif._id)}
                                    >
                                        <div className={`notif-icon ${notif.type}`}>
                                            <i className={`fa fa-${getNotificationIcon(notif.type)}`}></i>
                                        </div>
                                        <div className="notif-content">
                                            <h4>{notif.title}</h4>
                                            <p>{notif.message}</p>
                                            <span className="notif-time">{getTimeAgo(notif.createdAt)}</span>
                                        </div>
                                        {!notif.isRead && <div className="unread-dot"></div>}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="notification-footer">
                            <button onClick={() => setShowDropdown(false)}>
                                View All Notifications
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
