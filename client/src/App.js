import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

// Layout Components
import ModernSidebar from './components/Navigation/ModernSidebar';
import TopNavBar from './components/Navigation/TopNavBar';

// Dashboard
import ModernDashboard from './components/Dashboard/ModernDashboard';

// Authentication
import Login from './components/Authentication/Login';
import SignUp from './components/Authentication/SignUp';
import VerifyOTP from './components/Authentication/VerifyOTP';

// Employee Management
import AddStaff from './components/Staff/AddStaff';
import EmployeeList from './components/Staff/EmployeeList';
import ManageStaff from './components/Staff/ManageStaff';

// Department
import AddDepartment from './components/Department/AddDepartment';
import ManageDepartment from './components/Department/ManageDepartment';

// Attendance
import AttendanceTracker from './components/Attendance/AttendanceTracker';

// Leave Management
import ApplyLeave from './components/Leave/ApplyLeave';
import LeaveHistory from './components/Leave/LeaveHistory';
import StaffLeave from './components/Leave/StaffLeave';

// Salary & Payroll
import AddSalary from './components/Salary/AddSalary';
import ManageSalary from './components/Salary/ManageSalary';
import YourSalary from './components/Salary/YourSalary';

// Tasks
import TaskBoard from './components/Tasks/TaskBoard';

// Documents
import DocumentList from './components/Documents/DocumentList';
import DocumentUpload from './components/Documents/DocumentUpload';

// Analytics
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';

// Admin
import AddAdmin from './components/Admin/AddAdmin';
import ManageAdmin from './components/Admin/ManageAdmin';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
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
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#f56565',
                                secondary: '#fff',
                            },
                        },
                    }}
                />

                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <ModernDashboard />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Employee Routes */}
                    <Route
                        path="/employees"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <EmployeeList />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-employee"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <AddStaff />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manage-staff"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <ManageStaff />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Department Routes */}
                    <Route
                        path="/departments"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <ManageDepartment />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-department"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <AddDepartment />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Attendance Routes */}
                    <Route
                        path="/attendance"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <AttendanceTracker employeeId={localStorage.getItem('employeeId')} />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Leave Routes */}
                    <Route
                        path="/apply-leave"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <ApplyLeave />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leave-history"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <LeaveHistory />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leave-requests"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <StaffLeave />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Salary Routes */}
                    <Route
                        path="/salary"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <ManageSalary />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/your-salary"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <YourSalary />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-salary"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <AddSalary />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Task Routes */}
                    <Route
                        path="/tasks"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <TaskBoard userId={localStorage.getItem('userId')} />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Document Routes */}
                    <Route
                        path="/documents"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <DocumentList />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/upload-document"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <DocumentUpload employeeId={localStorage.getItem('employeeId')} />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Analytics */}
                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <AnalyticsDashboard />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/add-admin"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <AddAdmin />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manage-admin"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <ManageAdmin />
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all - 404 */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </SocketProvider>
        </Router>
    );
}

export default App;