
import './Home.css';
import StudentInfo from '../components/studentinfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr-es6';

import { db } from '../Config/firestore';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
function Home() {
  const [absentStudents, setAbsentStudents] = useState([]);
  const sendAbsentSMS = async (phoneNumber, name) => {
    if (absentStudents.length === 0) {
      console.log('No absent students to send SMS.');
      return;
    }
  
    const apiKey = '739c8cc0da929761b2b46d0cb4438cfa';
    const currentTime = new Date().toLocaleTimeString();
    for (const student of absentStudents) {
      const message = `Dear Parent, your child ${student.name} is absent from school as of: ${currentTime}`;
  
      const url = `https://api.semaphore.co/api/v4/messages?apikey=${apiKey}&number=${student.contactNumber}&message=${encodeURIComponent(
        message
      )}`;
  
      try {
        const response = await fetch(url, { method: 'POST' });
  
        if (response.ok) {
          console.log(`SMS sent successfully for ${student.name}`);
        } else {
          console.error(`Failed to send SMS for ${student.name}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error sending SMS for ${student.name}:`, error);
      }
    }
  };

  const fetchAbsentStudents = async () => {
    try {
      const userQuerySnapshot = await getDocs(collection(db, 'account'));
      const allStudents = userQuerySnapshot.docs.map(doc => doc.data());
  
      // Filter out students who have been scanned already
      const scannedStudentsQuerySnapshot = await getDocs(collection(db, 'qrscanned'));
      const scannedStudents = scannedStudentsQuerySnapshot.docs.map(doc => doc.data());
  
      const absentStudents = allStudents.filter(student => {
        // Check if the student exists in the scanned students list
        return !scannedStudents.some(scannedStudent => {
          return (
            scannedStudent.name === student.name &&
            scannedStudent.studentNo === student.studentNumber &&
            scannedStudent.section === student.section &&
            scannedStudent.contactNo === student.contactNumber &&
            scannedStudent.gradeLevel === student.gradeLevel
          );
        });
      });
  
      setAbsentStudents(absentStudents);
    } catch (error) {
      console.error('Error fetching absent students:', error);
    }
  };
  useEffect(() => {
    fetchAbsentStudents();
  }, []);
  
  return (
    <div className='main-home-div'>
      <div>


       
          <div className="student-list-modal">
            <h2>Absent Students</h2>
            <button className="send-sms-button" onClick={sendAbsentSMS}>Send sms</button>
            
            <table className="student-list-table">
              
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student No</th>
                  <th>Contact Number</th>
                  <th>Section</th>
                  <th>Grade Level</th>
                 
                  {/* Add more table headers as needed */}
                </tr>
                
              </thead>
              <tbody>
                {absentStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.studentNumber}</td>
                    <td>{student.contactNumber}</td>
                    <td>{student.section}</td>
                    <td>{student.gradeLevel}</td>
                   
                    {/* Add more table data cells as needed */}
                  </tr>
                ))}
              </tbody>
              
            </table>
          
          </div>
      
      </div>
    </div>
  );
}

export default Home;
