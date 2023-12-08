import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Attendance.css';
import { db } from '../Config/firestore';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';

function ManageAttendance() {
  const navigate = useNavigate();
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const qrscannedCollection = collection(db, 'qrscanned');
        const snapshot = await getDocs(qrscannedCollection);

        const scannedData = snapshot.docs.map(doc => doc.data());
        setStudents(scannedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount
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
        <label>Select Grade Level:</label>
        <select value={selectedGradeLevel} onChange={(e) => setSelectedGradeLevel(e.target.value)}>
          <option value=''>All</option>
          <option value='10'>Grade 10</option>
          <option value='11'>Grade 11</option>
          <option value='12'>Grade 12</option>
        </select>

        <label>Select Section:</label>
        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
          <option value=''>All</option>
          <option value='Mapagmahal'>Mapagmahal</option>
          <option value='B'>Section B</option>
          <option value='C'>Section C</option>
        </select>

        <button className='report-button' onClick={handleReport}>
          Generate Report
        </button>
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Contact No</th>
              <th>Name</th>
              <th>Student No</th>
              <th>Section</th>
              <th>Grade Level</th>
              <th>Time In</th>
              <th>Time Out</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter(
                (student) =>
                  (!selectedGradeLevel || student.gradeLevel === selectedGradeLevel) &&
                  (!selectedSection || student.section === selectedSection)
              )
              .map((student, index) => (
                <tr key={index}>
                  <td>{student.contactNo}</td>
                  <td>{student.name}</td>
                  <td>{student.studentNo}</td>
                  <td>{student.section}</td>
                  <td>{student.gradeLevel}</td>
                  <td>{student.timeIn}</td>
                  <td>{student.timeOut}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageAttendance;
