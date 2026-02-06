import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AttendanceRecords.css';

const AttendanceRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        status: 'all'
    });

    useEffect(() => {
        fetchRecords();
    }, [filters]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/attendance/${user.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        startDate: filters.startDate,
                        endDate: filters.endDate
                    }
                }
            );

            if (response.data.success) {
                let data = response.data.data || [];
                if (filters.status !== 'all') {
                    data = data.filter(r => r.status === filters.status);
                }
                setRecords(data);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
            // Demo data
            setRecords([
                {
                    _id: '1',
                    date: new Date().toISOString(),
                    checkIn: new Date(new Date().setHours(9, 0, 0)).toISOString(),
                    checkOut: new Date(new Date().setHours(17, 30, 0)).toISOString(),
                    status: 'present',
                    workHours: 8.5,
                    location: 'Office'
                },
                {
                    _id: '2',
                    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
                    checkIn: new Date(new Date().setHours(9, 15, 0)).toISOString(),
                    checkOut: new Date(new Date().setHours(17, 0, 0)).toISOString(),
                    status: 'late',
                    workHours: 7.75,
                    location: 'Office'
                },
                {
                    _id: '3',
                    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
                    checkIn: new Date(new Date().setHours(9, 0, 0)).toISOString(),
                    checkOut: new Date(new Date().setHours(13, 0, 0)).toISOString(),
                    status: 'half-day',
                    workHours: 4,
                    location: 'Office'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const totalDays = records.length;
        const presentDays = records.filter(r => r.status === 'present').length;
        const lateDays = records.filter(r => r.status === 'late').length;
        const halfDays = records.filter(r => r.status === 'half-day').length;
        const totalHours = records.reduce((sum, r) => sum + (r.workHours || 0), 0);

        return { totalDays, presentDays, lateDays, halfDays, totalHours };
    };

    const stats = calculateStats();

    const getStatusBadge = (status) => {
        const badges = {
            present: { class: 'status-present', text: 'Present', icon: 'check-circle' },
            late: { class: 'status-late', text: 'Late', icon: 'clock' },
            'half-day': { class: 'status-halfday', text: 'Half Day', icon: 'adjust' },
            absent: { class: 'status-absent', text: 'Absent', icon: 'times-circle' }
        };

        const badge = badges[status] || badges.present;

        return (
            <span className={`status-badge ${badge.class}`}>
                <i className={`fa fa-${badge.icon}`}></i>
                {badge.text}
            </span>
        );
    };

    return (
        <div className="attendance-records-container">
            <div className="records-header">
                <div>
                    <h1><i className="fa fa-calendar-check"></i> Attendance Records</h1>
                    <p>View your attendance history</p>
                </div>
                <button className="btn-export" onClick={() => toast.success('Export feature coming soon!')}>
                    <i className="fa fa-download"></i>
                    Export
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon">
                        <i className="fa fa-calendar-alt"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalDays}</h3>
                        <p>Total Days</p>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon">
                        <i className="fa fa-check-circle"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.presentDays}</h3>
                        <p>Present</p>
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-icon">
                        <i className="fa fa-clock"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.lateDays}</h3>
                        <p>Late Arrivals</p>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon">
                        <i className="fa fa-hourglass-half"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalHours.toFixed(1)}</h3>
                        <p>Total Hours</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>Start Date</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                </div>
                <div className="filter-group">
                    <label>Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Status</option>
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="half-day">Half Day</option>
                        <option value="absent">Absent</option>
                    </select>
                </div>
            </div>

            {/* Records Table */}
            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading records...</p>
                </div>
            ) : records.length === 0 ? (
                <div className="empty-state">
                    <i className="fa fa-calendar-times"></i>
                    <h3>No Records Found</h3>
                    <p>No attendance records for the selected period</p>
                </div>
            ) : (
                <div className="records-table-wrapper">
                    <table className="records-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Work Hours</th>
                                <th>Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record._id}>
                                    <td>
                                        <div className="date-cell">
                                            <i className="fa fa-calendar"></i>
                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="time-badge">
                                            <i className="fa fa-sign-in-alt"></i>
                                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="time-badge">
                                            <i className="fa fa-sign-out-alt"></i>
                                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <strong>{record.workHours ? `${record.workHours.toFixed(1)}h` : '-'}</strong>
                                    </td>
                                    <td>
                                        <span className="location-badge">
                                            <i className="fa fa-map-marker-alt"></i>
                                            {record.location || 'N/A'}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(record.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendanceRecords;