import React, { useState, useEffect } from 'react';
import './landingpage.css';
import { Link, useNavigate } from 'react-router-dom';
import Studentinfo from '../components/studentinfo';
import background from '../assets/testing.png';
import Logo from '../assets/logo.png';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, null, window.location.pathname);
    };

    preventBack(); // Call initially to set the initial state

    const handleUnload = () => {
      // You can add cleanup logic here if needed
    };

    window.addEventListener('popstate', preventBack);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('popstate', preventBack);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const handleScanBtnClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    setEmailError('');
    setPasswordError('');
    setLoginError('');

    try {
      if (!email && !password) {
        setEmailError('Email is required');
        setPasswordError('Password is required');
        return;
      }

      if (!email) {
        setEmailError('Email is required');
        return;
      }

      if (!password) {
        setPasswordError('Password is required');
        return;
      }

      if (email === 'admin' && password === 'admin123') {
        // Redirect to admin home page
        navigate('/home');
      } else {
        setLoginError('Invalid email or password');
        toast.error('Invalid email or password'); // Display a Toastify notification
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setLoginError('Invalid email or password');
      toast.error('Invalid email or password'); // Display a Toastify notification
    }
  };

  return (
    <div className='maincontainer'>
      <div className='scan-btn-div'>
      <button className='scanbtn' onClick={handleScanBtnClick}>
          Scan 
        </button>
      </div>
      <img src={Logo} alt="logo" className='logo-container'/>
      <img src={background} alt="background" className='imagecontainer'/>
      <div className="text-overlay">
        <p>Francisco P. Tolentino Integrated High School</p>
      </div>
      <div className="text-overlay-2">
        <p>"Leading the future through faith, character, and truth."</p>
      </div>
      <div className="login-box">
        <p>WELCOME</p>
        <form onSubmit={handleLoginFormSubmit}>
          <div className="user-box">
            <input className="input" name="email" placeholder="Email" type="text" />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="user-box">
            <input className="input" name="password" placeholder="Password" type="password" />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <div className='submitbtncontainer'>
            <button className='logintbtn' type='submit'>
              Log in
            </button>
          </div>
        </form>
        
      </div>
      <ToastContainer />
      {showModal && <Studentinfo onClose={handleCloseModal} />}
    </div>
  );
}

export default LandingPage;
