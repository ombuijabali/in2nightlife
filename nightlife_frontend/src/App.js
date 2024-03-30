import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import AboutComponent from './components/AboutComponent';
import Login from './components/Login';
import Register from './components/Register';
import MapComponent from './components/MapComponent';
import FAQsComponent from './components/FAQsComponent';
import NotificationComponent from './components/NotificationComponent';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('http://localhost:8000/api/notifications/');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar onClubSelect={setSelectedClub} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Register />} />
            <Route path="/about-us" element={<AboutComponent />} />
            <Route path="/map" element={<MapComponent selectedClub={selectedClub} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifications" element={<NotificationComponent notifications={notifications} />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="/faqs" element={<FAQsComponent />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
