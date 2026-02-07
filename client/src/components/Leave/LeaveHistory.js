import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './LeaveHistory.css';

const LeaveHistory = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchLeaveHistory();
    }, []);

    const fetchLeaveHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/leave/employee/${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setLeaves(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching leave history:', error);
            // Demo data
            setLeaves([
                {
                    _id: '1',
                    leaveType: 'sick',
                    startDate: new Date().toISOString(),
                    endDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
                    reason: 'Medical checkup',
                    status: 'approved',
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    leaveType: 'annual',
                    startDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
                    endDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
                    reason: 'Family vacation',
                    status: 'approved',
                    approvedBy: { name: 'HR Manager' },
                    createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString()
                },
                {
                    _id: '3',
                    leaveType: 'casual',
                    startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
                    endDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
                    reason: 'Personal work',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeaves = filter === 'all' 
        ? leaves 
        : leaves.filter(l => l.status === filter);

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'status-pending', icon: 'clock', text: 'Pending' },
            approved: { class: 'status-approved', icon: 'check-circle', text: 'Approved' },
            rejected: { class: 'status-rejected', icon: 'times-circle', text: 'Rejected' }
        };

        const badge = badges[status] || badges.pending;

        return (
            <span className={`status-badge ${badge.class}`}>
                <i className={`fa fa-${badge.icon}`}></i>
                {badge.text}
            </span>
        );
    };

    const getLeaveTypeIcon = (type) => {
        const icons = {
            sick: '🏥',
            casual: '☕',
            annual: '🏖️',
            maternity: '👶',
            paternity: '👨‍👧',
            unpaid: '📅'
        };
        return icons[type] || '📅';
    };

    const calculateDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const getLeaveStats = () => {
        return {
            total: leaves.length,
            approved: leaves.filter(l => l.status === 'approved').length,
            pending: leaves.filter(l => l.status === 'pending').length,
            rejected: leaves.filter(l => l.status === 'rejected').length
        };
    };

    const stats = getLeaveStats();

    return (
        <div className="leave-history-container">
            <div className="history-header">
                <div>
                    <h1><i className="fa fa-history"></i> Leave History</h1>
                    <p>View all your leave applications</p>
                </div>
            </div>

            {/* Stats */}
            <div className="leave-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <i className="fa fa-clipboard-list"></i>
                    </div>
                    <div>
                        <h3>{stats.total}</h3>
                        <p>Total Applications</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">
                        <i className="fa fa-check-circle"></i>
                    </div>
                    <div>
                        <h3>{stats.approved}</h3>
                        <p>Approved</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">
                        <i className="fa fa-clock"></i>
                    </div>
                    <div>
                        <h3>{stats.pending}</h3>
                        <p>Pending</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon red">
                        <i className="fa fa-times-circle"></i>
                    </div>
                    <div>
                        <h3>{stats.rejected}</h3>
                        <p>Rejected</p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="filter-tabs">
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                    All ({stats.total})
                </button>
                <button className={filter === 'approved' ? 'active' : ''} onClick={() => setFilter('approved')}>
                    Approved ({stats.approved})
                </button>
                <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>
                    Pending ({stats.pending})
                </button>
                <button className={filter === 'rejected' ? 'active' : ''} onClick={() => setFilter('rejected')}>
                    Rejected ({stats.rejected})
                </button>
            </div>

            {/* Leave List */}
            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading leave history...</p>
                </div>
            ) : filteredLeaves.length === 0 ? (
                <div className="empty-state">
                    <i className="fa fa-calendar-times"></i>
                    <h3>No Leave Records</h3>
                    <p>No {filter !== 'all' ? filter : ''} leave applications found</p>
                </div>
            ) : (
                <div className="leave-timeline">
                    {filteredLeaves.map(leave => (
                        <div key={leave._id} className="timeline-item">
                            <div className="timeline-marker">
                                <span className="marker-icon">{getLeaveTypeIcon(leave.leaveType)}</span>
                            </div>
                            <div className="timeline-content">
                                <div className="leave-card-header">
                                    <div>
                                        <h4>{leave.leaveType?.toUpperCase()} Leave</h4>
                                        <p className="leave-date">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            <span className="days-badge">{calculateDays(leave.startDate, leave.endDate)} days</span>
                                        </p>
                                    </div>
                                    {getStatusBadge(leave.status)}
                                </div>

                                <div className="leave-reason">
                                    <strong>Reason:</strong>
                                    <p>{leave.reason}</p>
                                </div>

                                {leave.approvedBy && (
                                    <div className="approved-info">
                                        <i className="fa fa-user-check"></i>
                                        Approved by {leave.approvedBy.name}
                                    </div>
                                )}

                                {leave.rejectionReason && (
                                    <div className="rejection-info">
                                        <i className="fa fa-info-circle"></i>
                                        <strong>Rejection Reason:</strong> {leave.rejectionReason}
                                    </div>
                                )}

                                <div className="leave-footer">
                                    <span className="applied-date">
                                        Applied on {new Date(leave.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaveHistory;