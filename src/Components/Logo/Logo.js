import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css'
import brain from './brain.jpg'


const Logo = () => {
  return (
  <div className='ma4 mt0'>
    <Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 100, width: 100 }} >
    <div className="Tilt-inner">
      <img style={{paddingTop: '10px'}}src={brain} alt='logo' height='75'/>
    </div>
    </Tilt>
  </div>
  )
}

export default Logo;