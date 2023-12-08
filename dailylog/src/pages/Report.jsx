import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Report.css';
import { db } from '../Config/firestore';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
const Report = () => {


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');


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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Add logic to update calendar based on the selected date
  };

  const handleGradeLevelChange = (e) => {
    setSelectedGradeLevel(e.target.value);
    console.log('Selected Grade Level:', selectedGradeLevel);
    // Add logic to update calendar based on the selected grade level
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    console.log('Selected Section:', selectedSection);
    // Add logic to update calendar based on the selected section
  };

  const handlePrint = () => {
    // Add logic to print the attendance for the specific date, grade level, and section
    console.log('Generating report...');
    // Your print logic here
    window.print();
  };

  return (
    <div className="report-container">
      <h1>Student Report</h1>
      <div className="filter-container">
        <label>Select Date:</label>
        <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat={"yyyy-MM-dd"}/>
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
      </div>

      <div className="button-container">
        <button className="print-button" onClick={handlePrint}>
          Print Attendance
        </button>
      </div>

      <table className="report-table">
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
  );
};

export default Report;
