import React,{use, useState} from 'react'
import axios from 'axios'
import { data } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const register = () => {
  const [username,setUsername] = useState('')
  const [email,setEmail]=useState('')
  const [password,setpassword]=useState('')
  const [errors,setErrors]=useState('')
  const [success,setSuccess]=useState(false)
  const [loading,setLoading]=useState(false)



  const handleregistration = async (e) => {
    e.preventDefault();
    setLoading(true)
    const userdata={
      username,email,password
    }
    try{
      const response= await axios.post('http://127.0.0.1:8000/api/v1/register/',userdata)
      console.log("response.data==>",response.data)
      console.log("Registration successful");
      setErrors({})
      setSuccess(true)
  
    }catch(error){
      setErrors(error.response.data)
      console.error("Registration error", error.response.data);

    }finally{
      setLoading(false)
    }

  }
  return (
    <>
      <div className='container '>
        <div className='row justify-content-center'>
          <div className='col-md-6 bg-light-dark p-5 rounded'>
            <h3 className='text-light text-center mb-4'>Create an Account</h3>
            <form onSubmit={handleregistration}>
              <div className='mb-3'>
                <input type='text' className='form-control ' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <small>{errors.username && <div className='text-danger'>{errors.username }</div>}</small>
              </div>
              <div className='mb-3'>
                 <input type='email' className='form-control ' placeholder='Email' value={email} onChange={(e) =>setEmail(e.target.value)}/> 
              </div>
              
             <div className='mb-3'>
               <input type='password' className='form-control ' placeholder='Password' value={password} onChange={(e) => setpassword(e.target.value)}/>
               <small>{errors.password && <div className='text-danger'>{errors.password }</div>}</small>
             </div>
             {success && <div className="alert alert-success" >Registered Successfully</div>}
             {loading ? (
              <button type='submit' className='btn btn-info d-block mx-auto'><FontAwesomeIcon icon={faSpinner} spin/>Please Wait..</button>
             ):(
             <button type='submit' className='btn btn-info d-block mx-auto'>Register</button>
             )}
          
            </form> 
          </div>
        </div>
      </div>
    </>
  )
}

export default register
