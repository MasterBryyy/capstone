import React from "react";
import {Link} from 'react-router-dom'
import './LogoutForm.css'
const LogoutForm = ({ handleLogout }) => {
  return (
    <div className="logout-form">
      <div className="logoutheader-container">
      <h3 className="logout-header">Are you sure you want to logout?</h3>
      </div>
      
      <div className="link-container">
      <Link to='/' onClick={() => handleLogout(true)} className="yes-link">Yes</Link>
      <Link onClick={() => handleLogout(false)} className="no-link">No</Link>
      </div>
      
    </div>
  );
};

export default LogoutForm;