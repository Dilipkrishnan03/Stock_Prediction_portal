import React from 'react'
import Headers from './Header'
import Footer from './Footer'
import Button from './button'

const Main = () => { // Changed 'main' to 'Main' for proper React component naming convention
  return (
    <>
      <div className='container'>
        <div className='p-5 text-center bg-light-dark rounded-3'>
          <h1 className='text-light' style={{ fontFamily: 'Georgia, serif', fontSize: '2.8rem' }}>
            Stock Prediction Portal
          </h1>
          <p className='text-light lead' style={{ fontFamily: 'Georgia, serif' }}>
            Welcome to the Stock Prediction Portal, where you can predict stock prices using machine learning models.
          </p>
          <p className='text-light lead' style={{ fontFamily: 'Georgia, serif' }}>
            To get started, please login or register.
          </p>
          <Button text="Explore Now" class="btn-info" url="/dashboard" />
        </div>
      </div>
    </>
  )
}

export default Main