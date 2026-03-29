/**
 * StarRating — displays filled/empty stars and numeric value.
 * Props: rating (number), showValue (bool)
 */
export default function StarRating({ rating = 0, showValue = true }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<span key={i} className="star">★</span>);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<span key={i} className="star">★</span>);
    } else {
      stars.push(<span key={i} className="star empty">★</span>);
    }
  }

  return (
    <span className="star-rating">
      {stars}
      {showValue && <span className="rating-value">{rating.toFixed(1)}</span>}
    </span>
  );
}
