import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Report.css';

const Report = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', presentTime: '10:00 AM', exitTime: '02:00 PM', gradeLevel: '10', section: 'A' },
    { id: 2, name: 'Jane Smith', presentTime: '09:30 AM', exitTime: '03:30 PM', gradeLevel: '11', section: 'B' },
    { id: 3, name: 'ED BESIYOS', presentTime: '07:30 AM', exitTime: '03:30 PM', gradeLevel: '11', section: 'A' },
    // Add more students as needed
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');

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
        <DatePicker selected={selectedDate} onChange={handleDateChange} />

        <label>Select Grade Level:</label>
        <select value={selectedGradeLevel} onChange={handleGradeLevelChange}>
          <option value="10">10</option>
          <option value="11">11</option>
          {/* Add more grade levels as needed */}
        </select>

        <label>Select Section:</label>
        <select value={selectedSection} onChange={handleSectionChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          {/* Add more sections as needed */}
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
            <th>Student Number</th>
            <th>Name</th>
            <th>Grade Level</th>
            <th>Section</th>
            <th>Time of Present</th>
            <th>Time of Exit</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter(
              (student) =>
                (!selectedGradeLevel || student.gradeLevel === selectedGradeLevel) &&
                (!selectedSection || student.section === selectedSection)
            )
            .map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.gradeLevel}</td>
                <td>{student.section}</td>
                <td>{student.presentTime}</td>
                <td>{student.exitTime}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
