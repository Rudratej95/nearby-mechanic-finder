import { Link } from 'react-router-dom';
import StarRating from './StarRating';

/**
 * MechanicCard — summary card for mechanic list.
 * Shows avatar, name, specialization, rating, location, phone, and availability.
 */
export default function MechanicCard({ mechanic }) {
  const { _id, name, profileImage, specialization, rating, address, phone, availability } = mechanic;

  return (
    <Link to={`/mechanic/${_id}`} className="glass-card mechanic-card" id={`mechanic-card-${_id}`}>
      <img
        src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=200`}
        alt={name}
        className="mechanic-card-avatar"
      />

      <div className="mechanic-card-info">
        <h3 className="mechanic-card-name">{name}</h3>
        <p className="mechanic-card-spec">{specialization}</p>

        <div className="mechanic-card-meta">
          <StarRating rating={rating} />
          <span>📍 {address || 'Location N/A'}</span>
          <span>📞 {phone}</span>
          <span className={`availability-badge ${availability}`}>
            <span className="availability-dot"></span>
            {availability}
          </span>
        </div>
      </div>
    </Link>
  );
}
