import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ApplyLeave.css';

const ApplyLeave = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [employeeInfo, setEmployeeInfo] = useState(null); // Add this
    
    const [formData, setFormData] = useState({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        reason: '',
        document: null
    });

    // Add useEffect to get employee info
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setEmployeeInfo(user);
    }, []);

    // Rest of your code...
    const [errors, setErrors] = useState({});

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const employeeId = user._id || user.id;

    const leaveTypes = [
        { value: 'sick', label: 'Sick Leave', icon: '🏥' },
        { value: 'casual', label: 'Casual Leave', icon: '☕' },
        { value: 'annual', label: 'Annual Leave', icon: '🏖️' },
        { value: 'maternity', label: 'Maternity Leave', icon: '👶' },
        { value: 'paternity', label: 'Paternity Leave', icon: '👨‍👧' },
        { value: 'unpaid', label: 'Unpaid Leave', icon: '📅' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            setFormData(prev => ({ ...prev, document: file }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.startDate) > new Date(formData.endDate)) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const employeeId = user._id || user.id;

    if (!employeeId) {
        toast.error('User session invalid. Please login again.');
        navigate('/login');
        return;
    }

    if (!formData.startDate || !formData.endDate || !formData.reason) {
        toast.error('Please fill in all required fields');
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const submitData = new FormData();
        
        submitData.append('leaveType', formData.leaveType);
        submitData.append('startDate', formData.startDate);
        submitData.append('endDate', formData.endDate);
        submitData.append('reason', formData.reason);
        
        if (formData.document) {
            submitData.append('document', formData.document);
        }

        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/v1/leave/apply/${employeeId}`,
            submitData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (response.data.success) {
            toast.success('Leave application submitted successfully!');
            setFormData({
                leaveType: 'casual',
                startDate: '',
                endDate: '',
                reason: '',
                document: null
            });
            setTimeout(() => navigate('/leave-history'), 1500);
        }
    } catch (error) {
        console.error('Leave application error:', error);
        toast.error(error.response?.data?.message || 'Error submitting leave application');
    } finally {
        setLoading(false);
    }
};

    const calculateDays = () => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays;
        }
        return 0;
    };

    return (
        <div className="apply-leave-container">
            <div className="apply-leave-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <i className="fa fa-arrow-left"></i>
                </button>
                <div>
                    <h1>Apply for Leave</h1>
                    <p>Submit your leave request</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="apply-leave-form">
                <div className="form-section">
                    <h3><i className="fa fa-calendar"></i> Leave Details</h3>

                    <div className="leave-type-grid">
                        {leaveTypes.map(type => (
                            <div
                                key={type.value}
                                className={`leave-type-card ${formData.leaveType === type.value ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, leaveType: type.value }))}
                            >
                                <span className="type-icon">{type.icon}</span>
                                <span className="type-label">{type.label}</span>
                            </div>
                        ))}
                    </div>
                    {errors.leaveType && <span className="error-text">{errors.leaveType}</span>}

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Start Date <span className="required">*</span></label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className={errors.startDate ? 'error' : ''}
                            />
                            {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                        </div>

                        <div className="form-group">
                            <label>End Date <span className="required">*</span></label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                min={formData.startDate || new Date().toISOString().split('T')[0]}
                                className={errors.endDate ? 'error' : ''}
                            />
                            {errors.endDate && <span className="error-text">{errors.endDate}</span>}
                        </div>
                    </div>

                    {calculateDays() > 0 && (
                        <div className="days-info">
                            <i className="fa fa-info-circle"></i>
                            <span>Total Days: <strong>{calculateDays()}</strong></span>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Reason <span className="required">*</span></label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Please provide a detailed reason for your leave..."
                            rows="4"
                            className={errors.reason ? 'error' : ''}
                        />
                        {errors.reason && <span className="error-text">{errors.reason}</span>}
                    </div>

                    <div className="form-group">
                        <label>Supporting Document (Optional)</label>
                        <div className="file-upload">
                            <input
                                type="file"
                                id="document"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                hidden
                            />
                            <label htmlFor="document" className="file-upload-btn">
                                <i className="fa fa-upload"></i>
                                {formData.document ? formData.document.name : 'Upload Document'}
                            </label>
                            {formData.document && (
                                <button
                                    type="button"
                                    className="remove-file"
                                    onClick={() => setFormData(prev => ({ ...prev, document: null }))}
                                >
                                    <i className="fa fa-times"></i>
                                </button>
                            )}
                        </div>
                        <small className="help-text">PDF, JPG, PNG (Max 5MB)</small>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fa fa-times"></i>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <i className="fa fa-paper-plane"></i>
                                Submit Application
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplyLeave;