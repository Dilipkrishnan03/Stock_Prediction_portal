import React, { useState } from 'react'; // Removed 'use' as it's not a React hook
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// Changed component name to 'Register' (PascalCase for React components)
const Register = () => {
  const [username,setUsername] = useState('');
  const [email,setEmail]=useState('');
  const [password,setpassword]=useState('');
  const [errors,setErrors]=useState('');
  const [success,setSuccess]=useState(false);
  const [loading,setLoading]=useState(false);

  const handleregistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userdata={
      username,email,password
    };
    try{
      // It's highly recommended to use an environment variable or axiosInstance for the API URL
      const response= await axios.post('http://127.0.0.1:8000/api/v1/register/',userdata);
      console.log("response.data==>",response.data);
      console.log("Registration successful");
      setErrors({}); // Clear errors on success
      setSuccess(true);

    }catch(error){
      // Check if error.response.data exists before setting it
      setErrors(error.response && error.response.data ? error.response.data : { detail: "An unexpected error occurred." });
      console.error("Registration error", error.response ? error.response.data : error);

    }finally{
      setLoading(false);
    }
  };

  return (
    <>
      <div className='container' style={{ fontFamily: 'Georgia, serif' }}> {/* Applied Georgia font here as well */}
        <div className='row justify-content-center'>
          <div className='col-md-6 bg-light-dark p-5 rounded'>
            <h3 className='text-light text-center mb-4' style={{ fontSize: '2rem',  }}>Create an Account</h3> {/* Increased size and made bold */}
            <form onSubmit={handleregistration}>
              <div className='mb-3'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <small>{errors.username && <div className='text-danger'>{errors.username}</div>}</small>
              </div>
              <div className='mb-3'>
                <input
                  type='email'
                  className='form-control'
                  placeholder='Email'
                  value={email}
                  onChange={(e) =>setEmail(e.target.value)}
                />
                {/* Add email specific error handling if needed */}
              </div>

              <div className='mb-3'>
                <input
                  type='password'
                  className='form-control'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <small>{errors.password && <div className='text-danger'>{errors.password}</div>}</small>
              </div>
              {success && <div className="alert alert-success" role="alert">Registered Successfully</div>}
              {errors.detail && !success && <div className="alert alert-danger" role="alert">{errors.detail}</div>} {/* Display general error */}
              {loading ? (
                // Changed btn-info to btn-danger for bright red color
                <button type='submit' className='btn btn-danger d-block mx-auto' disabled>
                  <FontAwesomeIcon icon={faSpinner} spin/>Please Wait..
                </button>
              ):(
                // Changed btn-info to btn-danger for bright red color
                <button type='submit' className='btn btn-danger d-block mx-auto'>
                  Register
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;