import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportData';
import './ReportGenerator.css';

const ReportGenerator = () => {
    const [reportType, setReportType] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(false);

    const reportTypes = [
        { value: 'employees', label: 'Employee Report', icon: 'users' },
        { value: 'attendance', label: 'Attendance Report', icon: 'calendar-check' },
        { value: 'leaves', label: 'Leave Report', icon: 'calendar-times' },
        { value: 'payroll', label: 'Payroll Report', icon: 'money-bill-wave' },
        { value: 'performance', label: 'Performance Report', icon: 'chart-line' },
        { value: 'tasks', label: 'Task Report', icon: 'tasks' }
    ];

    const generateReport = async (format) => {
        if (!reportType) {
            toast.error('Please select a report type');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/reports/${reportType}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: dateRange
                }
            );

            const { data, columns, title } = response.data;

            switch (format) {
                case 'pdf':
                    exportToPDF(data, columns, title);
                    break;
                case 'excel':
                    exportToExcel(data, columns, title);
                    break;
                case 'csv':
                    exportToCSV(data, columns, title);
                    break;
                default:
                    break;
            }

            toast.success(`Report generated successfully!`);
        } catch (error) {
            toast.error('Error generating report');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-generator">
            <div className="generator-header">
                <h2>
                    <i className="fa fa-file-chart-line"></i> Generate Reports
                </h2>
                <p>Create detailed reports and export in various formats</p>
            </div>

            <div className="report-config">
                <div className="config-section">
                    <h3>Select Report Type</h3>
                    <div className="report-types-grid">
                        {reportTypes.map(type => (
                            <div
                                key={type.value}
                                className={`report-type-card ${reportType === type.value ? 'selected' : ''}`}
                                onClick={() => setReportType(type.value)}
                            >
                                <i className={`fa fa-${type.icon}`}></i>
                                <span>{type.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="config-section">
                    <h3>Date Range</h3>
                    <div className="date-range-inputs">
                        <div className="date-input">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                        </div>
                        <div className="date-input">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                min={dateRange.startDate}
                            />
                        </div>
                    </div>
                </div>

                <div className="config-section">
                    <h3>Export Format</h3>
                    <div className="export-buttons">
                        <button
                            className="export-btn pdf"
                            onClick={() => generateReport('pdf')}
                            disabled={loading}
                        >
                            <i className="fa fa-file-pdf"></i>
                            {loading ? 'Generating...' : 'Export as PDF'}
                        </button>
                        <button
                            className="export-btn excel"
                            onClick={() => generateReport('excel')}
                            disabled={loading}
                        >
                            <i className="fa fa-file-excel"></i>
                            {loading ? 'Generating...' : 'Export as Excel'}
                        </button>
                        <button
                            className="export-btn csv"
                            onClick={() => generateReport('csv')}
                            disabled={loading}
                        >
                            <i className="fa fa-file-csv"></i>
                            {loading ? 'Generating...' : 'Export as CSV'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;