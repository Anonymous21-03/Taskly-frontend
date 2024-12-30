  import React from 'react'
  import { HashRouter  as Router, Route, Routes, Navigate } from 'react-router-dom'
  import Login from './Components/Login'
  import Dashboard from './Components/Dashboard'
  import Register from './Components/Register'
  import Tasks from './Components/Tasks'

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token')
    if (!token) {
      return <Navigate to="/login" />
    }
    return children
  }

  function App () {
    return (
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/tasks' element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } />
          <Route path='/' element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    )
  }
  
  export default App