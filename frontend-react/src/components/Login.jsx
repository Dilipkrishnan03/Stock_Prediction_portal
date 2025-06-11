import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Authprovides'
import axiosInstance from '../axiosInstance' // Use your axios instance instead of direct axios

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [errors, setError] = useState('')
  const { login } = useContext(AuthContext) // Use the login method from context

  const handleLogin = async(e) => {
    e.preventDefault();
    setLoading(true)
    setError('') // Clear previous errors

    const userdata = {
      username,
      password
    }
    
    console.log("userdata==>", userdata)
    
    try {
      // Use axiosInstance instead of direct axios, and use relative URL
      const response = await axiosInstance.post('/token/', userdata)
      
      // Use the login method from AuthContext
      login(response.data.access, response.data.refresh)
      
      console.log("Login successful");
      navigate('/dashboard')
      
    } catch(error) {
      console.error("Login error:", error)
      
      // Better error handling
      if (error.response?.data?.detail) {
        setError(error.response.data.detail)
      } else if (error.response?.status === 401) {
        setError('Invalid username or password')
      } else {
        setError('Login failed. Please try again.')
      }
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 bg-light-dark p-5 rounded'>
            <h3 className='text-light text-center mb-4' style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Login to the portal
            </h3>
            <form onSubmit={handleLogin}>
              <div className='mb-3'>
                <input 
                  type='text' 
                  className='form-control' 
                  placeholder='Username' 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className='mb-3'>
                <input 
                  type='password' 
                  className='form-control' 
                  placeholder='Password' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {errors && <div className='text-danger mb-3'>{errors}</div>}
              {loading ? (
                <button type='submit' className='btn btn-info d-block mx-auto' disabled>
                  <FontAwesomeIcon icon={faSpinner} spin className='me-2'/>
                  Logging in...
                </button>
              ) : (
                <button type='submit' className='btn btn-danger d-block mx-auto'>
                  Login
                </button>
              )}
            </form> 
          </div>
        </div>
      </div>
    </>
  )
}

export default Login