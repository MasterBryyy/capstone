import React, {useState} from 'react';
import './Home.css';
import MyCalendar from '../components/MyCalendar';
import { Link } from 'react-router-dom';

function Home() {
  

  return (
    <div className='main-home-div'>
      <div className='totaldiv'>
      <div className='form-container'>
        <div className='topborder'>
        <div className='ptcontainer'>
        <p>Total enrolled</p>
        </div>  
        </div>
        <div className='pcontainer'>
        <p>3/Total enrolled</p>
        </div>        
      
      </div>
      </div>
      <MyCalendar/>
    </div>
  );
}

export default Home;
