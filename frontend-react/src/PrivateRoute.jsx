import { useContext } from 'react'
import { AuthContext } from './Authprovides'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return isLoggedIn ? children : <Navigate to='/login' replace />;
}

export default PrivateRoute;