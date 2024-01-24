import React from 'react';
import './Home.css';
import StudentInfo from '../components/studentinfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

function Home() {
  return (
    <div className='main-home-div'>
      <StudentInfo />
    </div>
  );
}

export default Home;
