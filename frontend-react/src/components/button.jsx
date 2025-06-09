import React from 'react'
import { Link } from 'react-router-dom'

const button = (props) => {
  return (
    <>
        <Link className={`btn ${props.class}`} to={props.url}>{props.text}</Link>
    </>
   
  )
}

export default button
