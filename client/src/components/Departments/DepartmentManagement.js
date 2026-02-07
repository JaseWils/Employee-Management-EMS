import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DepartmentManagement.css';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        head: ''
    });
    const [currentDept, setCurrentDept] = useState(null);

    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/get-dept`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setDepartments(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Error loading departments');
        } finally {
            setLoading(false);
        }
    };

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
        }
    };

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setEditMode(true);
            setCurrentDept(dept);
            setFormData({
                name: dept.name,
                description: dept.description || '',
                head: dept.head?._id || ''
            });
        } else {
            setEditMode(false);
            setCurrentDept(null);
            setFormData({
                name: '',
                description: '',
                head: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            if (editMode) {
                await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/v1/edit-dept/${currentDept._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Department updated successfully!');
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/v1/add-dept`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Department created successfully!');
            }

            fetchDepartments();
            setShowModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving department');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this department?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/v1/delete-dept/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Department deleted successfully!');
            fetchDepartments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting department');
        }
    };

    return (
        <div className="department-management-container">
            <div className="dept-header">
                <div>
                    <h1><i className="fa fa-building"></i> Department Management</h1>
                    <p>Manage company departments and their heads</p>
                </div>
                <button className="btn-add-dept" onClick={() => handleOpenModal()}>
                    <i className="fa fa-plus"></i>
                    Add Department
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading departments...</p>
                </div>
            ) : departments.length === 0 ? (
                <div className="empty-state">
                    <i className="fa fa-building"></i>
                    <h3>No Departments</h3>
                    <p>Create your first department to get started</p>
                    <button className="btn-add-dept" onClick={() => handleOpenModal()}>
                        <i className="fa fa-plus"></i>
                        Add Department
                    </button>
                </div>
            ) : (
                <div className="departments-grid">
                    {departments.map(dept => (
                        <div key={dept._id} className="department-card">
                            <div className="dept-card-header">
                                <div className="dept-icon">
                                    <i className="fa fa-building"></i>
                                </div>
                                <div className="dept-actions">
                                    <button className="btn-icon" onClick={() => handleOpenModal(dept)}>
                                        <i className="fa fa-edit"></i>
                                    </button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(dept._id)}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="dept-info">
                                <h3>{dept.name}</h3>
                                <p className="dept-description">{dept.description || 'No description'}</p>
                            </div>

                            <div className="dept-stats">
                                <div className="stat-item">
                                    <i className="fa fa-users"></i>
                                    <span>{dept.employeeCount || 0} Employees</span>
                                </div>
                            </div>

                            {dept.head && (
                                <div className="dept-head">
                                    <img
                                        src={dept.head.profileImage || `https://ui-avatars.com/api/?name=${dept.head.fullName}&background=667eea&color=fff`}
                                        alt={dept.head.fullName}
                                    />
                                    <div>
                                        <strong>Department Head</strong>
                                        <p>{dept.head.fullName}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <i className="fa fa-times"></i>
                        </button>

                        <div className="modal-header">
                            <h2>{editMode ? 'Edit Department' : 'Add Department'}</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label>Department Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Information Technology"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the department"
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Department Head</label>
                                <select
                                    value={formData.head}
                                    onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                >
                                    <option value="">Select Department Head</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.fullName} - {emp.position}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    {editMode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;