import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DocumentList.css';

const DocumentList = ({ employeeId }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        documentType: '',
        status: '',
        search: ''
    });
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, [filters]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/documents${employeeId ? `/${employeeId}` : ''}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: filters
                }
            );
            setDocuments(response.data.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Error loading documents');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/v1/documents/${documentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success('Document deleted successfully');
            fetchDocuments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting document');
        }
    };

    const handleVerify = async (documentId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/documents/${documentId}/verify`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(`Document ${status}`);
            fetchDocuments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error verifying document');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { color: '#ff9800', icon: 'clock', text: 'Pending' },
            approved: { color: '#4caf50', icon: 'check-circle', text: 'Approved' },
            rejected: { color: '#f44336', icon: 'times-circle', text: 'Rejected' },
            expired: { color: '#9e9e9e', icon: 'exclamation-triangle', text: 'Expired' }
        };
        const badge = badges[status] || badges.pending;
        
        return (
            <span className="status-badge" style={{ background: badge.color }}>
                <i className={`fa fa-${badge.icon}`}></i>
                {badge.text}
            </span>
        );
    };

    const getFileIcon = (fileType) => {
        if (fileType?.includes('pdf')) return 'file-pdf';
        if (fileType?.includes('image')) return 'file-image';
        if (fileType?.includes('word')) return 'file-word';
        return 'file-alt';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const isExpiringSoon = (expiryDate) => {
        if (!expiryDate) return false;
        const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    return (
        <div className="document-list-container">
            <div className="document-header">
                <h3>
                    <i className="fa fa-folder-open"></i> Documents
                </h3>
                
                <div className="document-filters">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="search-input"
                    />
                    
                    <select
                        value={filters.documentType}
                        onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Types</option>
                        <option value="contract">Contract</option>
                        <option value="id_proof">ID Proof</option>
                        <option value="educational_certificate">Certificate</option>
                        <option value="other">Other</option>
                    </select>
                    
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading documents...</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="empty-state">
                    <i className="fa fa-folder-open"></i>
                    <h4>No Documents Found</h4>
                    <p>Upload your first document to get started</p>
                </div>
            ) : (
                <div className="documents-grid">
                    {documents.map(doc => (
                        <div key={doc._id} className="document-card">
                            <div className="document-icon">
                                <i className={`fa fa-${getFileIcon(doc.fileType)}`}></i>
                            </div>
                            
                            <div className="document-info">
                                <h4>{doc.title}</h4>
                                <p className="document-type">{doc.documentType.replace('_', ' ')}</p>
                                
                                <div className="document-meta">
                                    <span>
                                        <i className="fa fa-calendar"></i>
                                        {formatDate(doc.uploadDate)}
                                    </span>
                                    <span>
                                        <i className="fa fa-database"></i>
                                        {formatFileSize(doc.fileSize)}
                                    </span>
                                </div>

                                {doc.expiryDate && (
                                    <div className={`expiry-info ${isExpiringSoon(doc.expiryDate) ? 'expiring-soon' : ''}`}>
                                        <i className="fa fa-hourglass-half"></i>
                                        Expires: {formatDate(doc.expiryDate)}
                                        {isExpiringSoon(doc.expiryDate) && (
                                            <span className="expiring-badge">Expiring Soon!</span>
                                        )}
                                    </div>
                                )}

                                {doc.tags && doc.tags.length > 0 && (
                                    <div className="document-tags">
                                        {doc.tags.map((tag, index) => (
                                            <span key={index} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="document-status">
                                    {getStatusBadge(doc.status)}
                                </div>
                            </div>

                            <div className="document-actions">
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-action btn-view"
                                    title="View"
                                >
                                    <i className="fa fa-eye"></i>
                                </a>
                                
                                <a
                                    href={doc.fileUrl}
                                    download
                                    className="btn-action btn-download"
                                    title="Download"
                                >
                                    <i className="fa fa-download"></i>
                                </a>

                                {doc.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleVerify(doc._id, 'approved')}
                                            className="btn-action btn-approve"
                                            title="Approve"
                                        >
                                            <i className="fa fa-check"></i>
                                        </button>
                                        <button
                                            onClick={() => handleVerify(doc._id, 'rejected')}
                                            className="btn-action btn-reject"
                                            title="Reject"
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => handleDelete(doc._id)}
                                    className="btn-action btn-delete"
                                    title="Delete"
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentList;