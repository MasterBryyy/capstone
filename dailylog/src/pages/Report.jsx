
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Report.css';
import { db } from '../Config/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns'; // Import the format function from date-fns

const Report = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ensure a default date is set
const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
const [selectedSection, setSelectedSection] = useState(''); // Ensure a default section is set
  const [students, setStudents] = useState([]);

  useEffect(() => {
    console.log('Effect triggered');
    const fetchData = async () => {
      try {
        const qrscannedCollection = collection(db, 'qrscanned');
        const snapshot = await getDocs(qrscannedCollection);
  
        const scannedData = snapshot.docs
  .map(doc => doc.data())
  .filter(student =>
    !selectedDate ||
    (student.scannedDate && format(new Date(selectedDate), 'MM/dd/yyyy') === format(new Date(student.scannedDate), 'MM/dd/yyyy'))
  );
  
          
          scannedData.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(scannedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData(); 
  }, [selectedDate, selectedGradeLevel, selectedSection]);


  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleGradeLevelChange = (e) => {
    setSelectedGradeLevel(e.target.value);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handlePrint = () => {
    console.log('Generating report...');
    window.print();
  };

  return (
    <div className="report-container">
      <h1>Student Report</h1>
      <div className="filter-container">
        <label>Select Date:</label>
        <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat={"yyyy-MM-dd"} />

        <label>Select Grade Level:</label>
        <select value={selectedGradeLevel} onChange={handleGradeLevelChange}>
          <option value=''>All</option>
          <option value='10'>Grade 10</option>
          <option value='11'>Grade 11</option>
          <option value='12'>Grade 12</option>
        </select>

        <label>Select Section:</label>
        <select value={selectedSection} onChange={handleSectionChange}>
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
            <th>Student No</th>
            <th>Name</th>
            <th>Contact No</th>
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
                <td>{student.studentNo}</td>
                <td>{student.name}</td>
                <td>{student.contactNo}</td>
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

