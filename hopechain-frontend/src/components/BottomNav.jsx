import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav">
      <Link 
        to="/dashboard" 
        className={`bottom-nav-item ${isActivePath('/dashboard') ? 'active' : ''}`}
      >
        <svg className="bottom-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span className="bottom-nav-label">Home</span>
      </Link>

      <Link 
        to="/browse" 
        className={`bottom-nav-item ${isActivePath('/browse') ? 'active' : ''}`}
      >
        <svg className="bottom-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <span className="bottom-nav-label">Browse</span>
      </Link>

      <Link 
        to="/create-post" 
        className={`bottom-nav-item create-button ${isActivePath('/create-post') ? 'active' : ''}`}
      >
        <div className="create-icon-wrapper">
          <svg className="bottom-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <span className="bottom-nav-label">Create</span>
      </Link>

      <Link 
        to="/messages" 
        className={`bottom-nav-item ${isActivePath('/messages') ? 'active' : ''}`}
      >
        <div className="icon-with-badge">
          <svg className="bottom-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span className="message-badge">3</span>
        </div>
        <span className="bottom-nav-label">Messages</span>
      </Link>

      <Link 
        to="/profile" 
        className={`bottom-nav-item ${isActivePath('/profile') ? 'active' : ''}`}
      >
        <svg className="bottom-nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span className="bottom-nav-label">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
