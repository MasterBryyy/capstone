  import React, { useState } from 'react';
  import './landingpage.css';
  import { Link, useNavigate } from 'react-router-dom';
  import Studentinfo from '../components/studentinfo';
  import background from '../assets/testing.png'
  import Logo from '../assets/logo.png'
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

  function LandingPage() {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    const handleScanBtnClick = () => {
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };
    const handleLoginForSubmit = async (e) => {
      e.preventDefault();

      const email = e.target[0].value;
      const password = e.target[1].value;

      try {
        const auth = getAuth();
        // Use signInWithEmailAndPassword to authenticate the user
        await signInWithEmailAndPassword(auth, email, password);

        // Navigate to the next page after successful authentication
        navigate('/home'); // Update with the desired route
      } catch (error) {
        // Handle authentication errors
        console.error('Authentication error:', error.code, error.message);
        // You can display an error message to the user if needed
      }
    };

  

    
    return (
      <div className='maincontainer'>
        <div className='scan-btn-div'>
          <button className='scanbtn' onClick={handleScanBtnClick}>scan</button>
        </div>


      
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
          <form onSubmit={handleLoginForSubmit}>
            <div className="user-box">
              <input required="" name="" type="text" />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input required="" name="" type="password" />
              <label>Password</label>
            </div>
            <div className='submitbtncontainer'>
            <Link className="submit-button" to="/home">
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

        {showModal && <Studentinfo onClose={handleCloseModal} />}
      </div>
    );
  }

  export default LandingPage;
