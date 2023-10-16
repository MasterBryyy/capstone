import React, { useState } from 'react';
import './Report.css';

const Report = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', presentTime: '10:00 AM', exitTime: '02:00 PM' },
    { id: 2, name: 'Jane Smith', presentTime: '09:30 AM', exitTime: '03:30 PM' },
    // Add more students as needed
  ]);

  return (
    <div className="report-container">
      <h1>Student Report</h1>
      <table className="report-table">
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Time of Present</th>
            <th>Time of Exit</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
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
