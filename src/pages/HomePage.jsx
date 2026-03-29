import { useState, useEffect } from 'react';
import api from '../api/axios';
import MechanicCard from '../components/MechanicCard';
import SearchFilter from '../components/SearchFilter';
import MapView from '../components/MapView';
import SOSButton from '../components/SOSButton';

/**
 * HomePage — main landing page combining map, search, mechanic list, and SOS.
 *
 * When a place is searched on the map, it fetches mechanics near that location
 * using lat/lng geospatial query params.
 */
export default function HomePage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userPosition, setUserPosition] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);

  /**
   * Generates mock mechanics around a searched location if none exist in DB.
   */
  const generateMockMechanics = (lat, lng, placeName) => {
    const specializations = ['Engine Specialist', 'Tyre Specialist', 'Full-Service Garage', 'Brake Expert', 'Auto Electrician'];
    return [1, 2, 3].map(i => ({
      _id: `mock-${i}-${Date.now()}`,
      name: `${placeName.split(',')[0]} Auto Care #${i}`,
      phone: '+91-90000-00000',
      experience: Math.floor(Math.random() * 15) + 5,
      rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      availability: Math.random() > 0.3 ? 'available' : 'busy',
      specialization: specializations[Math.floor(Math.random() * specializations.length)],
      address: `Near ${placeName.split(',')[0]} Center`,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(lng) + (Math.random() - 0.5) * 0.05,
          parseFloat(lat) + (Math.random() - 0.5) * 0.05
        ]
      },
      isMock: true
    }));
  };

  // Search & filters
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  // Location-based search from map
  const [searchLocation, setSearchLocation] = useState(null); // { lat, lng, name }

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setUserPosition([28.6139, 77.2090]),
        { timeout: 5000 }
      );
    } else {
      setUserPosition([28.6139, 77.2090]);
    }
  }, []);

  // Fetch mechanics from API — reacts to all filters + searched location
  useEffect(() => {
    const fetchMechanics = async () => {
      setLoading(true);
      try {
        const params = {};

        // If a place was searched on the map, use its coordinates
        if (searchLocation) {
          params.lat = searchLocation.lat;
          params.lng = searchLocation.lng;
          params.radius = 100; // 100 km radius for searched location
        }

        if (search) params.search = search;
        if (ratingFilter) params.rating = ratingFilter;
        if (availabilityFilter) params.availability = availabilityFilter;

        const { data } = await api.get('/mechanics', { params });
        
        if (data.length === 0 && searchLocation) {
          // Generate mock mechanics if none found in DB for searched location
          const mockMechanics = generateMockMechanics(searchLocation.lat, searchLocation.lng, searchLocation.name);
          setMechanics(mockMechanics);
          setIsSimulated(true);
        } else {
          setMechanics(data);
          setIsSimulated(false);
        }
        setError('');
      } catch (err) {
        setError('Failed to load mechanics. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchMechanics, 300);
    return () => clearTimeout(timer);
  }, [search, ratingFilter, availabilityFilter, searchLocation]);

  /**
   * Called by MapView when a place is selected from the search results.
   * Updates searchLocation so the mechanic list refetches for that area.
   */
  const handlePlaceSelect = (lat, lng, placeName) => {
    setSearchLocation({ lat, lng, name: placeName });
  };

  /**
   * Called by MapView when the map search is cleared.
   * Resets to default mechanic list (no location filter).
   */
  const handlePlaceClear = () => {
    setSearchLocation(null);
  };

  // Dynamic subtitle based on search state
  const subtitle = searchLocation
    ? `Showing mechanics near ${searchLocation.name}`
    : 'Trusted auto repair professionals near you';

  return (
    <div className="home-page" id="home-page">
      {/* Header with title and search */}
      <div className="home-header">
        <div>
          <h1 className="home-title">Find Nearby Mechanics</h1>
          <p className="home-subtitle">{subtitle}</p>
        </div>
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          ratingFilter={ratingFilter}
          onRatingChange={setRatingFilter}
          availabilityFilter={availabilityFilter}
          onAvailabilityChange={setAvailabilityFilter}
        />
      </div>

      {/* Mechanic list */}
      <div className="mechanic-list" id="mechanic-list">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card skeleton-card">
              <div className="skeleton skeleton-avatar"></div>
              <div className="skeleton-lines">
                <div className="skeleton skeleton-line medium"></div>
                <div className="skeleton skeleton-line short"></div>
                <div className="skeleton skeleton-line"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <p>{error}</p>
          </div>
        ) : mechanics.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>
              {searchLocation
                ? `No mechanics found near ${searchLocation.name}. Try a different location.`
                : 'No mechanics found matching your criteria'}
            </p>
          </div>
        ) : (
          <>
            {searchLocation && (
              <div className={`location-badge ${isSimulated ? 'simulated-badge' : ''}`}>
                📍 {isSimulated ? 'Simulated' : 'Showing'} <strong>{mechanics.length}</strong> mechanics near <strong>{searchLocation.name}</strong>
                {isSimulated && <span className="sim-tag" title="No real mechanics in database for this area — showing simulation">DEMO</span>}
                <button className="location-badge-clear" onClick={handlePlaceClear}>✕ Clear</button>
              </div>
            )}
            {mechanics.map((m) => <MechanicCard key={m._id} mechanic={m} />)}
          </>
        )}
      </div>

      {/* Map with place search */}
      <MapView
        mechanics={mechanics}
        userPosition={userPosition}
        onPlaceSelect={handlePlaceSelect}
        onPlaceClear={handlePlaceClear}
      />

      {/* SOS Emergency Button */}
      <SOSButton />
    </div>
  );
}
