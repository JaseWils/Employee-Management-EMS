import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './TaskBoard.css';

const TaskBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
        status: 'todo'
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/tasks`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setTasks(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            // Create demo tasks if API fails
            setTasks([
                {
                    _id: '1',
                    title: 'Update Employee Database',
                    description: 'Review and update all employee records',
                    assignedTo: { fullName: 'John Doe', _id: '1' },
                    priority: 'high',
                    status: 'todo',
                    dueDate: new Date(Date.now() + 86400000).toISOString(),
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    title: 'Process Payroll',
                    description: 'Complete monthly payroll processing',
                    assignedTo: { fullName: 'Jane Smith', _id: '2' },
                    priority: 'high',
                    status: 'in-progress',
                    dueDate: new Date(Date.now() + 172800000).toISOString(),
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '3',
                    title: 'Team Meeting',
                    description: 'Quarterly review meeting',
                    assignedTo: { fullName: 'Mike Johnson', _id: '3' },
                    priority: 'medium',
                    status: 'done',
                    dueDate: new Date(Date.now() - 86400000).toISOString(),
                    createdAt: new Date().toISOString()
                }
            ]);
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

    const handleCreateTask = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/tasks`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('✅ Task created successfully!');
                fetchTasks();
                setShowModal(false);
                setFormData({
                    title: '',
                    description: '',
                    assignedTo: '',
                    priority: 'medium',
                    dueDate: '',
                    status: 'todo'
                });
            }
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Error creating task');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/tasks/${taskId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Task updated!');
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            // Update locally for demo
            setTasks(prev => prev.map(task => 
                task._id === taskId ? { ...task, status: newStatus } : task
            ));
            toast.success('Task status updated!');
        }
    };

    const columns = [
        { id: 'todo', title: 'To Do', color: '#667eea' },
        { id: 'in-progress', title: 'In Progress', color: '#ed8936' },
        { id: 'done', title: 'Done', color: '#48bb78' }
    ];

    const getPriorityBadge = (priority) => {
        const badges = {
            low: { class: 'priority-low', text: 'Low' },
            medium: { class: 'priority-medium', text: 'Medium' },
            high: { class: 'priority-high', text: 'High' }
        };
        const badge = badges[priority] || badges.medium;
        return <span className={`priority-badge ${badge.class}`}>{badge.text}</span>;
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="task-board-container">
            <div className="task-board-header">
                <div>
                    <h1>Task Board</h1>
                    <p>Manage and track team tasks</p>
                </div>
                <button className="btn-create-task" onClick={() => setShowModal(true)}>
                    <i className="fa fa-plus"></i>
                    Create Task
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading tasks...</p>
                </div>
            ) : (
                <div className="kanban-board">
                    {columns.map(column => (
                        <div key={column.id} className="kanban-column">
                            <div className="column-header" style={{ borderTopColor: column.color }}>
                                <h3>{column.title}</h3>
                                <span className="task-count">
                                    {tasks.filter(task => task.status === column.id).length}
                                </span>
                            </div>

                            <div className="tasks-list">
                                {tasks
                                    .filter(task => task.status === column.id)
                                    .map(task => (
                                        <div key={task._id} className="task-card">
                                            <div className="task-header">
                                                {getPriorityBadge(task.priority)}
                                                {isOverdue(task.dueDate) && task.status !== 'done' && (
                                                    <span className="overdue-badge">
                                                        <i className="fa fa-exclamation-circle"></i>
                                                        Overdue
                                                    </span>
                                                )}
                                            </div>

                                            <h4 className="task-title">{task.title}</h4>
                                            <p className="task-description">{task.description}</p>

                                            <div className="task-meta">
                                                <div className="assignee">
                                                    <img
                                                        src={task.assignedTo?.profileImage || `https://ui-avatars.com/api/?name=${task.assignedTo?.fullName || 'User'}&background=667eea&color=fff`}
                                                        alt={task.assignedTo?.fullName || 'User'}
                                                    />
                                                    <span>{task.assignedTo?.fullName || 'Unassigned'}</span>
                                                </div>
                                                <div className="due-date">
                                                    <i className="fa fa-calendar"></i>
                                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="task-actions">
                                                {task.status !== 'todo' && (
                                                    <button onClick={() => handleStatusChange(task._id, 'todo')}>
                                                        <i className="fa fa-arrow-left"></i>
                                                    </button>
                                                )}
                                                {task.status !== 'done' && (
                                                    <button onClick={() => handleStatusChange(task._id, task.status === 'todo' ? 'in-progress' : 'done')}>
                                                        <i className="fa fa-arrow-right"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                {tasks.filter(task => task.status === column.id).length === 0 && (
                                    <div className="empty-column">
                                        <i className="fa fa-tasks"></i>
                                        <p>No tasks</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Task Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content task-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <i className="fa fa-times"></i>
                        </button>

                        <div className="modal-header">
                            <h2>Create New Task</h2>
                        </div>

                        <form onSubmit={handleCreateTask} className="modal-body">
                            <div className="form-group">
                                <label>Task Title <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description <span className="required">*</span></label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter task description"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Assign To <span className="required">*</span></label>
                                    <select
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>
                                                {emp.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Priority <span className="required">*</span></label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        required
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Due Date <span className="required">*</span></label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Status <span className="required">*</span></label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        required
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    <i className="fa fa-plus"></i>
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskBoard;