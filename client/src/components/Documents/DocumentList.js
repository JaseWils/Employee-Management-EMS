import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DocumentList.css';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadData, setUploadData] = useState({
        title: '',
        type: '',
        file: null
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const employeeId = user.id;

    const documentTypes = [
        { value: 'contract', label: 'Employment Contract', icon: '📄' },
        { value: 'id', label: 'ID Document', icon: '🪪' },
        { value: 'certificate', label: 'Certificate', icon: '🎓' },
        { value: 'resume', label: 'Resume/CV', icon: '📝' },
        { value: 'other', label: 'Other', icon: '📎' }
    ];

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/documents`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setDocuments(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            // Demo documents
            setDocuments([
                {
                    _id: '1',
                    title: 'Employment Contract',
                    type: 'contract',
                    fileUrl: '#',
                    uploadedBy: { fullName: 'HR Admin' },
                    createdAt: new Date().toISOString(),
                    status: 'verified'
                },
                {
                    _id: '2',
                    title: 'ID Card',
                    type: 'id',
                    fileUrl: '#',
                    uploadedBy: { fullName: 'John Doe' },
                    createdAt: new Date().toISOString(),
                    status: 'pending'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should be less than 10MB');
                return;
            }
            setUploadData(prev => ({ ...prev, file }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!uploadData.file) {
            toast.error('Please select a file');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', uploadData.title);
            formData.append('type', uploadData.type);
            formData.append('document', uploadData.file);
            formData.append('employeeId', employeeId);

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/documents/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('✅ Document uploaded successfully!');
                fetchDocuments();
                setShowUploadModal(false);
                setUploadData({ title: '', type: '', file: null });
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            toast.error('Error uploading document');
        }
    };

    const getDocumentIcon = (type) => {
        const doc = documentTypes.find(d => d.value === type);
        return doc ? doc.icon : '📎';
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'status-pending', text: 'Pending', icon: 'clock' },
            verified: { class: 'status-verified', text: 'Verified', icon: 'check-circle' },
            rejected: { class: 'status-rejected', text: 'Rejected', icon: 'times-circle' }
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
        <div className="document-list-container">
            <div className="document-header">
                <div>
                    <h1>Documents</h1>
                    <p>Manage your documents and files</p>
                </div>
                <button className="btn-upload" onClick={() => setShowUploadModal(true)}>
                    <i className="fa fa-upload"></i>
                    Upload Document
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading documents...</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="empty-state">
                    <i className="fa fa-folder-open"></i>
                    <h3>No Documents</h3>
                    <p>Upload your first document to get started</p>
                    <button className="btn-upload" onClick={() => setShowUploadModal(true)}>
                        <i className="fa fa-upload"></i>
                        Upload Document
                    </button>
                </div>
            ) : (
                <div className="documents-grid">
                    {documents.map(doc => (
                        <div key={doc._id} className="document-card">
                            <div className="doc-icon">
                                {getDocumentIcon(doc.type)}
                            </div>

                            <div className="doc-info">
                                <h4>{doc.title}</h4>
                                <p className="doc-type">{doc.type?.toUpperCase()}</p>
                                <p className="doc-uploader">
                                    Uploaded by: {doc.uploadedBy?.fullName || 'Unknown'}
                                </p>
                                <p className="doc-date">
                                    <i className="fa fa-calendar"></i>
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {getStatusBadge(doc.status)}

                            <div className="doc-actions">
                                <button className="btn-view" onClick={() => window.open(doc.fileUrl, '_blank')}>
                                    <i className="fa fa-eye"></i>
                                    View
                                </button>
                                <button className="btn-download" onClick={() => window.open(doc.fileUrl, '_blank')}>
                                    <i className="fa fa-download"></i>
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowUploadModal(false)}>
                            <i className="fa fa-times"></i>
                        </button>

                        <div className="modal-header">
                            <h2>Upload Document</h2>
                        </div>

                        <form onSubmit={handleUpload} className="modal-body">
                            <div className="form-group">
                                <label>Document Title <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={uploadData.title}
                                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                    placeholder="Enter document title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Document Type <span className="required">*</span></label>
                                <select
                                    value={uploadData.type}
                                    onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {documentTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.icon} {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>File <span className="required">*</span></label>
                                <div className="file-upload-area">
                                    <input
                                        type="file"
                                        id="document-file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        hidden
                                        required
                                    />
                                    <label htmlFor="document-file" className="file-upload-label">
                                        <i className="fa fa-cloud-upload-alt"></i>
                                        <span>{uploadData.file ? uploadData.file.name : 'Choose File'}</span>
                                        <small>PDF, DOC, DOCX, JPG, PNG (Max 10MB)</small>
                                    </label>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowUploadModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    <i className="fa fa-upload"></i>
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentList;