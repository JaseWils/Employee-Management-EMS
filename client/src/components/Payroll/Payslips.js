import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Payslips.css';

const Payslips = () => {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchPayslips();
    }, []);

    const fetchPayslips = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/payslips`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setPayslips(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching payslips:', error);
            // Demo data
            setPayslips([
                {
                    _id: '1',
                    month: '2026-01',
                    basicSalary: 5000,
                    allowances: { houseRent: 1000, transport: 500, medical: 300 },
                    deductions: { tax: 500, insurance: 200 },
                    netSalary: 6100,
                    status: 'paid',
                    paidDate: new Date().toISOString()
                },
                {
                    _id: '2',
                    month: '2025-12',
                    basicSalary: 5000,
                    allowances: { houseRent: 1000, transport: 500, medical: 300 },
                    deductions: { tax: 500, insurance: 200 },
                    netSalary: 6100,
                    status: 'paid',
                    paidDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPayslip = (payslip) => {
        setSelectedPayslip(payslip);
        setShowModal(true);
    };

    const handleDownloadPayslip = (payslip) => {
        toast.success('Downloading payslip...');
        // Implement PDF download here
    };

    const formatMonth = (monthStr) => {
        const date = new Date(monthStr + '-01');
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const getStatusBadge = (status) => {
        const badges = {
            paid: { class: 'status-paid', text: 'Paid', icon: 'check-circle' },
            pending: { class: 'status-pending', text: 'Pending', icon: 'clock' },
            processing: { class: 'status-processing', text: 'Processing', icon: 'spinner' }
        };

        const badge = badges[status] || badges.pending;

        return (
            <span className={`status-badge ${badge.class}`}>
                <i className={`fa fa-${badge.icon}`}></i>
                {badge.text}
            </span>
        );
    };

    return (
        <div className="payslips-container">
            <div className="payslips-header">
                <div>
                    <h1><i className="fa fa-file-invoice-dollar"></i> My Payslips</h1>
                    <p>View and download your salary statements</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading payslips...</p>
                </div>
            ) : payslips.length === 0 ? (
                <div className="empty-state">
                    <i className="fa fa-file-invoice"></i>
                    <h3>No Payslips</h3>
                    <p>No payslips available yet</p>
                </div>
            ) : (
                <div className="payslips-grid">
                    {payslips.map(payslip => (
                        <div key={payslip._id} className="payslip-card">
                            <div className="payslip-header">
                                <div className="month-badge">
                                    <i className="fa fa-calendar"></i>
                                    <span>{formatMonth(payslip.month)}</span>
                                </div>
                                {getStatusBadge(payslip.status)}
                            </div>

                            <div className="payslip-body">
                                <div className="salary-amount">
                                    <span className="amount-label">Net Salary</span>
                                    <h2>${payslip.netSalary.toLocaleString()}</h2>
                                </div>

                                <div className="salary-breakdown">
                                    <div className="breakdown-item">
                                        <span>Basic Salary</span>
                                        <strong>${payslip.basicSalary.toLocaleString()}</strong>
                                    </div>
                                    <div className="breakdown-item positive">
                                        <span>+ Allowances</span>
                                        <strong>${Object.values(payslip.allowances || {}).reduce((a, b) => a + b, 0).toLocaleString()}</strong>
                                    </div>
                                    <div className="breakdown-item negative">
                                        <span>- Deductions</span>
                                        <strong>${Object.values(payslip.deductions || {}).reduce((a, b) => a + b, 0).toLocaleString()}</strong>
                                    </div>
                                </div>

                                {payslip.paidDate && (
                                    <div className="paid-date">
                                        <i className="fa fa-calendar-check"></i>
                                        Paid on {new Date(payslip.paidDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            <div className="payslip-actions">
                                <button className="btn-view" onClick={() => handleViewPayslip(payslip)}>
                                    <i className="fa fa-eye"></i>
                                    View Details
                                </button>
                                <button className="btn-download" onClick={() => handleDownloadPayslip(payslip)}>
                                    <i className="fa fa-download"></i>
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payslip Detail Modal */}
            {showModal && selectedPayslip && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content payslip-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <i className="fa fa-times"></i>
                        </button>

                        <div className="payslip-detail">
                            <div className="payslip-detail-header">
                                <h2>Salary Statement</h2>
                                <p>{formatMonth(selectedPayslip.month)}</p>
                            </div>

                            <div className="employee-info-section">
                                <h3>Employee Information</h3>
                                <div className="info-grid">
                                    <div>
                                        <label>Name</label>
                                        <p>{user.name}</p>
                                    </div>
                                    <div>
                                        <label>Employee ID</label>
                                        <p>{user.employeeId || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label>Department</label>
                                        <p>{user.department || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label>Position</label>
                                        <p>{user.position || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="salary-details-section">
                                <h3>Salary Details</h3>
                                
                                <div className="detail-table">
                                    <div className="detail-row">
                                        <span>Basic Salary</span>
                                        <strong>${selectedPayslip.basicSalary.toLocaleString()}</strong>
                                    </div>
                                </div>

                                <div className="detail-table allowances-section">
                                    <h4>Allowances</h4>
                                    {Object.entries(selectedPayslip.allowances || {}).map(([key, value]) => (
                                        <div key={key} className="detail-row">
                                            <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                            <strong className="positive">+${value.toLocaleString()}</strong>
                                        </div>
                                    ))}
                                </div>

                                <div className="detail-table deductions-section">
                                    <h4>Deductions</h4>
                                    {Object.entries(selectedPayslip.deductions || {}).map(([key, value]) => (
                                        <div key={key} className="detail-row">
                                            <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                            <strong className="negative">-${value.toLocaleString()}</strong>
                                        </div>
                                    ))}
                                </div>

                                <div className="detail-table total-section">
                                    <div className="detail-row total-row">
                                        <span>Net Salary</span>
                                        <strong className="net-amount">${selectedPayslip.netSalary.toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="btn-download-full" onClick={() => handleDownloadPayslip(selectedPayslip)}>
                                    <i className="fa fa-file-pdf"></i>
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payslips;