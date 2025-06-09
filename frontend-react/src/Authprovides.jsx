import {useState,useContext,createContext} from 'react'
// create a context for authentication

const AuthContext = createContext();
const Authprovides = ({children}) => {
    const[isLoggedIn,setIsLoggedIn]= useState(
        !!localStorage.getItem('accesstoken')
    )

  return (
    <AuthContext.Provider value ={{isLoggedIn,setIsLoggedIn}} >
        {children}
    </AuthContext.Provider>
  )
}

export default Authprovides
export {AuthContext}
