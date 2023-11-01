import React, { useState } from 'react';
import './Adduser.css';
import { db } from '../Config/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { Form } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
function Adduser({ onClose, onAddUser }) {
  const [formData, setFormData] = useState({
    name: '',
    studentNumber: '',
    gradeLevel: '',
    section: '',
    contactNumber: '',
  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add logic to handle form submission
    console.log('Form submitted:', formData);

    // Add the user to Firestore
    try {
      

      const docRef = await addDoc(collection(db, 'account'), {
        name: formData.name,
        studentNumber: formData.studentNumber,
        gradeLevel: formData.gradeLevel,
        section: formData.section,
        contactNumber: formData.contactNumber,
       


      });

      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    // Notify the parent component about the new user
    onAddUser({
      ...formData,
    });

    // Reset the form after submission if needed
    setFormData({
      name: '',
      studentNumber: '',
      gradeLevel: '',
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
            name="gradeLevel"
            value={formData.gradeLevel}
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