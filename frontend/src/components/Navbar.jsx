import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar — site-wide navigation with auth-aware UI.
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🔧</span>
        <span>MechFinder</span>
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {isAuthenticated ? (
          <>
            <span className="navbar-user">
              👤 {user?.name}
            </span>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
