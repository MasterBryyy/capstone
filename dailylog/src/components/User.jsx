import React, { useState } from 'react';
import './User.css'
import Adduser from './Adduser';
function User() {
    const data = [
        { id: 1, name: 'John', age: 22, email: 'john@example.com' },
        { id: 2, name: 'Bryan', age: 22, email: 'bryan@example.com' },
        { id: 3, name: 'Reyes', age: 22, email: 'reyes@example.com' },
      ];

    const [showModal, setShowModal] = useState(false); 

    const handleAddBtnClick = () => {
    
        setShowModal(true);
      };
    const handleCloseModals = () => {
        setShowModal(false);
      };
  return (
    <div>
         <div className='addbtn-container'>
        <button className='addbtn' onClick={handleAddBtnClick}>Add +</button>
      </div>
      <h1>Manage Account</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && <Adduser onClose={handleCloseModals}/>}

    </div>
  )
}

export default User