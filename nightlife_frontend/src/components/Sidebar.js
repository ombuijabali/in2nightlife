import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EditProfile from './EditProfile';
import NotificationComponent from './NotificationComponent'; // Import NotificationComponent
import FAQsComponent from './FAQsComponent';
import './Sidebar.css';

const Sidebar = ({ showEditProfile, setShowEditProfile, currentUser, handleLogout, handleProfileClick }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false); // State to control notification visibility

  // Toggle notification visibility
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  const handleFAQClick = () => {
    navigate('/faqs'); // Navigate to the FAQs route
  };

  return (
    <div className="sidebar-content">
      <button className="sidebar-icon" onClick={handleProfileClick} title="User Profile">
        <i className="fas fa-user"></i>
        <span className="sidebar-text">Profile</span>
      </button>

      <button className="sidebar-icon" onClick={toggleNotifications} title="Notifications">
        <i className="fas fa-bell"></i>
        <span className="sidebar-text">Notifications</span>
      </button>
      {/* Conditional rendering of NotificationComponent */}
      {showNotifications && <NotificationComponent />}   

      <button className="sidebar-icon" onClick={handleFAQClick} title="FAQs">
        <i className="fas fa-question-circle"></i> {/* Adjust the icon as needed */}
        <span className="sidebar-text">FAQs</span>
      </button>
      
      <button onClick={handleLogout} className="sidebar-icon" title="Logout">
        <i className="fas fa-sign-out-alt"></i>
        <span className="sidebar-text">Logout</span>
      </button>


      {showEditProfile && currentUser && <EditProfile user={currentUser} onClose={() => setShowEditProfile(false)} />}
      
      {/* Copyright notice */}
      <div className="copyright">
        &copy; 2024 In2TheNight
      </div>
    </div>
  );
};

export default Sidebar;
