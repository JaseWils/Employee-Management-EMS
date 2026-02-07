import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DocumentUpload.css';

const DocumentUpload = ({ employeeId, onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        documentType: '',
        description: '',
        expiryDate: '',
        tags: '',
        isPublic: false
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const documentTypes = [
        { value: 'contract', label: 'Employment Contract' },
        { value: 'id_proof', label: 'ID Proof' },
        { value: 'address_proof', label: 'Address Proof' },
        { value: 'educational_certificate', label: 'Educational Certificate' },
        { value: 'experience_letter', label: 'Experience Letter' },
        { value: 'medical_certificate', label: 'Medical Certificate' },
        { value: 'tax_document', label: 'Tax Document' },
        { value: 'nda', label: 'NDA' },
        { value: 'offer_letter', label: 'Offer Letter' },
        { value: 'resignation', label: 'Resignation' },
        { value: 'other', label: 'Other' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        // Validate file
        if (selectedFile) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            
            if (selectedFile.size > maxSize) {
                toast.error('File size exceeds 10MB limit');
                return;
            }
            
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error('Only PDF, JPG, and PNG files are allowed');
                return;
            }
            
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        setUploading(true);
        setProgress(0);

        const uploadData = new FormData();
        uploadData.append('document', file);
        uploadData.append('employeeId', employeeId);
        Object.keys(formData).forEach(key => {
            uploadData.append(key, formData[key]);
        });

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/documents/upload`,
                uploadData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    }
                }
            );

            if (response.data.success) {
                toast.success('✅ Document uploaded successfully!');
                
                // Reset form
                setFormData({
                    title: '',
                    documentType: '',
                    description: '',
                    expiryDate: '',
                    tags: '',
                    isPublic: false
                });
                setFile(null);
                setProgress(0);
                
                if (onUploadSuccess) {
                    onUploadSuccess(response.data.data);
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            if (error.response?.status === 503) {
                toast.error('⚠️ Document upload service is not configured. Please contact administrator.');
            } else {
                toast.error(error.response?.data?.message || 'Error uploading document');
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="document-upload-container">
            <h3>
                <i className="fa fa-upload"></i> Upload Document
            </h3>

            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="title">
                            Document Title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter document title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="documentType">
                            Document Type <span className="required">*</span>
                        </label>
                        <select
                            id="documentType"
                            name="documentType"
                            value={formData.documentType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            {documentTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Add notes or description"
                        rows="3"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date (if applicable)</label>
                        <input
                            type="date"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags (comma separated)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g., important, verified"
                        />
                    </div>
                </div>

                <div className="form-group file-input-group">
                    <label htmlFor="file">
                        Choose File <span className="required">*</span>
                    </label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                        />
                        <label htmlFor="file" className="file-input-label">
                            <i className="fa fa-paperclip"></i>
                            {file ? file.name : 'Select file (PDF, JPG, PNG - Max 10MB)'}
                        </label>
                        {file && (
                            <button
                                type="button"
                                className="clear-file-btn"
                                onClick={() => setFile(null)}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        )}
                    </div>
                    {file && (
                        <div className="file-info">
                            <span>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    )}
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                        />
                        <span>Make this document publicly accessible</span>
                    </label>
                </div>

                {uploading && (
                    <div className="upload-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                            >
                                {progress}%
                            </div>
                        </div>
                        <p>Uploading... Please wait</p>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-upload"
                        disabled={uploading || !file}
                    >
                        {uploading ? (
                            <>
                                <div className="btn-spinner"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <i className="fa fa-cloud-upload-alt"></i>
                                Upload Document
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentUpload;