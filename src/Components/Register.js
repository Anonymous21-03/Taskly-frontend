import React, { useState } from 'react'
import API from '../services/api'
import './Register.css'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const userData = { name, email, password };
    console.log('Attempting registration with:', userData);
    
    try {
      console.log('API URL:', process.env.REACT_APP_API_URL);
      const response = await API.post('/users/register', userData);
      console.log('Registration response:', response);
      
      alert("User Created Successfully!")
      navigate('/login')
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data
      });
      setError(
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>

          <div className="login-redirect">
            Already have an account?{' '}
            <button 
              type="button" 
              className="login-link"
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register