import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AddStaff.css';

const AddStaff = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        employeeId: '',
        phone: '',
        department: '',
        position: '',
        dateOfBirth: '',
        joiningDate: '',
        gender: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: '',
        profileImage: null
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDepartments();
        generateEmployeeId();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/get-dept`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Departments loaded:', response.data);
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to load departments');
        }
    };

    const generateEmployeeId = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setFormData(prev => ({
            ...prev,
            employeeId: `EMP${timestamp}${random}`
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            // Validate file type
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error('Only JPG, JPEG, and PNG files are allowed');
                return;
            }

            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            // Create FormData for file upload
            const submitData = new FormData();
            
            // Append all text fields
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('employeeId', formData.employeeId);
            submitData.append('phone', formData.phone);
            submitData.append('department', formData.department);
            submitData.append('position', formData.position);
            submitData.append('dateOfBirth', formData.dateOfBirth);
            submitData.append('joiningDate', formData.joiningDate || new Date().toISOString().split('T')[0]);
            submitData.append('gender', formData.gender);

            // Append address as JSON string
            const address = {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zipCode: formData.zipCode
            };
            submitData.append('address', JSON.stringify(address));

            // Append emergency contact as JSON string
            const emergencyContact = {
                name: formData.emergencyContactName,
                relationship: formData.emergencyContactRelationship,
                phone: formData.emergencyContactPhone
            };
            submitData.append('emergencyContact', JSON.stringify(emergencyContact));

            // Append image if exists
            if (formData.profileImage) {
                submitData.append('profileImage', formData.profileImage);
            }

            console.log('Submitting to:', `${process.env.REACT_APP_API_URL}/api/v1/add-staff`);

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/add-staff`,
                submitData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Response:', response.data);

            if (response.data.success) {
                toast.success('✅ Employee added successfully!');
                setTimeout(() => {
                    navigate('/employees');
                }, 1500);
            }

        } catch (error) {
            console.error('Error adding employee:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Error adding employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-staff-container">
            <div className="add-staff-header">
                <button className="back-btn" onClick={() => navigate('/employees')}>
                    <i className="fa fa-arrow-left"></i>
                </button>
                <div>
                    <h1>Add New Employee</h1>
                    <p>Fill in the employee details below</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="add-staff-form">
                {/* Profile Image Section */}
                <div className="form-section">
                    <h3>Profile Picture</h3>
                    <div className="profile-upload">
                        <div className="image-preview-container">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            ) : (
                                <div className="image-placeholder">
                                    <i className="fa fa-user"></i>
                                </div>
                            )}
                        </div>
                        <div className="upload-controls">
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="profileImage" className="upload-btn">
                                <i className="fa fa-camera"></i>
                                {imagePreview ? 'Change Photo' : 'Upload Photo'}
                            </label>
                            {imagePreview && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setFormData(prev => ({ ...prev, profileImage: null }));
                                    }}
                                >
                                    <i className="fa fa-trash"></i> Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="form-section">
                    <h3><i className="fa fa-user"></i> Personal Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name <span className="required">*</span></label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={errors.fullName ? 'error' : ''}
                            />
                            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Employee ID <span className="required">*</span></label>
                            <input
                                type="text"
                                name="employeeId"
                                value={formData.employeeId}
                                readOnly
                                className="readonly"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email <span className="required">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john.doe@company.com"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Phone <span className="required">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label>Date of Birth <span className="required">*</span></label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className={errors.dateOfBirth ? 'error' : ''}
                            />
                            {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                        </div>

                        <div className="form-group">
                            <label>Gender <span className="required">*</span></label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={errors.gender ? 'error' : ''}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <span className="error-text">{errors.gender}</span>}
                        </div>
                    </div>
                </div>

                {/* Job Information */}
                <div className="form-section">
                    <h3><i className="fa fa-briefcase"></i> Job Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Department <span className="required">*</span></label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className={errors.department ? 'error' : ''}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            {errors.department && <span className="error-text">{errors.department}</span>}
                        </div>

                        <div className="form-group">
                            <label>Position <span className="required">*</span></label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="e.g., Senior Developer"
                                className={errors.position ? 'error' : ''}
                            />
                            {errors.position && <span className="error-text">{errors.position}</span>}
                        </div>

                        <div className="form-group full-width">
                            <label>Joining Date</label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="form-section">
                    <h3><i className="fa fa-map-marker-alt"></i> Address Information</h3>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Street Address</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="123 Main Street"
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="New York"
                            />
                        </div>

                        <div className="form-group">
                            <label>State/Province</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="NY"
                            />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="United States"
                            />
                        </div>

                        <div className="form-group">
                            <label>Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="10001"
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="form-section">
                    <h3><i className="fa fa-phone-alt"></i> Emergency Contact</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Contact Name</label>
                            <input
                                type="text"
                                name="emergencyContactName"
                                value={formData.emergencyContactName}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label>Relationship</label>
                            <input
                                type="text"
                                name="emergencyContactRelationship"
                                value={formData.emergencyContactRelationship}
                                onChange={handleChange}
                                placeholder="Mother, Father, Spouse"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="emergencyContactPhone"
                                value={formData.emergencyContactPhone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate('/employees')}
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
                                Adding Employee...
                            </>
                        ) : (
                            <>
                                <i className="fa fa-check"></i>
                                Add Employee
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStaff;