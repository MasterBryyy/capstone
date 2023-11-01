import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Attendance.css';

function ManageAttendance() {
  const navigate = useNavigate();
  const [selectedGradeLevel, setSelectedGradeLevel] = useState(''); // State to store selected grade level
  const [selectedSection, setSelectedSection] = useState(''); // State to store selected section

  // Your student data
  const [students, setStudents] = useState([
    { studentNumber: '001', name: 'John Doe', contactNumber: '123-456-7890', presentTime: ' ', extiTime: ' ', gradeLevel: '10', section: 'A' },
    { studentNumber: '002', name: 'Jane Doe', contactNumber: '987-654-3210', present: false, exit: false, gradeLevel: '11', section: 'B' },
    { studentNumber: '003', name: 'Ivan', contactNumber: '696969', present: false, exit: false, gradeLevel: '12', section: 'C' },
  ]);
  const handleTimeChange = (index, field, value) => {
    setStudents((prevStudents) =>
      prevStudents.map((student, i) =>
        i === index ? { ...student, [field]: value } : student
      )
    );
  };

  const handleToggleAttendance = (index) => {
    // Your existing logic
  };

  const handleToggleExit = (index) => {
    // Your existing logic
  };

  const handleReport = () => {
    // Your existing logic
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
          <option value='A'>Section A</option>
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
              <th>Student Number</th>
              <th>Name</th>
              <th>Grade Level</th>
              <th>Section</th>
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
                  <td>{student.studentNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.gradeLevel}</td>
                  <td>{student.section}</td>
                  <td>
                    <input
                      type='time'
                      value={student.presentTime}
                      onChange={(e) => handleTimeChange(index,'presentTime', e.targe.value )}
                    />
                  </td>
                  <td>
                    <input
                      type='time'
                      value={student.exitTime}
                      onChange={(e) => handleTimeChange(index,'exitTime', e.targe.value )}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageAttendance;
