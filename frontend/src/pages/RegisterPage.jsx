import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

/**
 * RegisterPage — distinct sign-up page with left illustration panel.
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', { name, email, password, role });
      // Redirect to login instead of auto-logging in
      navigate('/login', { state: { message: 'Registration successful! Please sign in with your new account.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page" id="register-page">
      {/* Left panel — illustration / branding */}
      <div className="auth-hero-panel register-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-icon">🚀</div>
          <h2>Join MechFinder</h2>
          <p>Create your free account and get instant access to the best mechanics in your area.</p>
          <div className="auth-hero-features">
            <div className="auth-hero-feature"><span>🔧</span> Find mechanics instantly</div>
            <div className="auth-hero-feature"><span>🗺️</span> Live map navigation</div>
            <div className="auth-hero-feature"><span>🚨</span> Emergency SOS alerts</div>
            <div className="auth-hero-feature"><span>⭐</span> Read verified reviews</div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p className="auth-subtitle">Fill in your details to get started</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  className="form-input input-with-icon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  id="register-name"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  className="form-input input-with-icon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  id="register-email"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    className="form-input input-with-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    id="register-password"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    className="form-input input-with-icon"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    minLength={6}
                    id="register-confirm-password"
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="role-selector">
                <label className={`role-option ${role === 'user' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} />
                  <span className="role-icon">🚗</span>
                  <span className="role-label">Vehicle Owner</span>
                </label>
                <label className={`role-option ${role === 'mechanic' ? 'active' : ''}`}>
                  <input type="radio" name="role" value="mechanic" checked={role === 'mechanic'} onChange={() => setRole('mechanic')} />
                  <span className="role-icon">🔧</span>
                  <span className="role-label">Mechanic</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="register-submit">
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
