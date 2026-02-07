import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Performance.css';

const Performance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
        employee: '',
        period: '',
        rating: 5,
        achievements: '',
        improvements: '',
        goals: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/get-staffs`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setEmployees(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            // Demo data
            setEmployees([
                {
                    _id: '1',
                    fullName: 'John Doe',
                    position: 'Senior Developer',
                    department: { name: 'IT' },
                    performanceScore: 8.5
                },
                {
                    _id: '2',
                    fullName: 'Jane Smith',
                    position: 'HR Manager',
                    department: { name: 'HR' },
                    performanceScore: 9.2
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/performance/review`,
                reviewData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Performance review submitted!');
            setShowReviewModal(false);
            setReviewData({
                employee: '',
                period: '',
                rating: 5,
                achievements: '',
                improvements: '',
                goals: ''
            });
        } catch (error) {
            toast.error('Error submitting review');
        }
    };

    const getPerformanceColor = (score) => {
        if (score >= 9) return '#48bb78';
        if (score >= 7) return '#ed8936';
        return '#f56565';
    };

    return (
        <div className="performance-container">
            <div className="performance-header">
                <div>
                    <h1><i className="fa fa-star"></i> Performance Management</h1>
                    <p>Track and manage employee performance</p>
                </div>
                <button className="btn-add-review" onClick={() => setShowReviewModal(true)}>
                    <i className="fa fa-plus"></i>
                    Add Review
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading performance data...</p>
                </div>
            ) : (
                <div className="performance-grid">
                    {employees.map(emp => (
                        <div key={emp._id} className="performance-card">
                            <div className="perf-header">
                                <img
                                    src={emp.profileImage || `https://ui-avatars.com/api/?name=${emp.fullName}&background=667eea&color=fff`}
                                    alt={emp.fullName}
                                />
                                <div>
                                    <h3>{emp.fullName}</h3>
                                    <p>{emp.position}</p>
                                    <span className="dept-badge">{emp.department?.name}</span>
                                </div>
                            </div>

                            <div className="perf-score">
                                <div className="score-circle" style={{ borderColor: getPerformanceColor(emp.performanceScore || 7.5) }}>
                                    <span className="score-value">{emp.performanceScore || 7.5}</span>
                                    <span className="score-max">/10</span>
                                </div>
                                <p className="score-label">Performance Score</p>
                            </div>

                            <div className="perf-actions">
                                <button className="btn-view-details" onClick={() => setSelectedEmployee(emp)}>
                                    <i className="fa fa-eye"></i>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Review Modal */}
            {showReviewModal && (
                <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowReviewModal(false)}>
                            <i className="fa fa-times"></i>
                        </button>

                        <div className="modal-header">
                            <h2>Performance Review</h2>
                        </div>

                        <form onSubmit={handleSubmitReview} className="modal-body">
                            <div className="form-group">
                                <label>Employee <span className="required">*</span></label>
                                <select
                                    value={reviewData.employee}
                                    onChange={(e) => setReviewData({ ...reviewData, employee: e.target.value })}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.fullName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Review Period <span className="required">*</span></label>
                                <input
                                    type="month"
                                    value={reviewData.period}
                                    onChange={(e) => setReviewData({ ...reviewData, period: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Rating (1-10) <span className="required">*</span></label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={reviewData.rating}
                                    onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                                    className="rating-slider"
                                />
                                <div className="rating-display">{reviewData.rating}/10</div>
                            </div>

                            <div className="form-group">
                                <label>Key Achievements</label>
                                <textarea
                                    value={reviewData.achievements}
                                    onChange={(e) => setReviewData({ ...reviewData, achievements: e.target.value })}
                                    rows="3"
                                    placeholder="List key achievements..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Areas for Improvement</label>
                                <textarea
                                    value={reviewData.improvements}
                                    onChange={(e) => setReviewData({ ...reviewData, improvements: e.target.value })}
                                    rows="3"
                                    placeholder="List areas for improvement..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Goals for Next Period</label>
                                <textarea
                                    value={reviewData.goals}
                                    onChange={(e) => setReviewData({ ...reviewData, goals: e.target.value })}
                                    rows="3"
                                    placeholder="Set goals..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowReviewModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Performance;