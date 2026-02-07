import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import './AttendanceReports.css';

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

const AttendanceReports = () => {
    const [period, setPeriod] = useState('week');

    // Demo data
    const lineChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Present',
                data: [28, 30, 29, 31, 30, 15, 10],
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                tension: 0.4
            },
            {
                label: 'Absent',
                data: [2, 0, 1, 0, 0, 15, 20],
                borderColor: '#f56565',
                backgroundColor: 'rgba(245, 101, 101, 0.1)',
                tension: 0.4
            }
        ]
    };

    const barChartData = {
        labels: ['On Time', 'Late', 'Half Day', 'Absent'],
        datasets: [
            {
                label: 'Count',
                data: [85, 10, 3, 2],
                backgroundColor: [
                    'rgba(72, 187, 120, 0.8)',
                    'rgba(237, 137, 54, 0.8)',
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(245, 101, 101, 0.8)'
                ]
            }
        ]
    };

    const doughnutData = {
        labels: ['Present', 'Late', 'Half Day', 'Absent'],
        datasets: [
            {
                data: [85, 10, 3, 2],
                backgroundColor: [
                    '#48bb78',
                    '#ed8936',
                    '#2196f3',
                    '#f56565'
                ]
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'var(--text-primary)',
                    usePointStyle: true,
                    padding: 15
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'var(--text-secondary)'
                },
                grid: {
                    color: 'var(--border-color)'
                }
            },
            x: {
                ticks: {
                    color: 'var(--text-secondary)'
                },
                grid: {
                    color: 'var(--border-color)'
                }
            }
        }
    };

    return (
        <div className="attendance-reports-container">
            <div className="reports-header">
                <div>
                    <h1><i className="fa fa-chart-bar"></i> Attendance Reports</h1>
                    <p>Analytics and insights</p>
                </div>
                <select value={period} onChange={(e) => setPeriod(e.target.value)} className="period-select">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
                <div className="summary-card green">
                    <div className="summary-icon">
                        <i className="fa fa-check-circle"></i>
                    </div>
                    <div className="summary-content">
                        <h3>95%</h3>
                        <p>Attendance Rate</p>
                        <span className="trend positive">
                            <i className="fa fa-arrow-up"></i> 2% from last month
                        </span>
                    </div>
                </div>

                <div className="summary-card blue">
                    <div className="summary-icon">
                        <i className="fa fa-clock"></i>
                    </div>
                    <div className="summary-content">
                        <h3>8.2h</h3>
                        <p>Avg. Work Hours</p>
                        <span className="trend positive">
                            <i className="fa fa-arrow-up"></i> 0.5h increase
                        </span>
                    </div>
                </div>

                <div className="summary-card orange">
                    <div className="summary-icon">
                        <i className="fa fa-exclamation-triangle"></i>
                    </div>
                    <div className="summary-content">
                        <h3>10</h3>
                        <p>Late Arrivals</p>
                        <span className="trend negative">
                            <i className="fa fa-arrow-down"></i> 5 less than last month
                        </span>
                    </div>
                </div>

                <div className="summary-card red">
                    <div className="summary-icon">
                        <i className="fa fa-user-times"></i>
                    </div>
                    <div className="summary-content">
                        <h3>2</h3>
                        <p>Total Absences</p>
                        <span className="trend positive">
                            <i className="fa fa-minus"></i> Same as last month
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3><i className="fa fa-chart-line"></i> Attendance Trend</h3>
                    <div className="chart-wrapper">
                        <Line data={lineChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3><i className="fa fa-chart-bar"></i> Status Distribution</h3>
                    <div className="chart-wrapper">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3><i className="fa fa-chart-pie"></i> Overall Summary</h3>
                    <div className="chart-wrapper">
                        <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReports;