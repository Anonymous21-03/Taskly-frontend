import React, { useState } from 'react';
import API from '../services/api';
import './createTask.css';

function CreateTask({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert local datetime string to ISO string
  const toISOString = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toISOString();
  };

  // Convert ISO string to local datetime string
  const toLocalDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Format: YYYY-MM-DDThh:mm
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const validateTimes = () => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (end <= start) {
      setError('End time must be after start time');
      return false;
    }

    // Calculate duration in hours
    const duration = (end - start) / (1000 * 60 * 60);
    
    if (duration < 0.5) {
      setError('Task duration must be at least 30 minutes');
      return false;
    }

    if (duration > 168) {
      setError('Task duration cannot exceed 1 week');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateTimes()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert local times to ISO strings before sending to API
      const response = await API.post('/tasks', {
        title,
        startTime: toISOString(startTime),
        endTime: toISOString(endTime),
        priority: Number(priority)
      });

      setTitle('');
      setStartTime('');
      setEndTime('');
      setPriority(1);

      if (onTaskCreated) onTaskCreated(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Error creating task. Please try again.'
      );
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-container">
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            min={startTime}
            onChange={e => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Priority:</label>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>
                Priority {num}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}

export default CreateTask;