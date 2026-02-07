import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AddEmployeeForm.css';

const AddEmployeeForm = () => {
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
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });

    const [departments, setDepartments] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);

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
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
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
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

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
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error('Only JPG, JPEG, and PNG files are allowed');
                return;
            }

            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Step 1 validation
        if (currentStep === 1) {
            if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
            }
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone is required';
            } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
                newErrors.phone = 'Phone must be 10 digits';
            }
            if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
            if (!formData.gender) newErrors.gender = 'Gender is required';
        }

        // Step 2 validation
        if (currentStep === 2) {
            if (!formData.department) newErrors.department = 'Department is required';
            if (!formData.position.trim()) newErrors.position = 'Position is required';
            if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
        }

        // Step 3 validation
        if (currentStep === 3) {
            if (!formData.address.street.trim()) newErrors['address.street'] = 'Street is required';
            if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
            if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
            if (!formData.address.country.trim()) newErrors['address.country'] = 'Country is required';
            if (!formData.address.zipCode.trim()) newErrors['address.zipCode'] = 'Zip code is required';
        }

        // Step 4 validation
        if (currentStep === 4) {
            if (!formData.emergencyContact.name.trim()) newErrors['emergencyContact.name'] = 'Emergency contact name is required';
            if (!formData.emergencyContact.relationship.trim()) newErrors['emergencyContact.relationship'] = 'Relationship is required';
            if (!formData.emergencyContact.phone.trim()) newErrors['emergencyContact.phone'] = 'Emergency contact phone is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateForm()) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
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
            const formDataToSend = new FormData();

            // Append all form data
            Object.keys(formData).forEach(key => {
                if (typeof formData[key] === 'object' && formData[key] !== null) {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append image if exists
            if (profileImage) {
                formDataToSend.append('profileImage', profileImage);
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/add-staff`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success('✅ Employee added successfully!');
            
            // Reset form
            setTimeout(() => {
                window.location.href = '/employees';
            }, 1500);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding employee');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {[1, 2, 3, 4].map(step => (
                <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}>
                    <div className="step-number">{step}</div>
                    <div className="step-label">
                        {step === 1 && 'Personal Info'}
                        {step === 2 && 'Job Details'}
                        {step === 3 && 'Address'}
                        {step === 4 && 'Emergency Contact'}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="add-employee-container">
            <div className="form-header">
                <button className="back-btn" onClick={() => window.history.back()}>
                    <i className="fa fa-arrow-left"></i>
                </button>
                <div>
                    <h1>Add New Employee</h1>
                    <p>Fill in the details to add a new team member</p>
                </div>
            </div>

            {renderStepIndicator()}

            <form onSubmit={handleSubmit} className="employee-form">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                    <div className="form-step active">
                        <h2 className="step-title">
                            <i className="fa fa-user"></i> Personal Information
                        </h2>

                        <div className="profile-image-section">
                            <div className="image-upload-box">
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                />
                                <label htmlFor="profileImage" className="image-upload-label">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <i className="fa fa-camera"></i>
                                            <span>Upload Photo</span>
                                        </div>
                                    )}
                                </label>
                                {imagePreview && (
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => {
                                            setProfileImage(null);
                                            setImagePreview(null);
                                        }}
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                )}
                            </div>
                            <p className="image-hint">JPG, PNG or JPEG. Max 5MB</p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="fullName">
                                    Full Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={errors.fullName ? 'error' : ''}
                                />
                                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="employeeId">
                                    Employee ID <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="employeeId"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    Email Address <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john.doe@company.com"
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">
                                    Phone Number <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                    className={errors.phone ? 'error' : ''}
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateOfBirth">
                                    Date of Birth <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={errors.dateOfBirth ? 'error' : ''}
                                />
                                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">
                                    Gender <span className="required">*</span>
                                </label>
                                <select
                                    id="gender"
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
                                {errors.gender && <span className="error-message">{errors.gender}</span>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Job Details */}
                {currentStep === 2 && (
                    <div className="form-step active">
                        <h2 className="step-title">
                            <i className="fa fa-briefcase"></i> Job Details
                        </h2>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="department">
                                    Department <span className="required">*</span>
                                </label>
                                <select
                                    id="department"
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
                                {errors.department && <span className="error-message">{errors.department}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="position">
                                    Position/Title <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="e.g., Senior Developer"
                                    className={errors.position ? 'error' : ''}
                                />
                                {errors.position && <span className="error-message">{errors.position}</span>}
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="joiningDate">
                                    Joining Date <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="joiningDate"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={errors.joiningDate ? 'error' : ''}
                                />
                                {errors.joiningDate && <span className="error-message">{errors.joiningDate}</span>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Address */}
                {currentStep === 3 && (
                    <div className="form-step active">
                        <h2 className="step-title">
                            <i className="fa fa-map-marker-alt"></i> Address Information
                        </h2>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="address.street">
                                    Street Address <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address.street"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                    placeholder="123 Main Street"
                                    className={errors['address.street'] ? 'error' : ''}
                                />
                                {errors['address.street'] && <span className="error-message">{errors['address.street']}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="address.city">
                                    City <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address.city"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    placeholder="New York"
                                    className={errors['address.city'] ? 'error' : ''}
                                />
                                {errors['address.city'] && <span className="error-message">{errors['address.city']}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="address.state">
                                    State/Province <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address.state"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    placeholder="NY"
                                    className={errors['address.state'] ? 'error' : ''}
                                />
                                {errors['address.state'] && <span className="error-message">{errors['address.state']}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="address.country">
                                    Country <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address.country"
                                    name="address.country"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    placeholder="United States"
                                    className={errors['address.country'] ? 'error' : ''}
                                />
                                {errors['address.country'] && <span className="error-message">{errors['address.country']}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="address.zipCode">
                                    Zip/Postal Code <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address.zipCode"
                                    name="address.zipCode"
                                    value={formData.address.zipCode}
                                    onChange={handleChange}
                                    placeholder="10001"
                                    className={errors['address.zipCode'] ? 'error' : ''}
                                />
                                {errors['address.zipCode'] && <span className="error-message">{errors['address.zipCode']}</span>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Emergency Contact */}
                {currentStep === 4 && (
                    <div className="form-step active">
                        <h2 className="step-title">
                            <i className="fa fa-phone-alt"></i> Emergency Contact
                        </h2>

                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="emergencyContact.name">
                                    Contact Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="emergencyContact.name"
                                    name="emergencyContact.name"
                                    value={formData.emergencyContact.name}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    className={errors['emergencyContact.name'] ? 'error' : ''}
                                />
                                {errors['emergencyContact.name'] && <span className="error-message">{errors['emergencyContact.name']}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="emergencyContact.relationship">
                                    Relationship <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="emergencyContact.relationship"
                                    name="emergencyContact.relationship"
                                    value={formData.emergencyContact.relationship}
                                    onChange={handleChange}
                                    placeholder="Mother, Father, Spouse, etc."
                                    className={errors['emergencyContact.relationship'] ? 'error' : ''}
                                />
                                {errors['emergencyContact.relationship'] && <span className="error-message">{errors['emergencyContact.relationship']}</span>}
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="emergencyContact.phone">
                                    Phone Number <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="emergencyContact.phone"
                                    name="emergencyContact.phone"
                                    value={formData.emergencyContact.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 987-6543"
                                    className={errors['emergencyContact.phone'] ? 'error' : ''}
                                />
                                {errors['emergencyContact.phone'] && <span className="error-message">{errors['emergencyContact.phone']}</span>}
                            </div>
                        </div>

                        <div className="form-summary">
                            <h3>Review Information</h3>
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <strong>Name:</strong>
                                    <span>{formData.fullName || 'N/A'}</span>
                                </div>
                                <div className="summary-item">
                                    <strong>Email:</strong>
                                    <span>{formData.email || 'N/A'}</span>
                                </div>
                                <div className="summary-item">
                                    <strong>Position:</strong>
                                    <span>{formData.position || 'N/A'}</span>
                                </div>
                                <div className="summary-item">
                                    <strong>Department:</strong>
                                    <span>
                                        {departments.find(d => d._id === formData.department)?.name || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn-secondary"
                        >
                            <i className="fa fa-arrow-left"></i>
                            Previous
                        </button>
                    )}

                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="btn-primary"
                        >
                            Next
                            <i className="fa fa-arrow-right"></i>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="btn-spinner"></span>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-check"></i>
                                    Add Employee
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddEmployeeForm;