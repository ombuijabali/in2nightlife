import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const { login } = useAuth(); // Use the login function from the context
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const { token } = await response.json(); // Extract token from response
        localStorage.setItem('token', token); // Store token securely
        setAlert({ type: 'success', message: 'Login successful!' });
        login(); // Set authentication state
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setAlert({ type: 'error', message: 'Failed to login. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };


  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Username" required />
          <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        {alert && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}      </div>
    </div>
  );
};

export default Login;
