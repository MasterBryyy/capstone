import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import './Attendance.css';
import { db } from '../Config/firestore';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { format } from 'date-fns';

Modal.setAppElement('#root');

function ManageAttendance() {
  const navigate = useNavigate();
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [students, setStudents] = useState([]);
 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const qrscannedCollection = collection(db, 'qrscanned');
        const snapshot = await getDocs(qrscannedCollection);
    
        const selectedDateISOString = selectedDate
          ? selectedDate.toISOString().split('T')[0]
          : null;
    
          const scannedData = snapshot.docs
          .map((doc) => doc.data())
          .filter((student) => {
            const scannedDate = new Date(student.scannedDate);
        
            // Check if scannedDate is a valid date and it's defined
            if (!student.scannedDate || isNaN(scannedDate.getTime())) {
              console.warn(`Invalid date for student: ${student.name}`);
              return false; // Skip invalid or undefined dates
            }
        
            const dateCondition =
              !selectedDateISOString ||
              (scannedDate.toISOString().split('T')[0] === selectedDateISOString);
        
            const gradeLevelCondition =
              !selectedGradeLevel || selectedGradeLevel === student.gradeLevel;
        
            const sectionCondition = !selectedSection || selectedSection === student.section;
        
            return dateCondition && gradeLevelCondition && sectionCondition;
          });
    
        scannedData.sort((a, b) => {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
        });
    
        setStudents(scannedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, [selectedDate, selectedGradeLevel, selectedSection]);
  
  const handleTimeChange = (index, field, value) => {
    setStudents((prevStudents) =>
      prevStudents.map((student, i) =>
        i === index ? { ...student, [field]: value } : student
      )
    );
  };

  const handleReport = () => {
    console.log('Generating report...');
    navigate('/report');
  };

  

  return (
    <div className='main-attendance'>
      <div className='filter-container'>
        <label>Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />

        <label>Select Grade Level:</label>
        <select
          value={selectedGradeLevel}
          onChange={(e) => setSelectedGradeLevel(e.target.value)}
        >
          <option value=''>All</option>
          <option value='10'>Grade 10</option>
          <option value='11'>Grade 11</option>
          <option value='12'>Grade 12</option>
        </select>

        <label>Select Section:</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value=''>All</option>
          <option value='Mapagmahal'>Mapagmahal</option>
          <option value='B'>Section B</option>
          <option value='C'>Section C</option>
          <option value='BSIT'>BSIT</option>
        </select>


        <button className='report-button' onClick={handleReport}>
          Generate Report
        </button>
      </div>
     
     

      <div className='table-container'>
        {/* Current Attendance Table */}
        <h2>Current Attendance</h2>
        <table>
          <thead>
            <tr>
              <th>Student No</th>
              <th>Name</th>
              <th>Contact No</th>
              <th>Section</th>
              <th>Grade Level</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody> 
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.studentNo}</td>
                <td>{student.name}</td>
                <td>{student.contactNo}</td>
                <td>{student.section}</td>
                <td>{student.gradeLevel}</td>
                <td>{student.timeIn}</td>
                <td>{student.timeOut}</td>
                <td>{student.scannedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageAttendance;
