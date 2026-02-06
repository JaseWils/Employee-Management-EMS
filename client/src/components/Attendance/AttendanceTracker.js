import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AttendanceTracker.css';

const AttendanceTracker = () => {
    const [loading, setLoading] = useState(false);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const employeeId = user.id || localStorage.getItem('employeeId');

    useEffect(() => {
        checkTodayAttendance();
        
        // Update clock every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const checkTodayAttendance = async () => {
        if (!employeeId) {
            console.log('No employee ID found');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/attendance/${employeeId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        date: new Date().toISOString().split('T')[0]
                    }
                }
            );

            if (response.data.success && response.data.data.length > 0) {
                setTodayAttendance(response.data.data[0]);
            }
        } catch (error) {
            console.error('Error checking attendance:', error);
        }
    };

    const handleCheckIn = async () => {
        if (!employeeId) {
            toast.error('Employee ID not found. Please login again.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/attendance/check-in/${employeeId}`,
                {
                    location: 'Office',
                    method: 'web'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('✅ Checked in successfully!');
                checkTodayAttendance();
            }
        } catch (error) {
            console.error('Check-in error:', error);
            toast.error(error.response?.data?.message || 'Error checking in');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        if (!employeeId) {
            toast.error('Employee ID not found. Please login again.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/attendance/check-out/${employeeId}`,
                {
                    location: 'Office'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('✅ Checked out successfully!');
                checkTodayAttendance();
            }
        } catch (error) {
            console.error('Check-out error:', error);
            toast.error(error.response?.data?.message || 'Error checking out');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (time) => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="attendance-tracker">
            <div className="attendance-header">
                <div className="header-icon">
                    <i className="fa fa-clock"></i>
                </div>
                <h1>Attendance Tracker</h1>
                <p className="date-time">{formatDate()}</p>
            </div>

            <div className="time-display">
                <div className="current-time">{formatTime()}</div>
                <p className="greeting">Good Morning! 👋</p>
                <p className="ready-text">Ready to start your day?</p>
            </div>

            {!employeeId ? (
                <div className="error-state">
                    <i className="fa fa-exclamation-triangle"></i>
                    <p>Employee ID not found. Please login again.</p>
                </div>
            ) : (
                <div className="attendance-actions">
                    {!todayAttendance || !todayAttendance.checkIn ? (
                        <button
                            className="btn-check-in"
                            onClick={handleCheckIn}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Checking in...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-sign-in-alt"></i>
                                    Check In
                                </>
                            )}
                        </button>
                    ) : !todayAttendance.checkOut ? (
                        <div className="checked-in-state">
                            <div className="status-card">
                                <i className="fa fa-check-circle"></i>
                                <h3>You're checked in!</h3>
                                <p>Check-in time: {new Date(todayAttendance.checkIn).toLocaleTimeString()}</p>
                            </div>
                            <button
                                className="btn-check-out"
                                onClick={handleCheckOut}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Checking out...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-sign-out-alt"></i>
                                        Check Out
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="checked-out-state">
                            <div className="status-card success">
                                <i className="fa fa-check-double"></i>
                                <h3>Day Complete!</h3>
                                <div className="time-summary">
                                    <div>
                                        <span>Check-in:</span>
                                        <strong>{new Date(todayAttendance.checkIn).toLocaleTimeString()}</strong>
                                    </div>
                                    <div>
                                        <span>Check-out:</span>
                                        <strong>{new Date(todayAttendance.checkOut).toLocaleTimeString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendanceTracker;