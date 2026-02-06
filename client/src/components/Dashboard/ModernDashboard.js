import axios from 'axios';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import './ModernDashboard.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ModernDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOfDay, setTimeOfDay] = useState('');

    useEffect(() => {
        fetchDashboardData();
        setGreeting();
    }, []);

    const setGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) setTimeOfDay('Good Morning');
        else if (hour < 18) setTimeOfDay('Good Afternoon');
        else setTimeOfDay('Good Evening');
    };

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/analytics/dashboard`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStats(response.data.data);
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
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="modern-dashboard">
            {/* Header Section */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="greeting-section">
                        <h1>{timeOfDay}, Admin! 👋</h1>
                        <p className="subtitle">Here's what's happening with your team today</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-primary">
                            <i className="fa fa-user-plus"></i>
                            Add Employee
                        </button>
                        <button className="btn-secondary">
                            <i className="fa fa-download"></i>
                            Export Report
                        </button>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <section className="stats-grid">
                <div className="stat-card gradient-blue">
                    <div className="stat-icon">
                        <i className="fa fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.overview?.totalEmployees || 0}</h3>
                        <p>Total Employees</p>
                        <div className="stat-footer">
                            <span className="trend positive">
                                <i className="fa fa-arrow-up"></i> +{stats?.overview?.newEmployees || 0} this month
                            </span>
                        </div>
                    </div>
                    <div className="stat-visual">
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="rgba(255,255,255,0.1)"/>
                            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)"/>
                        </svg>
                    </div>
                </div>

                <div className="stat-card gradient-green">
                    <div className="stat-icon">
                        <i className="fa fa-chart-line"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.overview?.attendanceRate || 0}%</h3>
                        <p>Attendance Rate</p>
                        <div className="stat-footer">
                            <span className="trend positive">
                                <i className="fa fa-check-circle"></i> Excellent
                            </span>
                        </div>
                    </div>
                    <div className="progress-ring">
                        <svg width="80" height="80">
                            <circle cx="40" cy="40" r="35" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none"/>
                            <circle 
                                cx="40" cy="40" r="35" 
                                stroke="white" 
                                strokeWidth="6" 
                                fill="none"
                                strokeDasharray={`${(stats?.overview?.attendanceRate || 0) * 2.2} 220`}
                                transform="rotate(-90 40 40)"
                            />
                        </svg>
                    </div>
                </div>

                <div className="stat-card gradient-orange">
                    <div className="stat-icon">
                        <i className="fa fa-calendar-times"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.overview?.pendingLeaves || 0}</h3>
                        <p>Pending Leave Requests</p>
                        <div className="stat-footer">
                            <Link to="/leaves" className="stat-link">
                                Review Now <i className="fa fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="pulse-animation"></div>
                </div>

                <div className="stat-card gradient-purple">
                    <div className="stat-icon">
                        <i className="fa fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                        <h3>${(stats?.overview?.totalPayroll || 0).toLocaleString()}</h3>
                        <p>Monthly Payroll</p>
                        <div className="stat-footer">
                            <span className="badge">This Month</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card gradient-red">
                    <div className="stat-icon">
                        <i className="fa fa-exclamation-triangle"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.overview?.overdueTasks || 0}</h3>
                        <p>Overdue Tasks</p>
                        <div className="stat-footer">
                            <Link to="/tasks" className="stat-link">
                                View Tasks <i className="fa fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="stat-card gradient-cyan">
                    <div className="stat-icon">
                        <i className="fa fa-file-alt"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.overview?.documentsToVerify || 0}</h3>
                        <p>Documents to Verify</p>
                        <div className="stat-footer">
                            <Link to="/documents" className="stat-link">
                                Verify Now <i className="fa fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="charts-section">
                <div className="chart-card large">
                    <div className="chart-header">
                        <h3>Attendance Trends</h3>
                        <div className="chart-actions">
                            <button className="btn-icon active">Week</button>
                            <button className="btn-icon">Month</button>
                            <button className="btn-icon">Year</button>
                        </div>
                    </div>
                    <div className="chart-body">
                        <Line 
                            key="attendance-line-chart"
                            data={{
                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                datasets: [{
                                    label: 'Present',
                                    data: [95, 88, 92, 90, 85, 70, 65],
                                    borderColor: '#667eea',
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                    tension: 0.4,
                                    fill: true
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false }
                                },
                                scales: {
                                    y: { beginAtZero: true }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Department Distribution</h3>
                    </div>
                    <div className="chart-body">
                        <Doughnut 
                            key="department-doughnut-chart"
                            data={{
                                labels: ['IT', 'HR', 'Finance', 'Marketing', 'Sales'],
                                datasets: [{
                                    data: [30, 15, 20, 25, 10],
                                    backgroundColor: [
                                        '#667eea',
                                        '#764ba2',
                                        '#f093fb',
                                        '#4facfe',
                                        '#43e97b'
                                    ]
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'bottom' }
                                }
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <Link to="/add-staff" className="action-card">
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
                    <Link to="/payroll" className="action-card">
                        <i className="fa fa-money-bill-wave"></i>
                        <span>Process Payroll</span>
                    </Link>
                    <Link to="/reports" className="action-card">
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