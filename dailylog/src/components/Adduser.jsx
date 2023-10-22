import React, { useState } from 'react';
import './Adduser.css';

function Adduser({ onClose, onAddUser }) {
  const [formData, setFormData] = useState({
    name: '',
    studentNumber: '',
    grade: '',
    section: '',
    contactNumber: '', // Added the contactNumber field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission, e.g., send data to the server
    console.log('Form submitted:', formData);
    // Reset the form after submission if needed
    onAddUser({
      ...formData,
      id: Math.random(), // Generating a random id for the new user
    });
    setFormData({
      name: '',
      studentNumber: '',
      grade: '',
      section: '',
      contactNumber: '',
    });
  };

  return (
    <div className='usemain'>
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span className="title">Add Account</span>
      <form className="form" onSubmit={handleSubmit}>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name">Name:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleChange}
            required
          />
          <label htmlFor="studentNumber">Student Number:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          />
          <label htmlFor="grade">Grade:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
          />
          <label htmlFor="section">Section:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
          <label htmlFor="contactNumber">Contact Number:</label>
        </div>

        <button className='addstubtn' type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default Adduser;
