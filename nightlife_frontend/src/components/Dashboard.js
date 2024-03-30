import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const MapComponent = lazy(() => import('./MapComponent'));
const Sidebar = lazy(() => import('./Sidebar'));
const Analytics = lazy(() => import('./Analytics'));

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isAnalyticsCollapsed, setIsAnalyticsCollapsed] = useState(true);
  const [selectedDrink, setSelectedDrink] = useState('');
  const [selectedMusic, setSelectedMusic] = useState('');
  const [clubData, setClubData] = useState([]);
  const [preferencesFilled, setPreferencesFilled] = useState(false);
  const { authAxios } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/clubs/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setClubData(data);
      } catch (error) {
        console.error('Error fetching club data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleAnalytics = () => setIsAnalyticsCollapsed(!isAnalyticsCollapsed);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreferencesFilled(true);
    // Send the selected preferences to the server
    sendPreferencesToServer(selectedDrink, selectedMusic);
  };

  const sendPreferencesToServer = async (drink, music) => {
    try {
      const response = await authAxios.post('http://localhost:8000/api/update_preferences/', {
        drink,
        music,
      });

      console.log('Preferences sent successfully');
    } catch (error) {
      console.error('Error sending preferences:', error.response?.data || error.message);
    }
  };

  // Function to handle the "Cancel" action
  const handleCancel = () => {
    setPreferencesFilled(true);
  };

  const getDrinkOptions = () => {
    const drinks = clubData.map((club) => club.drinks);
    return [...new Set(drinks)];
  };

  const getMusicOptions = () => {
    const music = clubData.map((club) => club.music);
    return [...new Set(music)];
  };

  return (
    <div className={`dashboard ${!preferencesFilled ? 'dashboard-blur' : ''}`}>
      {isAuthenticated ? (
        <>
          {!preferencesFilled ? (
            <div className="preferences-form">
              <form onSubmit={handleSubmit}>
                <h4>Tell me your mood baby</h4>
                <label htmlFor="drink">Preferred Drink:</label>
                <select id="drink" value={selectedDrink} onChange={(e) => setSelectedDrink(e.target.value)}>
                  <option value="">Pick your favorite drink</option>
                  {getDrinkOptions().map((drink, index) => (
                    <option key={index} value={drink}>{drink}</option>
                  ))}
                </select>

                <label htmlFor="music">Preferred Music:</label>
                <select id="music" value={selectedMusic} onChange={(e) => setSelectedMusic(e.target.value)}>
                  <option value="">Pick your favorite music genre</option>
                  {getMusicOptions().map((music, index) => (
                    <option key={index} value={music}>{music}</option>
                  ))}
                </select>

                <div className="form-actions">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={handleCancel} className="cancel-btn">Proceed without preferences</button>
                </div>
              </form>
            </div>
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
                <button onClick={toggleSidebar}>
                  <FontAwesomeIcon icon={isSidebarCollapsed ? faBars : faTimes} />
                </button>
                <Sidebar handleLogout={handleLogout} />
              </div>
              <div className="map-container">
                <MapComponent selectedDrink={selectedDrink} selectedMusic={selectedMusic} />
              </div>
              <div className={`analytics ${isAnalyticsCollapsed ? 'collapsed' : 'expanded'}`}>
                <button onClick={toggleAnalytics}>
                  <FontAwesomeIcon icon={isAnalyticsCollapsed ? faBars : faTimes} />
                </button>
                <Analytics />
              </div>
            </Suspense>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Dashboard;