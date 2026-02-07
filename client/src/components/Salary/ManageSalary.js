import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './managesalary.css';

export default function ManageSalary() {
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [entries, setEntries] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSalaries();
    }, []);

    const fetchSalaries = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/salary/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setSalaries(response.data.data || []);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error loading salaries');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this salary record?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/v1/salary/delete/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Salary deleted');
            fetchSalaries();
        } catch (error) {
            toast.error('Error deleting salary');
        }
    };

    const filteredSalaries = salaries.filter(salary =>
        salary.employee?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "rgb(0 77 255 / 65%)" }}>
                <div className="container mt-5">
                    <NavLink className="navbar-brand" to="/" style={{ fontSize: "25px", color: "white" }}>
                        Salary
                    </NavLink>
                    <div className="mt-2 pt-2">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <NavLink to="/" className="text-dark fw-semibold text-decoration-none">
                                        Home
                                    </NavLink>
                                </li>
                                <li className="breadcrumb-item active fw-semibold text-decoration-underline" aria-current="page">
                                    Manage
                                </li>
                                <li className="breadcrumb-item">
                                    <NavLink to="/addsalary" className="text-dark fw-semibold text-decoration-none">
                                        AddSalary
                                    </NavLink>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="p-6">
                <div className="container">
                    <div className="py-4 border-bottom">
                        <h1 className="h3 mb-0">Salary Management</h1>
                        <p>Manage employee salaries and compensation</p>
                    </div>

                    <div className="p-4 bg-white rounded shadow" style={{ borderTop: "5px solid #004dffe8" }}>
                        {/* Filters */}
                        <div className="d-flex justify-content-between mb-4">
                            <div className="d-flex gap-2">
                                <label>Show</label>
                                <select
                                    className="form-select form-select-sm"
                                    value={entries}
                                    onChange={(e) => setEntries(e.target.value)}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                                <span>entries</span>
                            </div>

                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by employee name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate('/addsalary')}
                                >
                                    <i className="fa fa-plus"></i> Add Salary
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="text-center p-5">Loading...</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead className="table-secondary">
                                        <tr>
                                            <th>#</th>
                                            <th>Employee Name</th>
                                            <th>Employee ID</th>
                                            <th>Department</th>
                                            <th>Basic Salary</th>
                                            <th>Allowances</th>
                                            <th>Deductions</th>
                                            <th>Net Salary</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSalaries.slice(0, entries).map((salary, index) => {
                                            const totalAllowances = Object.values(salary.allowances || {}).reduce((sum, val) => sum + (val || 0), 0);
                                            const totalDeductions = Object.values(salary.deductions || {}).reduce((sum, val) => sum + (val || 0), 0);
                                            const netSalary = (salary.basicSalary || 0) + totalAllowances - totalDeductions;

                                            return (
                                                <tr key={salary._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{salary.employee?.fullName || 'N/A'}</td>
                                                    <td>{salary.employee?.employeeId || 'N/A'}</td>
                                                    <td>{salary.employee?.department?.name || 'N/A'}</td>
                                                    <td>${(salary.basicSalary || 0).toLocaleString()}</td>
                                                    <td>${totalAllowances.toLocaleString()}</td>
                                                    <td>${totalDeductions.toLocaleString()}</td>
                                                    <td><strong>${netSalary.toLocaleString()}</strong></td>
                                                    <td>
                                                        <button
                                                            className="badge text-bg-success mx-1 px-2"
                                                            onClick={() => navigate(`/edit-salary/${salary._id}`)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="badge text-bg-danger mx-1 px-2"
                                                            onClick={() => handleDelete(salary._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination Info */}
                        <div className="d-flex justify-content-between mt-4">
                            <span>Showing {Math.min(entries, filteredSalaries.length)} of {filteredSalaries.length} entries</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
