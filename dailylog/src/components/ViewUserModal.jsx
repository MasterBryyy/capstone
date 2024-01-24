import React from 'react';
import './ViewUserModal.css'; // Import your CSS file

const ViewUserModal = ({ isOpen, onClose, user }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className='modal-container'>
        <h2>User Details</h2>
        {user && (
          <div className='user-details'>
            {user.imageUrl && (
              <div className='user-image'>
                <img src={user.imageUrl} alt={`${user.name}'s profile`} />
              </div>
            )}
            <table className='user-table'>
              <tbody>
                <tr>
                  <td>
                    <strong>Name:</strong>
                  </td>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Student Number:</strong>
                  </td>
                  <td>{user.studentNumber}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Contact Number:</strong>
                  </td>
                  <td>{user.contactNumber}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Grade Level:</strong>
                  </td>
                  <td>{user.gradeLevel}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Section:</strong>
                  </td>
                  <td>{user.section}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <button className='close-btn' onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewUserModal;
