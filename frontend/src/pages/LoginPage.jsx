import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

/**
 * LoginPage — distinct sign-in page with left illustration panel.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page" id="login-page">
      {/* Left panel — illustration / branding */}
      <div className="auth-hero-panel login-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-icon">🔑</div>
          <h2>Welcome Back!</h2>
          <p>Sign in to access your dashboard, track your service history, and connect with trusted mechanics near you.</p>
          <div className="auth-hero-features">
            <div className="auth-hero-feature"><span>✅</span> Track service history</div>
            <div className="auth-hero-feature"><span>✅</span> Quick SOS access</div>
            <div className="auth-hero-feature"><span>✅</span> Save favorite mechanics</div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Sign In</h1>
            <p className="auth-subtitle">Enter your credentials to continue</p>
          </div>

          {successMessage && <div className="auth-success">{successMessage}</div>}
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                  id="login-email"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="form-input input-with-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  id="login-password"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="login-submit">
              {loading ? '⏳ Signing in...' : '🔓 Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
