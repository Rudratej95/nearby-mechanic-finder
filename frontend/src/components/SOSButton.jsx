import { useState } from 'react';
import api from '../api/axios';

/**
 * SOSButton — floating emergency button with modal.
 * Detects user location, sends SOS to backend, shows assigned mechanic.
 */
export default function SOSButton() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSOS = () => {
    setShowModal(true);
    setLoading(true);
    setError('');
    setResult(null);

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { data } = await api.post('/sos', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              userName: 'Emergency User',
              message: 'I need roadside assistance immediately!'
            });
            setResult(data);
          } catch (err) {
            setError('Failed to send SOS alert. Please try calling emergency services directly.');
          } finally {
            setLoading(false);
          }
        },
        () => {
          // Geolocation denied — use default coordinates
          sendDefaultSOS();
        },
        { timeout: 5000 }
      );
    } else {
      sendDefaultSOS();
    }
  };

  const sendDefaultSOS = async () => {
    try {
      const { data } = await api.post('/sos', {
        latitude: 28.6139,
        longitude: 77.2090,
        userName: 'Emergency User',
        message: 'I need roadside assistance immediately!'
      });
      setResult(data);
    } catch (err) {
      setError('Failed to send SOS alert. Please try calling emergency services directly.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setResult(null);
    setError('');
  };

  return (
    <>
      {/* Floating SOS button */}
      <button className="sos-button" onClick={handleSOS} id="sos-button" title="Emergency SOS">
        SOS
      </button>

      {/* SOS Modal */}
      {showModal && (
        <div className="sos-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sos-modal">
            {loading ? (
              <>
                <div className="sos-spinner"></div>
                <h2>🚨 Sending SOS Alert...</h2>
                <p>Detecting your location and finding the nearest available mechanic...</p>
              </>
            ) : error ? (
              <>
                <div className="sos-icon">⚠️</div>
                <h2>Alert Failed</h2>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={closeModal}>Close</button>
              </>
            ) : result ? (
              <>
                <div className="sos-icon">🚑</div>
                <h2>Help is on the way!</h2>
                <p>{result.message}</p>

                {result.mechanic && (
                  <div className="mechanic-assigned">
                    <h4>Assigned Mechanic</h4>
                    <p className="assigned-name">🔧 {result.mechanic.name}</p>
                    <p className="assigned-phone">📞 {result.mechanic.phone}</p>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                      📍 {result.mechanic.address}
                    </p>
                  </div>
                )}

                {result.mechanic?.phone && (
                  <a
                    href={`tel:${result.mechanic.phone.replace(/[^+\d]/g, '')}`}
                    className="btn btn-green"
                    style={{ width: '100%', marginBottom: '12px' }}
                  >
                    📞 Call Mechanic
                  </a>
                )}

                <button className="btn btn-outline" onClick={closeModal} style={{ width: '100%' }}>
                  Close
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
