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
import { useCallback, useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import './AnalyticsDashboard.css';

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

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');

    const fetchAnalytics = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/analytics/dashboard`,
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    params: { range: dateRange }
                }
            );
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <div className="analytics-loading">
                <div className="loading-spinner"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    const attendanceChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Present',
                data: stats?.attendance?.weekly || [85, 90, 88, 92, 87, 45, 30],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Absent',
                data: stats?.attendance?.absent || [15, 10, 12, 8, 13, 5, 2],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const departmentChartData = {
        labels: stats?.departments?.labels || ['IT', 'HR', 'Finance', 'Marketing', 'Sales'],
        datasets: [{
            data: stats?.departments?.data || [30, 15, 20, 25, 10],
            backgroundColor: [
                '#667eea',
                '#764ba2',
                '#f093fb',
                '#4facfe',
                '#43e97b'
            ]
        }]
    };

    const payrollChartData = {
        labels: stats?.payroll?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Payroll',
            data: stats?.payroll?.data || [250000, 260000, 255000, 270000, 265000, 280000],
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderRadius: 8
        }]
    };

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h1>Analytics Dashboard</h1>
                <div className="date-range-selector">
                    <button 
                        className={dateRange === 'week' ? 'active' : ''} 
                        onClick={() => setDateRange('week')}
                    >
                        Week
                    </button>
                    <button 
                        className={dateRange === 'month' ? 'active' : ''} 
                        onClick={() => setDateRange('month')}
                    >
                        Month
                    </button>
                    <button 
                        className={dateRange === 'year' ? 'active' : ''} 
                        onClick={() => setDateRange('year')}
                    >
                        Year
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-overview">
                <div className="stat-card blue">
                    <div className="stat-icon">
                        <i className="fa fa-users"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats?.overview?.totalEmployees || 0}</h3>
                        <p>Total Employees</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon">
                        <i className="fa fa-chart-line"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats?.overview?.attendanceRate || 0}%</h3>
                        <p>Attendance Rate</p>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon">
                        <i className="fa fa-tasks"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats?.overview?.completedTasks || 0}</h3>
                        <p>Tasks Completed</p>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon">
                        <i className="fa fa-dollar-sign"></i>
                    </div>
                    <div className="stat-info">
                        <h3>${(stats?.overview?.totalPayroll || 0).toLocaleString()}</h3>
                        <p>Monthly Payroll</p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="chart-container large">
                    <h3>Attendance Trends</h3>
                    <div className="chart-wrapper">
                        <Line 
                            key="analytics-attendance-chart"
                            data={attendanceChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'top' }
                                },
                                scales: {
                                    y: { beginAtZero: true }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Department Distribution</h3>
                    <div className="chart-wrapper">
                        <Doughnut 
                            key="analytics-department-chart"
                            data={departmentChartData}
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

                <div className="chart-container">
                    <h3>Monthly Payroll</h3>
                    <div className="chart-wrapper">
                        <Bar 
                            key="analytics-payroll-chart"
                            data={payrollChartData}
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
            </div>

            {/* Performance Metrics */}
            <div className="performance-section">
                <h2>Performance Metrics</h2>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-header">
                            <span>Task Completion Rate</span>
                            <span className="metric-value">{stats?.performance?.taskCompletion || 85}%</span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill green" 
                                style={{ width: `${stats?.performance?.taskCompletion || 85}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-header">
                            <span>Average Attendance</span>
                            <span className="metric-value">{stats?.performance?.avgAttendance || 92}%</span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill blue" 
                                style={{ width: `${stats?.performance?.avgAttendance || 92}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-header">
                            <span>Leave Utilization</span>
                            <span className="metric-value">{stats?.performance?.leaveUtilization || 45}%</span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill orange" 
                                style={{ width: `${stats?.performance?.leaveUtilization || 45}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
