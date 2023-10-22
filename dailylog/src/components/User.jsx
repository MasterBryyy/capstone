import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './User.css';
import Adduser from './Adduser';

function User() {
  const [data, setData] = useState([
    { id: 1, name: 'John', studentNumber: '11111', contactNumber: '123-456-7890', gradeLevel: '10', section: 'A' },
    { id: 2, name: 'Bryan', studentNumber: '22222', contactNumber: '987-654-3210', gradeLevel: '11', section: 'B' },
    { id: 3, name: 'Reyes', studentNumber: '33333', contactNumber: '696969', gradeLevel: '12', section: 'C' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [lastUsedId, setLastUsedId] = useState(3); // Initialize with the last ID in your initial data

  const handleAddBtnClick = () => {
    setShowModal(true);
  };

  const handleCloseModals = () => {
    setShowModal(false);
  };

  const handleAddUser = (newUser) => {
    setLastUsedId((prevId) => prevId + 1);
    setData((prevData) => [...prevData, { ...newUser, id: lastUsedId + 1 }]);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure you want to delete this student?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const updatedData = data.filter((item) => item.id !== id);
            setData(updatedData);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div>
      <div className='addbtn-container'>
        <button className='addbtn' onClick={handleAddBtnClick}>
          Add Student +
        </button>
      </div>
      <h1>Manage Account</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Student Number</th>
            <th>Contact Number</th>
            <th>Grade Level</th>
            <th>Section</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan='7'>No data available</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.studentNumber}</td>
                <td>{item.contactNumber}</td>
                <td>{item.gradeLevel}</td>
                <td>{item.section}</td>
                <td>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && <Adduser onClose={handleCloseModals} onAddUser={handleAddUser} />}
    </div>
  );
}

export default User;
