import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';
import logo from '../log6.png';

const NavBar = ({ toggleSidebar }) => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  useEffect(() => {
    let debounceTimer;
    if (searchQuery.length > 0) {
      setIsFetching(true);
      debounceTimer = setTimeout(() => {
        fetch(`http://localhost:8000/api/clubs/?search=${searchQuery}`)
          .then((response) => response.json())
          .then((data) => {
            setSearchResults(data);
            setIsFetching(false);
          })
          .catch((error) => {
            console.error('Error fetching search results:', error);
            setIsFetching(false);
          });
      }, 300); // Adjust the debounce time as needed
    } else {
      setSearchResults([]);
    }
    return () => clearTimeout(debounceTimer); // Clear the debounce timer on component unmount or when searchQuery changes
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectClub = (clubName) => {
    setSearchQuery(clubName);
    setSearchResults([]);
    // Navigate to the club's page or handle the selection
    // navigate(`/clubs/${clubId}`); // Assuming you have a route like this and each club has a unique ID
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(to right, #ff8800, #000000)' }}>
      <div className="container">
        {isAuthenticated ? (
          <div className="navbar-brand" onClick={toggleSidebar}>
            <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto', marginRight: '10px', cursor: 'default' }} />
            <span style={{ fontSize: '30px', fontWeight: 'bold', fontStyle: "italic", color: 'black' }}>In2Nightlife</span>
          </div>
        ) : (
          <Link to="/" className="navbar-brand" onClick={toggleSidebar}>
            <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
            <span style={{ fontSize: '30px', fontWeight: 'bold', fontStyle: "italic", color: 'black' }}>In2Nightlife</span>
          </Link>
        )}
        {isAuthenticated && (
          <div className="search-container">
            <input
              type="search"
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            {isFetching && <div>Loading...</div>}
            {!isFetching && searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((club) => (
                  <li key={club.id} onClick={() => handleSelectClub(club.name)} className="search-result-item">
                    {club.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button className="navbar-toggler" type="button" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={`collapse navbar-collapse ${mobileMenuVisible ? 'show' : ''}`} style={{ justifyContent: 'flex-end' }}>
          {!isAuthenticated ? (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/join" className="nav-link" onClick={toggleMobileMenu}>
                  Join Us
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about-us" className="nav-link" onClick={toggleMobileMenu}>
                  About
                </Link>
              </li>
            </ul>
          ) : (
            // Authenticated user links can be added here if needed
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
