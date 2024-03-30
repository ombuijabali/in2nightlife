import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './EditProfile.css';

const EditProfile = ({ user, onClose }) => {
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    profile_picture: null,
  });

  const [activeSection, setActiveSection] = useState('accountInfo'); // Default to 'accountInfo'

  useEffect(() => {
    if (user) {
      setProfileData({
        ...user,
      });
    }
  }, [user]);

  const { updateProfile, changePassword } = useAuth();

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileData({
      ...profileData,
      profile_picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profileData);
    onClose();
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const newPassword = prompt('Enter new password');
    if (newPassword) {
      await changePassword(newPassword);
      alert('Password changed successfully!');
    }
  };

  return (
    <div className="edit-profile-modal">
      <div className="profile-sections">
        <button onClick={() => setActiveSection('accountInfo')}>Account Info</button>
        <button onClick={() => setActiveSection('security')}>Security</button>
        {/* Add more sections as needed */}
      </div>
      <form onSubmit={handleSubmit}>
        {activeSection === 'accountInfo' && (
          <section className="account-info">
            <h2>Account Info</h2>
            <label htmlFor="first_name">First Name:</label>
            <input type="text" name="first_name" value={profileData.first_name} onChange={handleChange} required />

            <label htmlFor="last_name">Last Name:</label>
            <input type="text" name="last_name" value={profileData.last_name} onChange={handleChange} required />

            <label htmlFor="email">Email:</label>
            <input type="email" name="email" value={profileData.email} onChange={handleChange} required />

            <label htmlFor="phone_number">Phone Number:</label>
            <input type="text" name="phone_number" value={profileData.phone_number} onChange={handleChange} required />

            <label htmlFor="address">Address:</label>
            <input type="text" name="address" value={profileData.address} onChange={handleChange} required />
          </section>
        )}
        {activeSection === 'security' && (
          <section className="security">
            <h2>Security</h2>
            <label htmlFor="password">Change Password:</label>
            <button onClick={handleChangePassword}>Change Password</button>
          </section>
        )}
        {/* Add more sections as needed */}
        <label htmlFor="profile_picture">Profile Picture:</label>
        <input type="file" name="profile_picture" onChange={handleFileChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
