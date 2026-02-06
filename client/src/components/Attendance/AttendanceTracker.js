import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AttendanceTracker.css';

const AttendanceTracker = ({ employeeId }) => {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState('00:00:00');
    const [onBreak, setOnBreak] = useState(false);

    useEffect(() => {
        fetchTodayAttendance();
    }, []);

    useEffect(() => {
        let interval;
        if (attendance && attendance.checkIn && !attendance.checkOut) {
            interval = setInterval(() => {
                updateTimer();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [attendance]);

    const fetchTodayAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split('T')[0];
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/attendance/${employeeId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { startDate: today, endDate: today }
                }
            );
            
            if (response.data.data && response.data.data.length > 0) {
                setAttendance(response.data.data[0]);
                checkBreakStatus(response.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const checkBreakStatus = (attendanceData) => {
        if (attendanceData.breaks && attendanceData.breaks.length > 0) {
            const lastBreak = attendanceData.breaks[attendanceData.breaks.length - 1];
            setOnBreak(!lastBreak.endTime);
        }
    };

    const updateTimer = () => {
        if (!attendance || !attendance.checkIn) return;

        const now = new Date();
        const checkInTime = new Date(attendance.checkIn.time);
        let diff = now - checkInTime;

        // Subtract break time
        if (attendance.breaks) {
            attendance.breaks.forEach(breakItem => {
                if (breakItem.endTime) {
                    const breakDuration = new Date(breakItem.endTime) - new Date(breakItem.startTime);
                    diff -= breakDuration;
                } else {
                    // Current active break
                    const breakDuration = now - new Date(breakItem.startTime);
                    diff -= breakDuration;
                }
            });
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimer(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
    };

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/attendance/check-in/${employeeId}`,
                {
                    location: await getLocation(),
                    method: 'web'
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setAttendance(response.data.data);
            toast.success('✅ Checked in successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error checking in');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/attendance/check-out/${employeeId}`,
                {
                    location: await getLocation()
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setAttendance(response.data.data);
            toast.success('✅ Checked out successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error checking out');
        } finally {
            setLoading(false);
        }
    };

    const handleBreak = async (type) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/attendance/break/${employeeId}`,
                { type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setAttendance(response.data.data);
            setOnBreak(type === 'start');
            toast.success(type === 'start' ? '☕ Break started' : '✅ Break ended');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error managing break');
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(`${position.coords.latitude}, ${position.coords.longitude}`);
                    },
                    () => resolve('Unknown')
                );
            } else {
                resolve('Unknown');
            }
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const getTotalBreakTime = () => {
        if (!attendance || !attendance.breaks) return '0 min';
        
        let totalMs = 0;
        attendance.breaks.forEach(breakItem => {
            if (breakItem.duration) {
                totalMs += breakItem.duration * 60 * 1000;
            }
        });

        const minutes = Math.floor(totalMs / (1000 * 60));
        return `${minutes} min`;
    };

    return (
        <div className="attendance-tracker">
            <div className="tracker-header">
                <h2>
                    <i className="fa fa-clock"></i> Attendance Tracker
                </h2>
                <span className="tracker-date">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</span>
            </div>

            <div className="tracker-body">
                {!attendance || !attendance.checkIn ? (
                    <div className="check-in-section">
                        <div className="welcome-message">
                            <h3>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋</h3>
                            <p>Ready to start your day?</p>
                        </div>
                        <button
                            className="btn-check-in"
                            onClick={handleCheckIn}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    Checking In...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-sign-in-alt"></i>
                                    Check In
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="active-session">
                        <div className="timer-display">
                            <span className="timer-label">Work Time</span>
                            <span className="timer-value">{timer}</span>
                            {onBreak && <span className="break-badge">On Break</span>}
                        </div>

                        <div className="session-info">
                            <div className="info-item">
                                <i className="fa fa-sign-in-alt"></i>
                                <div>
                                    <span className="info-label">Check In</span>
                                    <span className="info-value">{formatTime(attendance.checkIn.time)}</span>
                                </div>
                            </div>

                            {attendance.checkOut && (
                                <div className="info-item">
                                    <i className="fa fa-sign-out-alt"></i>
                                    <div>
                                        <span className="info-label">Check Out</span>
                                        <span className="info-value">{formatTime(attendance.checkOut.time)}</span>
                                    </div>
                                </div>
                            )}

                            <div className="info-item">
                                <i className="fa fa-coffee"></i>
                                <div>
                                    <span className="info-label">Break Time</span>
                                    <span className="info-value">{getTotalBreakTime()}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <i className="fa fa-hourglass-half"></i>
                                <div>
                                    <span className="info-label">Work Hours</span>
                                    <span className="info-value">
                                        {attendance.workHours ? `${attendance.workHours.toFixed(2)} hrs` : '0 hrs'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!attendance.checkOut && (
                            <div className="action-buttons">
                                <button
                                    className={`btn-break ${onBreak ? 'active' : ''}`}
                                    onClick={() => handleBreak(onBreak ? 'end' : 'start')}
                                    disabled={loading}
                                >
                                    <i className={`fa fa-${onBreak ? 'play' : 'pause'}`}></i>
                                    {onBreak ? 'End Break' : 'Take Break'}
                                </button>

                                <button
                                    className="btn-check-out"
                                    onClick={handleCheckOut}
                                    disabled={loading || onBreak}
                                >
                                    <i className="fa fa-sign-out-alt"></i>
                                    Check Out
                                </button>
                            </div>
                        )}

                        {attendance.checkOut && (
                            <div className="session-complete">
                                <i className="fa fa-check-circle"></i>
                                <p>Session completed for today!</p>
                                {attendance.overtime > 0 && (
                                    <p className="overtime-badge">
                                        🎉 Overtime: {attendance.overtime.toFixed(2)} hours
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceTracker;