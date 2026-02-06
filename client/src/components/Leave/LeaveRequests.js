import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './LeaveRequests.css';

const LeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchLeaveRequests();
    }, [filter]);

    const fetchLeaveRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/leave/all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { status: filter !== 'all' ? filter : undefined }
                }
            );

            if (response.data.success) {
                setLeaves(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            toast.error('Error loading leave requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (leaveId) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/leave/approve/${leaveId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('✅ Leave request approved!');
                fetchLeaveRequests();
                setShowModal(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error approving leave');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (leaveId, reason) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/leave/reject/${leaveId}`,
                { rejectionReason: reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Leave request rejected');
                fetchLeaveRequests();
                setShowModal(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error rejecting leave');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'badge-pending', icon: 'clock', text: 'Pending' },
            approved: { class: 'badge-approved', icon: 'check-circle', text: 'Approved' },
            rejected: { class: 'badge-rejected', icon: 'times-circle', text: 'Rejected' }
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

    return (
        <div className="leave-requests-container">
            <div className="requests-header">
                <div>
                    <h1>Leave Requests</h1>
                    <p>Manage employee leave applications</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({leaves.filter(l => l.status === 'pending').length})
                </button>
                <button
                    className={filter === 'approved' ? 'active' : ''}
                    onClick={() => setFilter('approved')}
                >
                    Approved
                </button>
                <button
                    className={filter === 'rejected' ? 'active' : ''}
                    onClick={() => setFilter('rejected')}
                >
                    Rejected
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading leave requests...</p>
                </div>
            ) : leaves.length === 0 ? (
                <div className="empty-state">
                    <i className="fa fa-inbox"></i>
                    <h3>No Leave Requests</h3>
                    <p>There are no {filter !== 'all' ? filter : ''} leave requests at the moment</p>
                </div>
            ) : (
                <div className="requests-grid">
                    {leaves.map(leave => (
                        <div key={leave._id} className="leave-request-card">
                            <div className="card-header">
                                <div className="employee-info">
                                    <img
                                        src={leave.employee?.profileImage || `https://ui-avatars.com/api/?name=${leave.employee?.fullName}&background=667eea&color=fff`}
                                        alt={leave.employee?.fullName}
                                    />
                                    <div>
                                        <h4>{leave.employee?.fullName || 'Unknown'}</h4>
                                        <span>{leave.employee?.department?.name || 'N/A'}</span>
                                    </div>
                                </div>
                                {getStatusBadge(leave.status)}
                            </div>

                            <div className="card-body">
                                <div className="leave-type">
                                    <span className="type-icon">{getLeaveTypeIcon(leave.leaveType)}</span>
                                    <span className="type-name">{leave.leaveType?.toUpperCase()}</span>
                                </div>

                                <div className="leave-dates">
                                    <div className="date-item">
                                        <i className="fa fa-calendar-alt"></i>
                                        <span>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="days-count">
                                        <strong>{calculateDays(leave.startDate, leave.endDate)}</strong> days
                                    </div>
                                </div>

                                <div className="leave-reason">
                                    <strong>Reason:</strong>
                                    <p>{leave.reason}</p>
                                </div>
                            </div>

                            <div className="card-footer">
                                {leave.status === 'pending' ? (
                                    <div className="action-buttons">
                                        <button
                                            className="btn-reject"
                                            onClick={() => {
                                                const reason = prompt('Rejection reason (optional):');
                                                if (reason !== null) {
                                                    handleReject(leave._id, reason);
                                                }
                                            }}
                                        >
                                            <i className="fa fa-times"></i>
                                            Reject
                                        </button>
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleApprove(leave._id)}
                                        >
                                            <i className="fa fa-check"></i>
                                            Approve
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn-view"
                                        onClick={() => {
                                            setSelectedLeave(leave);
                                            setShowModal(true);
                                        }}
                                    >
                                        <i className="fa fa-eye"></i>
                                        View Details
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for viewing details */}
            {showModal && selectedLeave && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <i className="fa fa-times"></i>
                        </button>

                        <div className="modal-header">
                            <h2>Leave Request Details</h2>
                            {getStatusBadge(selectedLeave.status)}
                        </div>

                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Employee</label>
                                    <p>{selectedLeave.employee?.fullName}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Leave Type</label>
                                    <p>{getLeaveTypeIcon(selectedLeave.leaveType)} {selectedLeave.leaveType?.toUpperCase()}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Duration</label>
                                    <p>{calculateDays(selectedLeave.startDate, selectedLeave.endDate)} days</p>
                                </div>
                                <div className="detail-item">
                                    <label>Applied On</label>
                                    <p>{new Date(selectedLeave.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="detail-item full-width">
                                    <label>Reason</label>
                                    <p>{selectedLeave.reason}</p>
                                </div>
                                {selectedLeave.rejectionReason && (
                                    <div className="detail-item full-width">
                                        <label>Rejection Reason</label>
                                        <p className="rejection-text">{selectedLeave.rejectionReason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequests;