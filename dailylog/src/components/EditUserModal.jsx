import React, { useState, useEffect } from 'react';
import './EditUserModal.css'; // Create a CSS file for styling

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user || {});

  useEffect(() => {
    setEditedUser(user || {});
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedUser);
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className='modal-container'>
        <h2>Edit Student Information</h2>
        <div className='edit-user-form'>
          <label>Name:</label>
          <input type='text' name='name' value={editedUser.name || ''} onChange={handleInputChange} />
          <label>Student Number:</label>
          <input
            type='text'
            name='studentNumber'
            value={editedUser.studentNumber || ''}
            onChange={handleInputChange}
          />

          <label>Contact Number:</label>
          <input
            type='text'
            name='contactNumber'
            value={editedUser.contactNumber || ''}
            onChange={handleInputChange}
          />

          <label>Grade Level:</label>
          <input
            type='text'
            name='gradeLevel'
            value={editedUser.gradeLevel || ''}
            onChange={handleInputChange}
          />

          <label>Section:</label>
          <input
            type='text'
            name='section'
            value={editedUser.section || ''}
            onChange={handleInputChange}
          />

          
          <button className='save-btn' onClick={handleSave}>
            Save
          </button>
          <button className='close-btn' onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
