import { Link, useNavigate } from 'react-router-dom';
import { LogOut, GraduationCap, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/courses" className="navbar-logo">
          <div className="logo-icon">
            <GraduationCap size={20} color="white" />
          </div>
          <span className="gradient-text">LearnCA</span>
        </Link>

        {user && (
          <div className="navbar-right">
            <div className="user-badge">
              <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span>{user.name}</span>
              {user.role === 'admin' && (
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-3)', fontWeight: 700 }}>
                  ADMIN
                </span>
              )}
            </div>
            <button className="btn-logout" onClick={handleLogout} id="logout-btn">
              <LogOut size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
