import React from 'react'
import './Adduser.css'
function Adduser({ onClose }) {
  return (
    <div className='usemain'>
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span className="title">Add Account</span>
      <form className="form">
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="name"
            value=""
            onChange=""
            required
          />
          <label htmlFor="name">Name:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="studentNumber"
            value=""
            onChange=""
            required
          />
          <label htmlFor="studentno">Student Number:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="section"
            value=""
            onChange=""
            required
          />
          <label htmlFor="section">Contact Number:</label>
        </div>
     

        <button className='addstubtn' type="submit">
          Add
        </button>
      </form>
    </div>
  )
}

export default Adduser