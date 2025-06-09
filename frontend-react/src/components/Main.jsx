import React from 'react'
import Headers from './Header'
import Footer from './Footer'
import Button from './button'

const main = () => {
  return (
    <>
    
    <div className='container'>
        <div className='p-5 text-center bg-light-dark rounded-3'>
            <h1 className='text-light'>Stock Prediction Portal</h1>
            <p className='text-light lead'>Welcome to the Stock Prediction Portal, where you can predict stock prices using machine learning models.</p>
            <p className='text-light lead'>To get started, please login or register.</p>
            <Button text="Explore Now" class="btn-info" url="/dashboard" />
        </div>
        
    </div>
    
    </>
  )
}

export default main
