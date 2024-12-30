import React, { useState, useEffect } from 'react';
import API from '../services/api';
import CreateTask from './CreateTask';
import NavBar from './NavBar';
import './tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('startTime');
  const [order, setOrder] = useState('asc');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please login again.');
      return;
    }
    fetchTasks();
  }, [status, priority, sortBy, order]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      let url = '/tasks?';
      if (status) url += `status=${status}&`;
      if (priority) url += `priority=${priority}&`;
      if (sortBy) url += `sortBy=${sortBy}&order=${order}`;

      const response = await API.get(url);
      setTasks(response.data);
      setError('');
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        setError(error.response?.data?.message || 'Error fetching tasks');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      const currentTime = new Date().toISOString();
      await API.put(`/tasks/${taskId}`, { 
        status: newStatus,
        endTime: currentTime 
      });
      fetchTasks();
    } catch (error) {
      setError('Error updating task: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      setError('Error deleting task: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  const formatLocalDateTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString();
  };

  return (
    <div>
      <NavBar />
      <div className="tasks-container">
        <CreateTask onTaskCreated={() => fetchTasks()} />
        {/* ... filters section remains the same ... */}

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading-message">Loading tasks...</div>
        ) : (
          <div className="tasks-list">
            {tasks.length === 0 ? (
              <div className="no-tasks-message">No tasks found</div>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="task-card">
                  <h4 className="task-title">{task.title}</h4>
                  <p className="task-detail">Priority: {task.priority}</p>
                  <p className="task-detail">Status: {task.status}</p>
                  <p className="task-detail">
                    Start: {formatLocalDateTime(task.startTime)}
                  </p>
                  <p className="task-detail">
                    End: {formatLocalDateTime(task.endTime)}
                  </p>
                  {task.status === 'pending' && (
                    <button
                      className="task-action-button"
                      onClick={() => handleTaskUpdate(task._id, 'completed')}
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    className="task-action-button task-delete-button"
                    onClick={() => handleTaskDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;
