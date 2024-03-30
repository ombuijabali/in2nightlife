import React, { useState, useEffect } from 'react';

const NotificationComponent = ({ notifications, onClubClick }) => {
  // Check if notifications array is empty and render message if true
  if (notifications.length === 0) {
    return (
      <div className="notification-popup">
        <h6>Notifications</h6>
        <p>No new notifications</p>
      </div>
    );
  }

  // Render notifications if the array is not empty
  return (
    <div className="notification-popup">
      <h6>Notifications</h6>
      {notifications.map(notification => (
        <div key={notification.id}>
          <p>{notification.message}</p>
          <button onClick={() => onClubClick(notification.clubId)}>View Club</button>
        </div>
      ))}
    </div>
  );
};



const App = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Establish connection to notification system (WebSocket or polling)
    // Update notifications state when new notifications are received
    // Example:
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/notifications/');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []); // Add dependencies if needed

  const handleClubClick = async (clubId) => {
    try {
      // Fetch club details based on clubId
      const response = await fetch(`http://localhost:8000/api/clubs/${clubId}`);
      const clubData = await response.json();
      // Pass club details to map component or navigate to club details page
      console.log('Club Details:', clubData);
    } catch (error) {
      console.error('Error fetching club details:', error);
    }
  };

  return (
    <div>
      <NotificationComponent notifications={notifications} />
    
    </div>
  );
};

export default App;
