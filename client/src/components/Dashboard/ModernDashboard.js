import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ModernDashboard.css';

const ModernDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        overview: {
            totalEmployees: 0,
            newEmployees: 0,
            pendingLeaves: 0,
            overdueTasks: 0,
            attendanceRate: 0,
            totalPayroll: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/analytics/dashboard`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="modern-dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="modern-dashboard">
            <div className="dashboard-header">
                <h1>Good Morning, Admin! 👋</h1>
                <p className="subtitle">Here's what's happening with your team today</p>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
                <div className="stat-card gradient-blue">
                    <div className="stat-icon">
                        <i className="fa fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.overview.totalEmployees || 0}</h3>
                        <p>Total Employees</p>
                        {stats.overview.newEmployees > 0 && (
                            <span className="badge positive">+{stats.overview.newEmployees} this month</span>
                        )}
                    </div>
                </div>

                <div className="stat-card gradient-green">
                    <div className="stat-icon">
                        <i className="fa fa-chart-line"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.overview.attendanceRate || 0}%</h3>
                        <p>Attendance Rate</p>
                        <span className="badge positive">Excellent</span>
                    </div>
                </div>

                <div className="stat-card gradient-orange">
                    <div className="stat-icon">
                        <i className="fa fa-calendar-times"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats.overview.pendingLeaves || 0}</h3>
                        <p>Pending Leave Requests</p>
                        <Link to="/leave-requests" className="stat-link">
                            Review Now →
                        </Link>
                    </div>
                </div>

                <div className="stat-card gradient-purple">
                    <div className="stat-icon">
                        <i className="fa fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                        <h3>${(stats.overview.totalPayroll || 0).toLocaleString()}</h3>
                        <p>Monthly Payroll</p>
                        <span className="badge">This Month</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <section className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <Link to="/add-employee" className="action-card">
                        <i className="fa fa-user-plus"></i>
                        <span>Add Employee</span>
                    </Link>
                    <Link to="/apply-leave" className="action-card">
                        <i className="fa fa-calendar-plus"></i>
                        <span>Apply Leave</span>
                    </Link>
                    <Link to="/tasks" className="action-card">
                        <i className="fa fa-tasks"></i>
                        <span>Assign Task</span>
                    </Link>
                    <Link to="/salary" className="action-card">
                        <i className="fa fa-money-bill-wave"></i>
                        <span>Process Payroll</span>
                    </Link>
                    <Link to="/analytics" className="action-card">
                        <i className="fa fa-chart-bar"></i>
                        <span>View Reports</span>
                    </Link>
                    <Link to="/documents" className="action-card">
                        <i className="fa fa-file-upload"></i>
                        <span>Upload Document</span>
                    </Link>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon blue">
                            <i className="fa fa-user-plus"></i>
                        </div>
                        <div className="activity-content">
                            <p><strong>John Doe</strong> joined the IT department</p>
                            <span className="activity-time">2 hours ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon green">
                            <i className="fa fa-check-circle"></i>
                        </div>
                        <div className="activity-content">
                            <p><strong>Leave request</strong> from Sarah Smith was approved</p>
                            <span className="activity-time">4 hours ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon orange">
                            <i className="fa fa-file-alt"></i>
                        </div>
                        <div className="activity-content">
                            <p><strong>Document uploaded</strong> by Michael Brown</p>
                            <span className="activity-time">Yesterday</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ModernDashboard;