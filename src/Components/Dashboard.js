import React, { useState, useEffect } from 'react'
import API from '../services/api'
import './dashboard.css'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completedPercentage: 0,
    pendingPercentage: 0,
    timeStats: []
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await API.get('/users/dashboard')
        setUserData(data)
        setStats(data.stats)
      } catch (err) {
        setError('Failed to fetch dashboard data')
      }
    }

    fetchDashboardData()
  }, [])

  if (error) return <div className='dashboard-error'>{error}</div>
  if (!userData) return <div className='dashboard-loading'>Loading...</div>

  return (
    <div>
      <NavBar />
      <div className='dashboard-container'>
        <div className='dashboard-card'>
          <h2 className='dashboard-title'>Welcome, {userData.name}!</h2>
          <div className='dashboard-info'>
            <div className='info-item'>
              <span className='info-label'>Email:</span>
              <span className='info-value'>{userData.email}</span>
            </div>

            <div className='stats-container'>
              <div className='stat-item'>
                <h3>Total Tasks</h3>
                <span className='stat-value'>{stats.totalTasks}</span>
              </div>
              <div className='stat-item'>
                <h3>Completed Tasks</h3>
                <span className='stat-value'>{stats.completedTasks}</span>
                <span className='stat-percentage'>({stats.completedPercentage}%)</span>
              </div>
              <div className='stat-item'>
                <h3>Pending Tasks</h3>
                <span className='stat-value'>{stats.pendingTasks}</span>
                <span className='stat-percentage'>({stats.pendingPercentage}%)</span>
              </div>
              <div className='stat-item'>
                <h3>Avg Completion Time</h3>
                <span className='stat-value'>{stats.averageCompletionTime}</span>
                <span className='stat-unit'>hrs</span>
              </div>
            </div>
            <div className='time-stats'>
              <h3>Pending Tasks by Priority</h3>
              <table className='time-stats-table'>
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Count</th>
                    <th>Time Lapsed (hrs)</th>
                    <th>Balance Time (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.timeStats.map(stat => (
                    <tr key={stat.priority}>
                      <td>P{stat.priority}</td>
                      <td>{stat.count}</td>
                      <td>{stat.timeLapsed}</td>
                      <td>{stat.balanceTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard