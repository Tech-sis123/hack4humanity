import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, isAuthenticated } from '../services/authService';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Check if current page should show navigation
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);
  const showNavigation = authenticated && !isAuthPage;

  return (
    <header className="header">
      <div className="header-container">
        {/* Mobile menu button */}
        {showNavigation && (
          <button 
            className="mobile-menu-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Logo */}
        <Link to={authenticated ? "/dashboard" : "/"} className="logo-link">
          <div className="header-logo">
            <div className="logo-icon">HC</div>
            <span className="logo-text">HopeChain</span>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="header-actions">
          {!authenticated && (
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
              <Link to="/register" className="auth-link register-link">
                Sign Up
              </Link>
            </div>
          )}
          
          {authenticated && (
            <div className="user-menu">
              <button className="notification-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="notification-badge">2</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;