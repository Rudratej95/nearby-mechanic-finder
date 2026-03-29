/**
 * SearchFilter — search input + rating/availability dropdowns.
 * Props: search, onSearchChange, ratingFilter, onRatingChange,
 *        availabilityFilter, onAvailabilityChange
 */
export default function SearchFilter({
  search,
  onSearchChange,
  ratingFilter,
  onRatingChange,
  availabilityFilter,
  onAvailabilityChange
}) {
  return (
    <div className="search-filter" id="search-filter">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="form-input"
          placeholder="Search mechanics by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-input"
        />
      </div>

      <select
        className="filter-select"
        value={ratingFilter}
        onChange={(e) => onRatingChange(e.target.value)}
        id="rating-filter"
      >
        <option value="">All Ratings</option>
        <option value="4.5">4.5+ Stars</option>
        <option value="4">4+ Stars</option>
        <option value="3">3+ Stars</option>
      </select>

      <select
        className="filter-select"
        value={availabilityFilter}
        onChange={(e) => onAvailabilityChange(e.target.value)}
        id="availability-filter"
      >
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="busy">Busy</option>
        <option value="offline">Offline</option>
      </select>
    </div>
  );
}
