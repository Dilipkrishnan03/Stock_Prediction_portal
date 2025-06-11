import { useState, useContext, createContext, useEffect } from 'react'

// create a context for authentication
const AuthContext = createContext();

const Authprovides = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for tokens on component mount
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (accessToken && refreshToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        
        setIsLoading(false);
    }, []);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            setIsLoggedIn, 
            login, 
            logout, 
            isLoading 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default Authprovides;
export { AuthContext };