import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  Autocomplete,
  DirectionsService,
  DistanceMatrixService,
} from '@react-google-maps/api';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { FaSearch } from 'react-icons/fa';
import './MapComponent.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};
const center = {
  lat: 51.04239,
  lng: -114.07172,   
};

const MapComponent = ({ selectedDrink, selectedMusic, selectedClub }) => {
  const [clubs, setClubs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [customLocation, setCustomLocation] = useState(null);
  const [destinationClub, setDestinationClub] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [showDirectionsUI, setShowDirectionsUI] = useState(false);
  const [showCalculateRouteButton, setShowCalculateRouteButton] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const { authAxios } = useAuth();
  const { currentUser } = useAuth();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyByFCCOFZUKZq7kr4nNbBlxtDmI4M4lv9s',
    libraries,
  });

  const { placePredictions, getPlacePredictions } = usePlacesAutocomplete({
    googleMapsApiKey: 'AIzaSyByFCCOFZUKZq7kr4nNbBlxtDmI4M4lv9s',
  });

  useEffect(() => {
    if (loadError) return;
    if (!isLoaded || !window.google || !window.google.maps) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => null
    );
  }, [loadError, isLoaded]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/clubs/');
        const data = await response.json();
        let filteredClubs = data;

        if (selectedDrink) {
          filteredClubs = filteredClubs.filter((club) =>
            club.drinks.toLowerCase().includes(selectedDrink.toLowerCase())
          );
        }

        if (selectedMusic) {
          filteredClubs = filteredClubs.filter((club) =>
            club.music.toLowerCase().includes(selectedMusic.toLowerCase())
          );
        }

        setClubs(filteredClubs);
      } catch (error) {
        console.error('Error', error);
      }
    };

    fetchClubs();
  }, [selectedDrink, selectedMusic]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedClub && map) {
      setSelected(selectedClub);
      map.panTo({ lat: selectedClub.latitude, lng: selectedClub.longitude });
      map.setZoom(15);
    }
  }, [selectedClub, map]);

  useEffect(() => {
    if (map && window.google && window.google.maps) {
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(map);
    }
  }, [map]);

  useEffect(() => {
    let interval;

    if (placeDetails && placeDetails.photos) {
      interval = setInterval(() => {
        setActiveImageIndex((prevIndex) =>
          prevIndex === placeDetails.photos.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [placeDetails]);

  useEffect(() => {
    const sendLocationInterval = setInterval(() => {
      if (userLocation) {
        sendLocationToServer(userLocation);
      }
    }, 300000); // 5 minutes in milliseconds

    return () => clearInterval(sendLocationInterval);
  }, [userLocation]);

  const sendLocationToServer = (location) => {
    authAxios
      .post('http://localhost:8000/api/update_location/', {
        location: {
          type: 'Point',
          coordinates: [location.lng, location.lat],
        },
      })
      .then((response) => {
        console.log('Location sent successfully');
      })
      .catch((error) => {
        console.error('Error sending location:', error.response?.data || error.message);
      });
  };

  const sendVisitHistoryToServer = (visitHistory) => {
    authAxios
      .post('http://localhost:8000/api/update_visit_history/', {
        visit_history: visitHistory,
        user: currentUser.id, // Pass the currentUser.id or any unique identifier for the user
      })
      .then((response) => {
        console.log('Visit history sent successfully');
      })
      .catch((error) => {
        console.error('Error sending visit history:', error.response?.data || error.message);
      });
  };

  const handleMarkerClick = (club) => {
    setSelected(club);
    if (window.google && window.google.maps && window.google.maps.places) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input: club.name }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions[0]) {
          const placeId = predictions[0].place_id;
          const detailsService = new window.google.maps.places.PlacesService(map);
          detailsService.getDetails({ placeId }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPlaceDetails(place);
            }
          });
        }
      });
    }
    const updatedVisitHistory = [...visitHistory, club.id];
    setVisitHistory(updatedVisitHistory);
    sendVisitHistoryToServer(updatedVisitHistory);
  };

  const handleDestinationClubChange = (event) => {
    const selectedClubId = event.target.value;
    const selectedClub = clubs.find((club) => club.id === parseInt(selectedClubId));
    setDestinationClub(selectedClub);
  };

  const handleCustomLocationChange = (place) => {
    if (!place.geometry) {
      return;
    }

    setCustomLocation({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  const handleTravelModeChange = (event) => {
    setTravelMode(event.target.value);
  };

  const toggleDirectionsUI = () => {
    setShowDirectionsUI((prevState) => !prevState);
  };

  const calculateRoute = () => {
    if (
      (customLocation || userLocation) &&
      destinationClub &&
      window.google &&
      window.google.maps
    ) {
      const origin = customLocation
        ? new window.google.maps.LatLng(customLocation.lat, customLocation.lng)
        : new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
      const destination = new window.google.maps.LatLng(
        destinationClub.latitude,
        destinationClub.longitude
      );

      const directionsService = new window.google.maps.DirectionsService();
      const distanceMatrixService = new window.google.maps.DistanceMatrixService();

      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode[travelMode],
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
            // Handle ZERO_RESULTS error
            distanceMatrixService.getDistanceMatrix(
              {
                origins: [origin],
                destinations: [destination],
                travelMode: window.google.maps.TravelMode[travelMode],
              },
              (response, status) => {
                if (status === window.google.maps.DistanceMatrixStatus.OK) {
                  const distance = response.rows[0].elements[0].distance;
                  const duration = response.rows[0].elements[0].duration;
                  setDistance(distance);
                  setDuration(duration);
                } else {
                  console.error(`Error fetching distance: ${status}`);
                }
              }
            );
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    calculateRoute();
  }, [customLocation, destinationClub, userLocation, travelMode]);

  useEffect(() => {
    if (customLocation && destinationClub && travelMode) {
      setShowCalculateRouteButton(true);
    } else {
      setShowCalculateRouteButton(false);
      setDirectionsResponse(null);
    }
  }, [customLocation, destinationClub, travelMode]);

  const getPlaceStatus = (periods) => {
    const currentDateTime = new Date();
    const period = periods.find((p) =>
      p.open &&
      new Date(p.open.day + " " + p.open.time) <= currentDateTime &&
      new Date(p.close.day + " " + p.close.time) >= currentDateTime
    );

    return period ? (period.open ? "Open Now" : "Closed") : "N/A";
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

   return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
        onLoad={(map) => setMap(map)}
      >
        {clubs.map((club) => (
          <Marker
            key={club.id}
            position={{ lat: club.latitude, lng: club.longitude }}
            onClick={() => handleMarkerClick(club)}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(48, 48),
            }}
          />
        ))}



        {/* Search icon container */}
        <div className="map-search-icon-container" onClick={toggleDirectionsUI}>
          <FaSearch className="map-search-icon" />
        </div>

        {/* Directions controls container */}
        {showDirectionsUI && (
          <div className="map-directions-controls">
            <div className="map-directions-controls-header">
              <h3>Directions</h3>
              <div
                className="map-directions-controls-close"
                onClick={() => setShowDirectionsUI(false)}
              >
                &times;
              </div>
            </div>
            <Autocomplete
              onLoad={(autocomplete) => setAutocomplete(autocomplete)}
              onPlaceChanged={() => handleCustomLocationChange(autocomplete.getPlace())}
            >
              <input
                type="text"
                placeholder="Enter your location"
                className="map-directions-input"
              />
            </Autocomplete>
            <select
              onChange={handleDestinationClubChange}
              className="map-directions-select"
            >
              <option value="">Select a club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
            <select
              value={travelMode}
              onChange={handleTravelModeChange}
              className="map-directions-select"
            >
              <option value="DRIVING">Driving</option>
              <option value="WALKING">Walking</option>
              <option value="BICYCLING">Bicycling</option>
              <option value="TRANSIT">Transit</option>
            </select>
            {showCalculateRouteButton && (
              <button onClick={calculateRoute} className="map-directions-button">
                Calculate Route
              </button>
            )}
            {distance && duration && (
              <div className="map-directions-info">
                <p>Distance: {distance.text}</p>
                <p>Duration: {duration.text}</p>
              </div>
            )}
          </div>
        )}

        {selected && placeDetails && (
          <InfoWindow
            position={{ lat: selected.latitude, lng: selected.longitude }}
            onCloseClick={() => {
              setSelected(null);
              setPlaceDetails(null);
            }}
          >
            <div className="info-window-container">
              <h2 className="info-window-heading">{placeDetails.name}</h2>
              <div className="info-window-images">
                {placeDetails.photos &&
                  placeDetails.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo.getUrl()}
                      alt={`Photo ${index + 1}`}
                      className={`info-window-image ${
                        index === activeImageIndex ? 'active' : ''
                      }`}
                    />
                  ))}
              </div>
              <p className="info-window-rating">Rating: {placeDetails.rating}</p>
              <p className="info-window-address">Address: {placeDetails.formatted_address}</p>
              {placeDetails.opening_hours && (
                <div>
                  <p className="info-window-hours-title">Opening Hours:</p>
                  <ul className="info-window-hours-list">
                    {placeDetails.opening_hours.weekday_text.map((day, index) => (
                      <li key={index} className="info-window-hour">{day}</li>
                    ))}
                  </ul>
                  <p className="info-window-status">
                    {getPlaceStatus(placeDetails.opening_hours.periods)}
                  </p>
                </div>
              )}
              {placeDetails.formatted_phone_number && <p className="info-window-phone">Phone: {placeDetails.formatted_phone_number}</p>}
              {placeDetails.website && <p className="info-window-website"><a href={placeDetails.website} target="_blank" rel="noopener noreferrer">Website</a></p>}
              <div className="info-window-close" onClick={() => { setSelected(null); setPlaceDetails(null); }}>Close</div>
            </div>
          </InfoWindow>
        )}

        {customLocation && <Marker position={customLocation} />}
        {userLocation && !customLocation && <Marker position={userLocation} />}

        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{ suppressMarkers: true }}
          />
        )}

        {map && window.google && window.google.maps && (
          <div>
            <div>
              <button
                onClick={() => {
                  const trafficLayer = new window.google.maps.TrafficLayer();
                  trafficLayer.setMap(map);
                }}
              >
                Show Traffic
              </button>
              <button
                onClick={() => {
                  const trafficLayer = new window.google.maps.TrafficLayer();
                  trafficLayer.setMap(null);
                }}
              >
                Hide Traffic
              </button>
            </div>
          </div>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;