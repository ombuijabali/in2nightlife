import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const authAxios = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getAuthStateFromStorage = () => {
  const authState = JSON.parse(localStorage.getItem('authState')) || {};
  return authState;
};

const storeAuthStateInStorage = (authState) => {
  localStorage.setItem('authState', JSON.stringify(authState));
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(getAuthStateFromStorage().isAuthenticated || false);
  const [currentUser, setCurrentUser] = useState(getAuthStateFromStorage().currentUser || null);
  const [userToken, setUserToken] = useState(getAuthStateFromStorage().userToken || null);

  const login = () => {
    setIsAuthenticated(true);
    fetchUserProfile();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserToken(null);
    localStorage.removeItem('token');
    storeAuthStateInStorage({ isAuthenticated: false, currentUser: null, userToken: null });
  };

  const fetchUserProfile = async () => {
    const authToken = localStorage.getItem('token');
    if (authToken) {
      setUserToken(authToken);
      try {
        const response = await fetch('http://localhost:8000/api/user/', {
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const userProfileData = await response.json();
          setCurrentUser(userProfileData);
          storeAuthStateInStorage({ isAuthenticated: true, currentUser: userProfileData, userToken: authToken });
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    } else {
      console.error('Token not found');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const value = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    fetchUserProfile,
    authAxios,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};