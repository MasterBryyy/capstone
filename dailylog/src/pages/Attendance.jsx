import React, { useState } from 'react';
import './Attendance.css'; // Import your CSS file

function Attendance() {
  const [students, setStudents] = useState([
    { studentNumber: '001', name: 'John Doe', contactNumber: '123-456-7890', present: false, exit: false },
    { studentNumber: '002', name: 'Jane Doe', contactNumber: '987-654-3210', present: false, exit: false },
    // Add more students as needed
  ]);

  const handleToggleAttendance = (index) => {
    setStudents((prevStudents) => {
      const updatedStudents = [...prevStudents];
      updatedStudents[index].present = !updatedStudents[index].present;
      return updatedStudents;
    });
  };

  const handleToggleExit = (index) => {
    setStudents((prevStudents) => {
      const updatedStudents = [...prevStudents];
      updatedStudents[index].exit = !updatedStudents[index].exit;
      return updatedStudents;
    });
  };

  return (
    <div className="attendance-container">
      <h2>Attendance</h2>
      <table>
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Contact Number</th>
            <th>Present</th>
            <th>Out</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.studentNumber}</td>
              <td>{student.name}</td>
              <td>{student.contactNumber}</td>
              <td>
                <input
                  type="checkbox"
                  checked={student.present}
                  onChange={() => handleToggleAttendance(index)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={student.exit}
                  onChange={() => handleToggleExit(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance;
