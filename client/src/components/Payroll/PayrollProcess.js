import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './PayrollProcess.css';

const PayrollProcess = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [payrollData, setPayrollData] = useState([]);

    useEffect(() => {
        fetchEmployeesAndSalaries();
    }, [selectedMonth]);

    const fetchEmployeesAndSalaries = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            const [employeesRes, salariesRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/api/v1/get-staffs`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/v1/salary/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const empData = employeesRes.data.data || [];
            const salData = salariesRes.data.data || [];

            const combined = empData.map(emp => {
                const salary = salData.find(s => s.employee?._id === emp._id);
                return {
                    ...emp,
                    salaryInfo: salary
                };
            });

            setEmployees(combined);
            calculatePayroll(combined);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Demo data
            const demoData = [
                {
                    _id: '1',
                    fullName: 'John Doe',
                    employeeId: 'EMP001',
                    department: { name: 'IT' },
                    position: 'Developer',
                    salaryInfo: {
                        basicSalary: 5000,
                        allowances: { houseRent: 1000, transport: 500, medical: 300 },
                        deductions: { tax: 500, insurance: 200 }
                    }
                },
                {
                    _id: '2',
                    fullName: 'Jane Smith',
                    employeeId: 'EMP002',
                    department: { name: 'HR' },
                    position: 'HR Manager',
                    salaryInfo: {
                        basicSalary: 6000,
                        allowances: { houseRent: 1200, transport: 600, medical: 400 },
                        deductions: { tax: 600, insurance: 250 }
                    }
                }
            ];
            setEmployees(demoData);
            calculatePayroll(demoData);
        } finally {
            setLoading(false);
        }
    };

    const calculatePayroll = (empList) => {
        const payroll = empList.map(emp => {
            if (!emp.salaryInfo) {
                return {
                    employee: emp,
                    basicSalary: 0,
                    totalAllowances: 0,
                    totalDeductions: 0,
                    netSalary: 0
                };
            }

            const basic = emp.salaryInfo.basicSalary || 0;
            const allowances = emp.salaryInfo.allowances || {};
            const deductions = emp.salaryInfo.deductions || {};

            const totalAllowances = Object.values(allowances).reduce((sum, val) => sum + (val || 0), 0);
            const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
            const netSalary = basic + totalAllowances - totalDeductions;

            return {
                employee: emp,
                basicSalary: basic,
                totalAllowances,
                totalDeductions,
                netSalary
            };
        });

        setPayrollData(payroll);
    };

    const getTotalPayroll = () => {
        return payrollData.reduce((sum, p) => sum + p.netSalary, 0);
    };

    const handleProcessPayroll = async () => {
        if (!window.confirm(`Process payroll for ${selectedMonth}? This will generate payslips for all employees.`)) {
            return;
        }

        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            
            const [year, month] = selectedMonth.split('-');
            const employeeIds = payrollData.map(p => p.employee._id);
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/payroll/generate`,
                {
                    month: parseInt(month),
                    year: parseInt(year),
                    employeeIds
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success(`✅ Payroll processed successfully! Generated ${response.data.data.length} records.`);
                // Optionally navigate to payroll list
            }
        } catch (error) {
            console.error('Payroll error:', error);
            toast.error(error.response?.data?.message || 'Error processing payroll');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="payroll-process-container">
            <div className="payroll-header">
                <div>
                    <h1><i className="fa fa-calculator"></i> Process Payroll</h1>
                    <p>Calculate and process employee salaries</p>
                </div>
                <div className="header-actions">
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="month-input"
                    />
                    <button
                        className="btn-process"
                        onClick={handleProcessPayroll}
                        disabled={processing || payrollData.length === 0}
                    >
                        {processing ? 'Processing...' : 'Process Payroll'}
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="payroll-summary">
                <div className="summary-item">
                    <div className="summary-icon blue">
                        <i className="fa fa-users"></i>
                    </div>
                    <div>
                        <h4>{payrollData.length}</h4>
                        <p>Total Employees</p>
                    </div>
                </div>
                <div className="summary-item">
                    <div className="summary-icon green">
                        <i className="fa fa-money-bill-wave"></i>
                    </div>
                    <div>
                        <h4>${getTotalPayroll().toLocaleString()}</h4>
                        <p>Total Payroll</p>
                    </div>
                </div>
                <div className="summary-item">
                    <div className="summary-icon orange">
                        <i className="fa fa-calendar"></i>
                    </div>
                    <div>
                        <h4>{new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                        <p>Pay Period</p>
                    </div>
                </div>
            </div>

            {/* Payroll Table */}
            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading payroll data...</p>
                </div>
            ) : (
                <div className="payroll-table-wrapper">
                    <table className="payroll-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>ID</th>
                                <th>Department</th>
                                <th>Basic Salary</th>
                                <th>Allowances</th>
                                <th>Deductions</th>
                                <th>Net Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrollData.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="employee-cell">
                                            <img
                                                src={item.employee.profileImage || `https://ui-avatars.com/api/?name=${item.employee.fullName}&background=667eea&color=fff`}
                                                alt={item.employee.fullName}
                                            />
                                            <div>
                                                <strong>{item.employee.fullName}</strong>
                                                <span>{item.employee.position}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><code>{item.employee.employeeId}</code></td>
                                    <td>{item.employee.department?.name || 'N/A'}</td>
                                    <td>${item.basicSalary.toLocaleString()}</td>
                                    <td className="positive">${item.totalAllowances.toLocaleString()}</td>
                                    <td className="negative">${item.totalDeductions.toLocaleString()}</td>
                                    <td>
                                        <strong className="net-salary">${item.netSalary.toLocaleString()}</strong>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="6"><strong>Total Payroll</strong></td>
                                <td><strong className="total-amount">${getTotalPayroll().toLocaleString()}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PayrollProcess;