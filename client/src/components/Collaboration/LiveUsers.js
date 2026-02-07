import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import './LiveUsers.css';

const LiveUsers = () => {
    const { socket, connected } = useSocket();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if (socket) {
            socket.emit('request_online_users');

            socket.on('online_users', (users) => {
                setOnlineUsers(users);
            });

            socket.on('user_joined', (user) => {
                setOnlineUsers(prev => [...prev, user]);
            });

            socket.on('user_left', (userId) => {
                setOnlineUsers(prev => prev.filter(u => u.id !== userId));
            });

            return () => {
                socket.off('online_users');
                socket.off('user_joined');
                socket.off('user_left');
            };
        }
    }, [socket]);

    return (
        <div className="live-users">
            <div className="live-users-header">
                <h4>
                    <span className="pulse-dot"></span>
                    Online ({onlineUsers.length})
                </h4>
            </div>
            <div className="users-list">
                {onlineUsers.map(user => (
                    <div key={user.id} className="user-item">
                        <div className="user-avatar-small">
                            <img 
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=667eea&color=fff`}
                                alt={user.name}
                            />
                            <span className="status-dot online"></span>
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveUsers;