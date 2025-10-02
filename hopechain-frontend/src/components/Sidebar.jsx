import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Sidebar.css';

const Sidebar = ({ isOpen = true, onClose, isMobile = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarClass = `sidebar ${isMobile ? 'sidebar-mobile' : ''} ${isOpen ? 'sidebar-open' : ''}`;

  return (
    <aside className={sidebarClass}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">HC</div>
            <span className="logo-text">HopeChain</span>
          </div>
          {isMobile && (
            <button className="sidebar-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Main</h3>
            <Link 
              to="/dashboard" 
              className={`nav-item ${isActivePath('/dashboard') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link 
              to="/browse" 
              className={`nav-item ${isActivePath('/browse') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span>Browse</span>
            </Link>

            <Link 
              to="/create-post" 
              className={`nav-item ${isActivePath('/create-post') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Create Post</span>
            </Link>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Connect</h3>
            <Link 
              to="/connections" 
              className={`nav-item ${isActivePath('/connections') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Connections</span>
            </Link>

            <Link 
              to="/messages" 
              className={`nav-item ${isActivePath('/messages') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Messages</span>
              <span className="nav-badge">3</span>
            </Link>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Account</h3>
            <Link 
              to="/profile" 
              className={`nav-item ${isActivePath('/profile') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile</span>
            </Link>

            <Link 
              to="/settings" 
              className={`nav-item ${isActivePath('/settings') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
