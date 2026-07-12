import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from another page, go back there after login
  const from = location.state?.from?.pathname || '/courses';

  // Show banner if session was superseded
  const reason = new URLSearchParams(location.search).get('reason');
  const superseded = reason === 'session_superseded';

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎓');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left panel: Form ── */}
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="logo-icon">
              <GraduationCap size={24} color="white" />
            </div>
            <span className="gradient-text">LearnCA</span>
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to access your CA Final video lectures and study materials.
          </p>

          {/* Session superseded warning */}
          {superseded && (
            <div className="alert alert-warning">
              <AlertCircle size={16} />
              You were logged out because your account was accessed from another device.
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} id="login-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><Mail size={16} /></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input${error ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><Lock size={16} /></span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`form-input${error ? ' error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading && <span className="btn-spinner" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel: Illustration ── */}
      <div className="auth-right">
        <div className="auth-illustration">
          <div style={{ fontSize: '4rem', marginBottom: 24 }}>🎓</div>
          <h2>
            Master <span className="gradient-text">CA Final</span><br />with Confidence
          </h2>
          <p>
            Access premium video lectures for all CA Final subjects — FR, SFM, Audit, Direct Tax, IDT, and more.
          </p>

          <ul className="feature-list">
            <li>
              <div className="feature-icon">🔐</div>
              <span>Secure, session-protected access — only you can watch</span>
            </li>
            <li>
              <div className="feature-icon">📹</div>
              <span>HD video lectures with seekable playback</span>
            </li>
            <li>
              <div className="feature-icon">📚</div>
              <span>All 6 CA Final subjects covered comprehensively</span>
            </li>
            <li>
              <div className="feature-icon">🏆</div>
              <span>Curated content to help you clear in first attempt</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
