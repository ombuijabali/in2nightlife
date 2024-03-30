// components/Alert.js
import React from 'react';
import './Alert.css'; // Import your CSS file for styling

const Alert = ({ type, message, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      {message}
      <button onClick={onClose}>X</button>
    </div>
  );
};

export default Alert;
