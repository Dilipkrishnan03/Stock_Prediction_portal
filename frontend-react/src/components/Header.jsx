import { useContext } from 'react'
import Button from './button' 
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../Authprovides'

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate();
  const location = useLocation(); // Get current location/route
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    console.log("Logged out");
    navigate('/login')
  }

  // Check current page
  const isDashboardPage = location.pathname === '/dashboard';
  const isProfilePage = location.pathname === '/profile';

  return (
    <>
      <nav className='navbar container pt-3 pb-3 align-items-start'>
        <Link className='navbar-brand text-light' to="/" style={{ fontFamily: 'Georgia, serif', fontSize: '1.7rem', fontWeight: 'bold' }}>
          Stock Prediction Portal
        </Link>
        <div>
          {isLoggedIn ? (
            <>
              {/* Show Dashboard button if NOT on dashboard page */}
              {!isDashboardPage && (
                <>
                  <Button text='Dashboard' class="btn-info" url="/dashboard" />
                  &nbsp;
                </>
              )}
              {/* Show Profile button if NOT on profile page */}
              {!isProfilePage && (
                <>
                  <Button text='Profile' class="btn-outline-info" url="/profile" />
                  &nbsp;
                </>
              )}
              <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Button text='Login' class="btn-outline-info" url="/login" />
              &nbsp;
              <Button text='Register' class="btn-info" url="/register" />
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Header