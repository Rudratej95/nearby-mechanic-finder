import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix default Leaflet marker icon (webpack/vite issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom mechanic marker icon (blue)
const mechanicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// User location marker (red)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Search result marker (green)
const searchIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

/**
 * FlyToLocation — flies the map to a target position when it changes.
 */
function FlyToLocation({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, zoom || 14, { duration: 1.5 });
    }
  }, [position, zoom, map]);
  return null;
}

/**
 * SearchResultItem — displays a single search result with nearby mechanic count.
 */
function SearchResultItem({ place, onSelect }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/mechanics/count?lat=${place.lat}&lng=${place.lon}&radius=50`);
        const data = await res.json();
        setCount(data.count);
      } catch (err) {
        setCount(0);
      }
    };
    fetchCount();
  }, [place]);

  return (
    <button className="map-search-result-item" onClick={() => onSelect(place)}>
      <span className="result-icon">📍</span>
      <div className="result-text">
        <span className="result-name">{place.display_name.split(',')[0]}</span>
        <span className="result-detail">{place.display_name.split(',').slice(1, 4).join(',')}</span>
        <span className="result-mechanics">
          {count === null ? 'Checking mechanics...' : `${count} mechanics nearby`}
        </span>
      </div>
    </button>
  );
}

/**
 * MapView — Leaflet map with place search that suggests nearby mechanics.
 *
 * Props:
 *   mechanics       — array of mechanic objects to show as markers
 *   userPosition    — [lat, lng] of the user
 *   onPlaceSelect   — callback(lat, lng, placeName) called when a place is selected
 *   onPlaceClear    — callback() called when the search is cleared
 */
export default function MapView({ mechanics = [], userPosition, onPlaceSelect, onPlaceClear }) {
  const navigate = useNavigate();
  const defaultCenter = [28.6139, 77.2090];
  const center = userPosition || defaultCenter;

  // Place search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [flyTarget, setFlyTarget] = useState(userPosition);
  const [flyZoom, setFlyZoom] = useState(13);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Fly to user position on first load
  useEffect(() => {
    if (userPosition && !selectedPlace) {
      setFlyTarget(userPosition);
      setFlyZoom(13);
    }
  }, [userPosition]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Search for a place using OpenStreetMap Nominatim geocoding API.
   */
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setShowResults(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Geocoding error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /**
   * Select a place from search results — fly the map there AND
   * notify parent to fetch nearby mechanics at that location.
   */
  const selectPlace = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    const placeName = place.display_name.split(',')[0];

    setSelectedPlace({ lat, lng, name: place.display_name });
    setFlyTarget([lat, lng]);
    setFlyZoom(13);
    setShowResults(false);
    setSearchQuery(placeName);

    // Notify parent (HomePage) to fetch mechanics near this location
    if (onPlaceSelect) {
      onPlaceSelect(lat, lng, placeName);
    }
  };

  /**
   * Clear search and return to user location.
   */
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedPlace(null);
    setShowResults(false);
    if (userPosition) {
      setFlyTarget(userPosition);
      setFlyZoom(13);
    }
    // Notify parent to reset to default mechanic fetch
    if (onPlaceClear) {
      onPlaceClear();
    }
  };

  return (
    <div className="map-container" id="map-container">
      {/* ─── Map Search Bar ─── */}
      <div className="map-search" ref={searchRef}>
        <form onSubmit={handleSearch} className="map-search-form">
          <span className="map-search-icon">🔍</span>
          <input
            type="text"
            className="map-search-input"
            placeholder="Search a place to find nearby mechanics..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === '') clearSearch();
            }}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            id="map-search-input"
          />
          {searchQuery && (
            <button type="button" className="map-search-clear" onClick={clearSearch} title="Clear search">
              ✕
            </button>
          )}
          <button type="submit" className="map-search-btn" disabled={searchLoading}>
            {searchLoading ? '...' : 'Go'}
          </button>
        </form>

        {/* Search results dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="map-search-results">
            {searchResults.map((place, i) => (
              <SearchResultItem
                key={i}
                place={place}
                onSelect={selectPlace}
              />
            ))}
          </div>
        )}
        {showResults && !searchLoading && searchResults.length === 0 && searchQuery && (
          <div className="map-search-results">
            <div className="map-search-no-results">No places found for "{searchQuery}"</div>
          </div>
        )}
      </div>

      {/* ─── Leaflet Map ─── */}
      <MapContainer center={center} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToLocation position={flyTarget} zoom={flyZoom} />

        {/* User location marker */}
        {userPosition && (
          <Marker position={userPosition} icon={userIcon}>
            <Popup>
              <div className="mechanic-popup">
                <h3>📍 Your Location</h3>
                <p>You are here</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Search result marker (green) */}
        {selectedPlace && (
          <Marker position={[selectedPlace.lat, selectedPlace.lng]} icon={searchIcon}>
            <Popup>
              <div className="mechanic-popup">
                <h3>📍 {selectedPlace.name.split(',')[0]}</h3>
                <p>Showing mechanics near this location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Mechanic markers */}
        {mechanics.map((m) => {
          const coords = m.location?.coordinates;
          if (!coords) return null;
          const pos = [coords[1], coords[0]];

          return (
            <Marker key={m._id} position={pos} icon={mechanicIcon}>
              <Popup>
                <div className="mechanic-popup">
                  <h3>🔧 {m.name}</h3>
                  <p>⭐ {m.rating} — {m.specialization}</p>
                  <p>📞 {m.phone}</p>
                  <p>📍 {m.address}</p>
                  <div className="popup-actions">
                    <button
                      className="popup-btn view"
                      onClick={() => navigate(`/mechanic/${m._id}`)}
                    >
                      View Profile
                    </button>
                    <a
                      className="popup-btn directions"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}${userPosition ? `&origin=${userPosition[0]},${userPosition[1]}` : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
