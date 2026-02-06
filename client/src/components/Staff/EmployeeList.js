import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './EmployeeList.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    
    // Modal
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        filterAndSortEmployees();
    }, [employees, searchTerm, departmentFilter, statusFilter, sortBy]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/get-staffs`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEmployees(response.data.data || []);
        } catch (error) {
            toast.error('Error loading employees');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortEmployees = () => {
        let filtered = [...employees];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(emp =>
                emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Department filter
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(emp => emp.department?.name === departmentFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            const isActive = statusFilter === 'active';
            filtered = filtered.filter(emp => emp.isActive === isActive);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return (a.fullName || '').localeCompare(b.fullName || '');
                case 'date':
                    return new Date(b.joiningDate) - new Date(a.joiningDate);
                case 'department':
                    return (a.department?.name || '').localeCompare(b.department?.name || '');
                default:
                    return 0;
            }
        });

        setFilteredEmployees(filtered);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/v1/delete-staffs/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            toast.error('Error deleting employee');
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusBadge = (isActive) => (
        <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
            <span className="status-dot"></span>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );

    const EmployeeCard = ({ employee }) => (
        <div className="employee-card" onClick={() => {
            setSelectedEmployee(employee);
            setShowModal(true);
        }}>
            <div className="employee-card-header">
                <div className="employee-avatar">
                    <img
                        src={employee.profileImage || `https://ui-avatars.com/api/?name=${employee.fullName}&background=667eea&color=fff`}
                        alt={employee.fullName}
                    />
                    {getStatusBadge(employee.isActive)}
                </div>
                <div className="employee-actions">
                    <button
                        className="btn-action edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/edit-employee/${employee._id}`;
                        }}
                        title="Edit"
                    >
                        <i className="fa fa-edit"></i>
                    </button>
                    <button
                        className="btn-action delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(employee._id);
                        }}
                        title="Delete"
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div className="employee-card-body">
                <h3>{employee.fullName}</h3>
                <p className="employee-id">ID: {employee.employeeId}</p>
                <p className="employee-position">{employee.position || 'N/A'}</p>
                
                <div className="employee-meta">
                    <div className="meta-item">
                        <i className="fa fa-building"></i>
                        <span>{employee.department?.name || 'N/A'}</span>
                    </div>
                    <div className="meta-item">
                        <i className="fa fa-envelope"></i>
                        <span>{employee.email}</span>
                    </div>
                    <div className="meta-item">
                        <i className="fa fa-phone"></i>
                        <span>{employee.phone || 'N/A'}</span>
                    </div>
                    <div className="meta-item">
                        <i className="fa fa-calendar"></i>
                        <span>Joined {new Date(employee.joiningDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            
            <div className="employee-card-footer">
                <button className="btn-card-action">
                    <i className="fa fa-eye"></i> View Details
                </button>
            </div>
        </div>
    );

    return (
        <div className="employee-list-container">
            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1>
                        <i className="fa fa-users"></i> Employees
                    </h1>
                    <p className="subtitle">Manage your team members</p>
                </div>
                <div className="header-right">
                    <button className="btn-export">
                        <i className="fa fa-download"></i>
                        Export
                    </button>
                    <button className="btn-primary" onClick={() => window.location.href = '/add-employee'}>
                        <i className="fa fa-plus"></i>
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-row">
                <div className="stat-box">
                    <div className="stat-icon blue">
                        <i className="fa fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{employees.length}</h3>
                        <p>Total Employees</p>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon green">
                        <i className="fa fa-user-check"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{employees.filter(e => e.isActive).length}</h3>
                        <p>Active</p>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon orange">
                        <i className="fa fa-user-times"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{employees.filter(e => !e.isActive).length}</h3>
                        <p>Inactive</p>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon purple">
                        <i className="fa fa-building"></i>
                    </div>
                    <div className="stat-content">
                        <h3>{new Set(employees.map(e => e.department?.name)).size}</h3>
                        <p>Departments</p>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="filters-section">
                <div className="search-box">
                    <i className="fa fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>
                            <i className="fa fa-times"></i>
                        </button>
                    )}
                </div>

                <div className="filter-controls">
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Departments</option>
                        {[...new Set(employees.map(e => e.department?.name).filter(Boolean))].map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="date">Sort by Join Date</option>
                        <option value="department">Sort by Department</option>
                    </select>

                    <div className="view-toggle">
                        <button
                            className={viewMode === 'grid' ? 'active' : ''}
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <i className="fa fa-th"></i>
                        </button>
                        <button
                            className={viewMode === 'table' ? 'active' : ''}
                            onClick={() => setViewMode('table')}
                            title="Table View"
                        >
                            <i className="fa fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="results-info">
                <p>
                    Showing <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)}</strong> of <strong>{filteredEmployees.length}</strong> employees
                </p>
            </div>

            {/* Employee List */}
            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading employees...</p>
                </div>
            ) : filteredEmployees.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="fa fa-users"></i>
                    </div>
                    <h3>No employees found</h3>
                    <p>Try adjusting your search or filters</p>
                    <button className="btn-primary" onClick={() => window.location.href = '/add-employee'}>
                        <i className="fa fa-plus"></i>
                        Add First Employee
                    </button>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="employees-grid">
                            {currentEmployees.map(employee => (
                                <EmployeeCard key={employee._id} employee={employee} />
                            ))}
                        </div>
                    ) : (
                        <div className="employees-table-wrapper">
                            <table className="employees-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>ID</th>
                                        <th>Position</th>
                                        <th>Department</th>
                                        <th>Contact</th>
                                        <th>Join Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEmployees.map(employee => (
                                        <tr key={employee._id}>
                                            <td>
                                                <div className="table-employee">
                                                    <img
                                                        src={employee.profileImage || `https://ui-avatars.com/api/?name=${employee.fullName}&background=667eea&color=fff`}
                                                        alt={employee.fullName}
                                                    />
                                                    <div>
                                                        <strong>{employee.fullName}</strong>
                                                        <span>{employee.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><code>{employee.employeeId}</code></td>
                                            <td>{employee.position || 'N/A'}</td>
                                            <td>
                                                <span className="dept-badge">{employee.department?.name || 'N/A'}</span>
                                            </td>
                                            <td>{employee.phone || 'N/A'}</td>
                                            <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                                            <td>{getStatusBadge(employee.isActive)}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="btn-icon view"
                                                        onClick={() => {
                                                            setSelectedEmployee(employee);
                                                            setShowModal(true);
                                                        }}
                                                        title="View"
                                                    >
                                                        <i className="fa fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn-icon edit"
                                                        onClick={() => window.location.href = `/edit-employee/${employee._id}`}
                                                        title="Edit"
                                                    >
                                                        <i className="fa fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn-icon delete"
                                                        onClick={() => handleDelete(employee._id)}
                                                        title="Delete"
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                <i className="fa fa-chevron-left"></i>
                                Previous
                            </button>

                            <div className="pagination-numbers">
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => paginate(page)}
                                                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return <span key={page} className="pagination-dots">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                Next
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Employee Detail Modal */}
            {showModal && selectedEmployee && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content employee-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <i className="fa fa-times"></i>
                        </button>

                        <div className="modal-header">
                            <div className="modal-employee-info">
                                <img
                                    src={selectedEmployee.profileImage || `https://ui-avatars.com/api/?name=${selectedEmployee.fullName}&background=667eea&color=fff&size=100`}
                                    alt={selectedEmployee.fullName}
                                />
                                <div>
                                    <h2>{selectedEmployee.fullName}</h2>
                                    <p>{selectedEmployee.position || 'N/A'}</p>
                                    {getStatusBadge(selectedEmployee.isActive)}
                                </div>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Employee ID</label>
                                    <p><code>{selectedEmployee.employeeId}</code></p>
                                </div>
                                <div className="info-item">
                                    <label>Department</label>
                                    <p>{selectedEmployee.department?.name || 'N/A'}</p>
                                </div>
                                <div className="info-item">
                                    <label>Email</label>
                                    <p>{selectedEmployee.email}</p>
                                </div>
                                <div className="info-item">
                                    <label>Phone</label>
                                    <p>{selectedEmployee.phone || 'N/A'}</p>
                                </div>
                                <div className="info-item">
                                    <label>Date of Birth</label>
                                    <p>{selectedEmployee.dateOfBirth ? new Date(selectedEmployee.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="info-item">
                                    <label>Joining Date</label>
                                    <p>{new Date(selectedEmployee.joiningDate).toLocaleDateString()}</p>
                                </div>
                                <div className="info-item full-width">
                                    <label>Address</label>
                                    <p>
                                        {selectedEmployee.address ? (
                                            `${selectedEmployee.address.street}, ${selectedEmployee.address.city}, ${selectedEmployee.address.state} ${selectedEmployee.address.zipCode}, ${selectedEmployee.address.country}`
                                        ) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>
                                Close
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => window.location.href = `/edit-employee/${selectedEmployee._id}`}
                            >
                                <i className="fa fa-edit"></i>
                                Edit Employee
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;