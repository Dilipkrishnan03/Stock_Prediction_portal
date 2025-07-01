import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './assets/css/style.css'
import Register from './components/Register'
import Main from './components/Main'
import Headers from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import Profile from './components/Profile'
import Authprovides from './Authprovides'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

function App() {
  return (
    <>
    <Authprovides>
    <BrowserRouter>
    <Headers />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    <Footer />
    </BrowserRouter>
    </Authprovides>
    </>
  )
}

export default App