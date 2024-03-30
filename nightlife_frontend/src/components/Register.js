import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("Registration successful!");
      } else {
        alert("Failed to register.");
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Username" required />
      <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" required />
      <input type="text" name="phone_number" value={user.phone_number} onChange={handleChange} placeholder="Phone Number" />
      <input type="text" name="address" value={user.address} onChange={handleChange} placeholder="Address" />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Register;
