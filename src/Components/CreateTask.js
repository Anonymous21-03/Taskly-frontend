import React, { useState } from 'react'
import API from '../services/api'
import './createTask.css'

function CreateTask ({ onTaskCreated }) {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [priority, setPriority] = useState(1)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await API.post('/tasks', {
        title,
        startTime,
        endTime,
        priority: Number(priority)
      })

      setTitle('')
      setStartTime('')
      setEndTime('')
      setPriority(1)

      if (onTaskCreated) onTaskCreated(response.data)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Error creating task. Please try again.'
      )
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
  )
}

export default CreateTask