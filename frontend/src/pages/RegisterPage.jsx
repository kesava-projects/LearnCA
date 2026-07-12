import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PASSWORD_RULES = [
  { test: (p) => p.length >= 6,    label: 'At least 6 characters' },
  { test: (p) => /\d/.test(p),     label: 'Contains a number' },
];

const RegisterPage = () => {
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShow] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6 || !/\d/.test(form.password)) {
      setError('Password must be at least 6 characters and contain a number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(form.name, form.email, form.password);
      setSuccess('Account created! Redirecting to login…');
      toast.success('Account created successfully! 🎉');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
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

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Register to access CA Final video lectures and start your exam preparation.
          </p>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} id="register-form" noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><User size={16} /></span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="form-input"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><Mail size={16} /></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="form-input"
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
                  autoComplete="new-password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShow((p) => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength hints */}
              {form.password && (
                <ul style={{ listStyle: 'none', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {PASSWORD_RULES.map((rule) => (
                    <li
                      key={rule.label}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: '0.78rem',
                        color: rule.test(form.password) ? 'var(--success)' : 'var(--text-muted)',
                      }}
                    >
                      {rule.test(form.password) ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {rule.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm">Confirm Password</label>
              <div className="form-input-wrapper">
                <span className="form-input-icon"><Lock size={16} /></span>
                <input
                  id="confirm"
                  name="confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input${form.confirm && form.confirm !== form.password ? ' error' : ''}`}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="form-error"><AlertCircle size={12} /> Passwords do not match</p>
              )}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading && <span className="btn-spinner" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-illustration">
          <div style={{ fontSize: '4rem', marginBottom: 24 }}>📚</div>
          <h2>
            Start Your Journey to<br />
            <span className="gradient-text">CA Final Success</span>
          </h2>
          <p>
            Join and get instant access to expert-curated video lectures covering all CA Final subjects.
          </p>

          <ul className="feature-list">
            <li>
              <div className="feature-icon">🎯</div>
              <span>Topic-wise structured video lessons</span>
            </li>
            <li>
              <div className="feature-icon">🔒</div>
              <span>Your account, your exclusive access — no sharing</span>
            </li>
            <li>
              <div className="feature-icon">⚡</div>
              <span>Instant access after registration</span>
            </li>
            <li>
              <div className="feature-icon">📊</div>
              <span>FR, SFM, Audit, DT, IDT & SCM all covered</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
