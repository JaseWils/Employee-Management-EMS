import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './TaskBoard.css';

const TaskBoard = ({ userId }) => {
    const [tasks, setTasks] = useState({
        todo: [],
        in_progress: [],
        review: [],
        completed: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [draggedTask, setDraggedTask] = useState(null);

    const columns = [
        { id: 'todo', title: 'To Do', color: '#9e9e9e', icon: 'clipboard-list' },
        { id: 'in_progress', title: 'In Progress', color: '#2196f3', icon: 'spinner' },
        { id: 'review', title: 'Review', color: '#ff9800', icon: 'eye' },
        { id: 'completed', title: 'Completed', color: '#4caf50', icon: 'check-circle' }
    ];

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/v1/tasks`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { assignedTo: userId }
                }
            );
            
            // Group tasks by status
            const grouped = {
                todo: [],
                in_progress: [],
                review: [],
                completed: []
            };
            
            response.data.data.forEach(task => {
                if (grouped[task.status]) {
                    grouped[task.status].push(task);
                }
            });
            
            setTasks(grouped);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Error loading tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e, task, status) => {
        setDraggedTask({ task, fromStatus: status });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, toStatus) => {
        e.preventDefault();
        
        if (!draggedTask || draggedTask.fromStatus === toStatus) {
            setDraggedTask(null);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${process.env.REACT_APP_API_URL}/api/v1/tasks/${draggedTask.task._id}`,
                { status: toStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Update local state
            const updatedTasks = { ...tasks };
            updatedTasks[draggedTask.fromStatus] = updatedTasks[draggedTask.fromStatus].filter(
                t => t._id !== draggedTask.task._id
            );
            updatedTasks[toStatus].push({ ...draggedTask.task, status: toStatus });
            setTasks(updatedTasks);
            
            toast.success('Task status updated');
        } catch (error) {
            toast.error('Error updating task status');
        } finally {
            setDraggedTask(null);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: '#4caf50',
            medium: '#2196f3',
            high: '#ff9800',
            urgent: '#f44336'
        };
        return colors[priority] || '#9e9e9e';
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return <span className="overdue">Overdue</span>;
        if (diffDays === 0) return <span className="today">Today</span>;
        if (diffDays === 1) return <span className="tomorrow">Tomorrow</span>;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const TaskCard = ({ task }) => (
        <div
            className="task-card"
            draggable
            onDragStart={(e) => handleDragStart(e, task, task.status)}
            onClick={() => {
                setSelectedTask(task);
                setShowTaskModal(true);
            }}
            style={{ borderLeft: `4px solid ${getPriorityColor(task.priority)}` }}
        >
            <div className="task-header">
                <h4>{task.title}</h4>
                <span className="priority-badge" style={{ background: getPriorityColor(task.priority) }}>
                    {task.priority}
                </span>
            </div>
            
            {task.description && (
                <p className="task-description">{task.description.substring(0, 80)}...</p>
            )}
            
            <div className="task-meta">
                {task.dueDate && (
                    <div className="task-due">
                        <i className="fa fa-calendar"></i>
                        {formatDate(task.dueDate)}
                    </div>
                )}
                
                {task.project && (
                    <div className="task-project">
                        <i className="fa fa-folder"></i>
                        {task.project.name}
                    </div>
                )}
            </div>
            
            {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                    {task.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="task-tag">{tag}</span>
                    ))}
                    {task.tags.length > 3 && <span className="task-tag">+{task.tags.length - 3}</span>}
                </div>
            )}
            
            {task.checklist && task.checklist.length > 0 && (
                <div className="task-progress">
                    <div className="progress-bar-small">
                        <div
                            className="progress-fill-small"
                            style={{
                                width: `${(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100}%`
                            }}
                        />
                    </div>
                    <span className="progress-text">
                        {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
                    </span>
                </div>
            )}
        </div>
    );

    return (
        <div className="task-board-container">
            <div className="board-header">
                <h2>
                    <i className="fa fa-tasks"></i> Task Board
                </h2>
                <button className="btn-add-task" onClick={() => setShowTaskModal(true)}>
                    <i className="fa fa-plus"></i> Add Task
                </button>
            </div>

            {loading ? (
                <div className="loading-board">
                    <div className="spinner"></div>
                    <p>Loading tasks...</p>
                </div>
            ) : (
                <div className="board-columns">
                    {columns.map(column => (
                        <div
                            key={column.id}
                            className="board-column"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            <div className="column-header" style={{ borderTop: `4px solid ${column.color}` }}>
                                <div className="column-title">
                                    <i className={`fa fa-${column.icon}`}></i>
                                    <h3>{column.title}</h3>
                                </div>
                                <span className="task-count">{tasks[column.id].length}</span>
                            </div>
                            
                            <div className="column-tasks">
                                {tasks[column.id].length === 0 ? (
                                    <div className="empty-column">
                                        <i className="fa fa-inbox"></i>
                                        <p>No tasks</p>
                                    </div>
                                ) : (
                                    tasks[column.id].map(task => (
                                        <TaskCard key={task._id} task={task} />
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TaskBoard;