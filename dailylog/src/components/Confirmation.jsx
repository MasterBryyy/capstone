// Confirmation.js

import React from 'react';
import './Confirmation.css';

const Confirmation = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-container">
      <p>{message}</p>
      <div className="confirmation-buttons">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default Confirmation;
