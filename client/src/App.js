import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/dark-mode-complete.css';

// Layout Components
import ModernSidebar from './components/Navigation/ModernSidebar';
import TopNavBar from './components/Navigation/TopNavBar';

// Pages
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import AttendanceRecords from './components/Attendance/AttendanceRecords';
import AttendanceReports from './components/Attendance/AttendanceReports';
import AttendanceTracker from './components/Attendance/AttendanceTracker';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import ModernDashboard from './components/Dashboard/ModernDashboard';
import DepartmentManagement from './components/Departments/DepartmentManagement';
import DocumentList from './components/Documents/DocumentList';
import HelpCenter from './components/Help/HelpCenter';
import ApplyLeave from './components/Leave/ApplyLeave';
import LeaveHistory from './components/Leave/LeaveHistory';
import LeaveRequests from './components/Leave/LeaveRequests';
import PayrollProcess from './components/Payroll/PayrollProcess';
import Payslips from './components/Payroll/Payslips';
import Performance from './components/Performance/Performance';
import Privacy from './components/Privacy/Privacy';
import ManageSalary from './components/Salary/ManageSalary';
import Settings from './components/Settings/Settings';
import AddStaff from './components/Staff/AddStaff';
import EmployeeList from './components/Staff/EmployeeList';
import TaskBoard from './components/Tasks/TaskBoard';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Main Layout Component
const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app-container">
            <ModernSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="main-content">
                <TopNavBar toggleSidebar={toggleSidebar} />
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <ThemeProvider>
                <SocketProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#fff',
                                color: '#1a202c',
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                padding: '16px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#48bb78',
                                    secondary: '#fff',
                                }
                            },
                            error: {
                                iconTheme: {
                                    primary: '#f56565',
                                    secondary: '#fff',
                                }
                            }
                        }}
                    />

                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected Routes */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <MainLayout><ModernDashboard /></MainLayout>
                            </ProtectedRoute>
                        } />

                        {/* Employee Routes */}
                        <Route path="/employees" element={
                            <ProtectedRoute>
                                <MainLayout><EmployeeList /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/add-employee" element={
                            <ProtectedRoute>
                                <MainLayout><AddStaff /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/departments" element={
                            <ProtectedRoute>
                                <MainLayout><DepartmentManagement /></MainLayout>
                            </ProtectedRoute>
                        } />

                        {/* Attendance Routes */}
                        <Route path="/attendance" element={
                            <ProtectedRoute>
                                <MainLayout><AttendanceTracker /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/attendance-records" element={
                            <ProtectedRoute>
                                <MainLayout><AttendanceRecords /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/attendance-reports" element={
                            <ProtectedRoute>
                                <MainLayout><AttendanceReports /></MainLayout>
                            </ProtectedRoute>
                        } />

                        {/* Leave Routes */}
                        <Route path="/apply-leave" element={
                            <ProtectedRoute>
                                <MainLayout><ApplyLeave /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/leave-requests" element={
                            <ProtectedRoute>
                                <MainLayout><LeaveRequests /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/leave-history" element={
                            <ProtectedRoute>
                                <MainLayout><LeaveHistory /></MainLayout>
                            </ProtectedRoute>
                        } />

                        {/* Payroll Routes */}
                        <Route path="/salary" element={
                            <ProtectedRoute>
                                <MainLayout><ManageSalary /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/payroll-process" element={
                            <ProtectedRoute>
                                <MainLayout><PayrollProcess /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/payslips" element={
                            <ProtectedRoute>
                                <MainLayout><Payslips /></MainLayout>
                            </ProtectedRoute>
                        } />

                        {/* Other Routes */}
                        <Route path="/tasks" element={
                            <ProtectedRoute>
                                <MainLayout><TaskBoard /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/documents" element={
                            <ProtectedRoute>
                                <MainLayout><DocumentList /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/performance" element={
                            <ProtectedRoute>
                                <MainLayout><Performance /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                            <ProtectedRoute>
                                <MainLayout><AnalyticsDashboard /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <MainLayout><Settings /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/help" element={
                            <ProtectedRoute>
                                <MainLayout><HelpCenter /></MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/privacy" element={
                            <ProtectedRoute>
                                <MainLayout><Privacy /></MainLayout>
                            </ProtectedRoute>
                        } />

                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </SocketProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;