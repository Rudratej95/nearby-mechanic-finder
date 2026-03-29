import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';

/**
 * MechanicProfile — detailed view of a single mechanic.
 * Displays profile, services, reviews, and contact options.
 */
export default function MechanicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMechanic = async () => {
      try {
        const { data } = await api.get(`/mechanics/${id}`);
        setMechanic(data);
      } catch (err) {
        setError('Mechanic not found');
      } finally {
        setLoading(false);
      }
    };
    fetchMechanic();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewName.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/mechanics/${id}/reviews`, {
        userName: reviewName,
        rating: Number(reviewRating),
        comment: reviewComment
      });
      setMechanic(data);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      console.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading mechanic profile...</p>
      </div>
    );
  }

  if (error || !mechanic) {
    return (
      <div className="empty-state">
        <div className="empty-icon">😕</div>
        <p>{error || 'Mechanic not found'}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>
          Go Home
        </button>
      </div>
    );
  }

  const coords = mechanic.location?.coordinates;

  return (
    <div className="profile-page" id="mechanic-profile">
      {/* Back button */}
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

      {/* Profile Header */}
      <div className="glass-card profile-header">
        <img
          src={mechanic.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(mechanic.name)}&background=3b82f6&color=fff&size=200`}
          alt={mechanic.name}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1>{mechanic.name}</h1>
          <p className="profile-spec">{mechanic.specialization}</p>

          <div className="profile-meta">
            <div className="profile-meta-item">
              <StarRating rating={mechanic.rating} />
              <span>({mechanic.reviews?.length || 0} reviews)</span>
            </div>
            <div className="profile-meta-item">🛠️ {mechanic.experience} years exp.</div>
            <div className="profile-meta-item">📍 {mechanic.address}</div>
            <div className="profile-meta-item">📞 {mechanic.phone}</div>
            <span className={`availability-badge ${mechanic.availability}`}>
              <span className="availability-dot"></span>
              {mechanic.availability}
            </span>
          </div>

          <div className="profile-actions">
            <a href={`tel:${mechanic.phone.replace(/[^+\d]/g, '')}`} className="btn btn-green">
              📞 Call Now
            </a>
            {coords && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                🗺️ Get Directions
              </a>
            )}
            {mechanic.email && (
              <a href={`mailto:${mechanic.email}`} className="btn btn-outline">
                ✉️ Email
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="profile-section">
        <h2>🛠️ Services Offered</h2>
        <div className="services-grid">
          {mechanic.services?.map((service, i) => (
            <span key={i} className="service-tag">{service}</span>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="profile-section">
        <h2>⭐ Reviews ({mechanic.reviews?.length || 0})</h2>
        <div className="reviews-list">
          {mechanic.reviews?.length > 0 ? (
            mechanic.reviews.map((review, i) => (
              <div key={i} className="glass-card review-card">
                <div className="review-header">
                  <span className="review-author">👤 {review.userName}</span>
                  <StarRating rating={review.rating} showValue={false} />
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
          )}
        </div>
      </div>

      {/* Add Review Form */}
      <div className="profile-section">
        <h2>✍️ Leave a Review</h2>
        <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
          <form onSubmit={handleSubmitReview} className="auth-form">
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-input"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select
                className="filter-select"
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Terrible</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <input
                type="text"
                className="form-input"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your experience..."
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
