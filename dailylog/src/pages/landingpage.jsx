import React, { useState } from 'react';
import './landingpage.css';
import { Link } from 'react-router-dom';
import background from '../assets/testing.png'
import Logo from '../assets/logo.png'
function LandingPage() {
  const [showForm, setShowForm] = useState(true);

  return (
    <div className='maincontainer'>
      <img src={Logo} alt="logo" className='logo-container'/>
      <img src={background} alt="background" className='imagecontainer'/>
      < div className="text-overlay">
     <p>Francisco P. Tolentino Integrated High School</p>
      <div className="text-overlay-2">
    <p>"Leading the future through faith, character, and truth."</p>
  </div>
  </div>
      <div className="login-box">
        <p>WELCOME</p>
        <form>
          <div className="user-box">
            <input required="" name="" type="text" />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input required="" name="" type="password" />
            <label>Password</label>
          </div>
          <div className='submitbtncontainer'>
          <Link to="/home" className="submit-button">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Log in
          </Link>
          </div>
          
        </form>
        <p>Don't have an account? <a href="" className="a2">Sign up!</a></p>
      </div>
    </div>
  );
}

export default LandingPage;
