import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './AnalyticsDashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/analytics/dashboard`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { period }
                }
            );
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="analytics-loading">
                <div className="spinner-large"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    if (!stats) {
        return <div className="analytics-error">Failed to load analytics</div>;
    }

    // Chart configurations
    const attendanceTrendData = {
        labels: stats.attendanceTrends?.map(t => new Date(t._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
        datasets: [
            {
                label: 'Present',
                data: stats.attendanceTrends?.map(t => t.present) || [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4
            },
            {
                label: 'Absent',
                data: stats.attendanceTrends?.map(t => t.absent) || [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4
            },
            {
                label: 'Late',
                data: stats.attendanceTrends?.map(t => t.late) || [],
                borderColor: 'rgb(255, 205, 86)',
                backgroundColor: 'rgba(255, 205, 86, 0.2)',
                tension: 0.4
            }
        ]
    };

    const departmentData = {
        labels: stats.employeesByDepartment?.map(d => d.department) || [],
        datasets: [{
            label: 'Employees',
            data: stats.employeesByDepartment?.map(d => d.count) || [],
            backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(118, 75, 162, 0.8)',
                'rgba(237, 100, 166, 0.8)',
                'rgba(255, 154, 158, 0.8)',
                'rgba(250, 208, 196, 0.8)'
            ]
        }]
    };

    const taskStatusData = {
        labels: stats.taskStats?.map(t => t._id) || [],
        datasets: [{
            data: stats.taskStats?.map(t => t.count) || [],
            backgroundColor: [
                '#9e9e9e',
                '#2196f3',
                '#ff9800',
                '#4caf50',
                '#f44336'
            ]
        }]
    };

    const departmentPerformanceData = {
        labels: stats.departmentPerformance?.map(d => d.name) || [],
        datasets: [{
            label: 'Task Completion Rate (%)',
            data: stats.departmentPerformance?.map(d => d.completionRate.toFixed(2)) || [],
            backgroundColor: 'rgba(102, 126, 234, 0.6)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h1>
                    <i className="fa fa-chart-line"></i> Analytics Dashboard
                </h1>
                <div className="period-selector">
                    <button
                        className={period === 'week' ? 'active' : ''}
                        onClick={() => setPeriod('week')}
                    >
                        Week
                    </button>
                    <button
                        className={period === 'month' ? 'active' : ''}
                        onClick={() => setPeriod('month')}
                    >
                        Month
                    </button>
                    <button
                        className={period === 'year' ? 'active' : ''}
                        onClick={() => setPeriod('year')}
                    >
                        Year
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <i className="fa fa-users"></i>
                    </div>
                    <div className="kpi-content">
                        <h3>{stats.overview.totalEmployees}</h3>
                        <p>Total Employees</p>
                        {stats.overview.newEmployees > 0 && (
                            <span className="kpi-badge positive">+{stats.overview.newEmployees} new</span>
                        )}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <i className="fa fa-user-check"></i>
                    </div>
                    <div className="kpi-content">
                        <h3>{stats.overview.attendanceRate}%</h3>
                        <p>Attendance Rate</p>
                        <span className={`kpi-badge ${stats.overview.attendanceRate >= 90 ? 'positive' : 'negative'}`}>
                            {stats.overview.attendanceRate >= 90 ? 'Excellent' : 'Needs Improvement'}
                        </span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <i className="fa fa-calendar-times"></i>
                    </div>
                    <div className="kpi-content">
                        <h3>{stats.overview.pendingLeaves}</h3>
                        <p>Pending Leaves</p>
                        {stats.overview.pendingLeaves > 0 && (
                            <span className="kpi-badge warning">Needs Review</span>
                        )}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                        <i className="fa fa-tasks"></i>
                    </div>
                    <div className="kpi-content">
                        <h3>{stats.overview.overdueTasks}</h3>
                        <p>Overdue Tasks</p>
                        {stats.overview.overdueTasks > 0 && (
                            <span className="kpi-badge negative">Action Required</span>
                        )}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <i className="fa fa-dollar-sign"></i>
                    </div>
                    <div className="kpi-content">
                        <h3>${stats.overview.totalPayroll.toLocaleString()}</h3>
                        <p>Total Payroll</p>
                        <span className="kpi-badge info">This Month</span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Attendance Trends (Last 7 Days)</h3>
                    <div className="chart-container">
                        <Line data={attendanceTrendData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Employees by Department</h3>
                    <div className="chart-container">
                        <Doughnut data={departmentData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Task Status Distribution</h3>
                    <div className="chart-container">
                        <Pie data={taskStatusData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Department Performance</h3>
                    <div className="chart-container">
                        <Bar data={departmentPerformanceData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="top-performers-section">
                <h3>
                    <i className="fa fa-trophy"></i> Top Performers
                </h3>
                <div className="performers-grid">
                    {stats.topPerformers?.slice(0, 5).map((performer, index) => (
                        <div key={performer._id} className="performer-card">
                            <div className="performer-rank">#{index + 1}</div>
                            <div className="performer-info">
                                <h4>{performer.employeeName}</h4>
                                <p>{performer.employeeId}</p>
                            </div>
                            <div className="performer-stats">
                                <div className="stat">
                                    <span className="stat-value">{performer.completedTasks}</span>
                                    <span className="stat-label">Tasks</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{performer.avgCompletionDays.toFixed(1)}</span>
                                    <span className="stat-label">Avg Days</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;