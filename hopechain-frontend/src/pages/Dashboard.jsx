import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { testAuthFlow } from '../services/authTest';
import LoadingSpinner from '../components/LoadingSpinner';
import BlockchainBadge from '../components/BlockchainBadge';
import { testConnection } from '../services/testConnection';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [authTestResult, setAuthTestResult] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        console.log('User data received:', userData);
        setUser(userData.data?.user || userData.user || userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    const checkConnection = async () => {
      const result = await testConnection();
      setConnectionStatus(result);
      console.log('Connection test result:', result);
    };

    fetchUserData();
    checkConnection();
  }, []);

  const handleTestAuth = async () => {
    setLoading(true);
    try {
      const result = await testAuthFlow();
      setAuthTestResult(result);
      console.log('Auth test result:', result);
    } catch (err) {
      console.error('Auth test error:', err);
      setAuthTestResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !authTestResult) {
    return <LoadingSpinner size="large" message="Loading your dashboard..." />;
  }

  if (error && !authTestResult) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="welcome-text">
            <h1>Welcome back, {user?.name || 'Friend'}!</h1>
            <p className="welcome-subtitle">
              Together, we're building a world of hope and connection
            </p>
          </div>
        </div>
        
        <div className="user-type-badge">
          <span className={`badge ${user?.type || 'user'}`}>
            {user?.type === 'donor' ? 'Helper' : 'Seeker'}
          </span>
        </div>
      </div>

      {connectionStatus && (
        <div className={`connection-status ${connectionStatus.success ? 'success' : 'error'}`}>
          <h3>Backend Connection Status</h3>
          <p>{connectionStatus.message}</p>
          {connectionStatus.success ? (
            <div className="status-details">
              <p>✓ Health Check: {connectionStatus.data.health.message}</p>
              <p>✓ API Test: {connectionStatus.data.api.message}</p>
            </div>
          ) : (
            <p className="error-message">⚠ {connectionStatus.error}</p>
          )}
        </div>
      )}

      {authTestResult && (
        <div className={`connection-status ${authTestResult.success ? 'success' : 'error'}`}>
          <h3>Authentication Test Result</h3>
          {authTestResult.success ? (
            <div className="status-details">
              <p>✓ Registration: Success</p>
              <p>✓ User Data: {JSON.stringify(authTestResult.data.user)}</p>
            </div>
          ) : (
            <p className="error-message">✗ Error: {authTestResult.error}</p>
          )}
        </div>
      )}

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3>Hope Points</h3>
            <div className="stat-number">42</div>
            <p>Points earned through connections</p>
            <div className="stat-trend positive">↑ 12% from last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Connections</h3>
            <div className="stat-number">3</div>
            <p>Meaningful relationships built</p>
            <div className="stat-trend neutral">→ Same as last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <h3>Impact</h3>
            <div className="stat-number">7</div>
            <p>Lives touched through kindness</p>
            <div className="stat-trend positive">↑ 3 from last month</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                <path d="M13 12h3a2 2 0 0 1 2 2v1"></path>
                <path d="M11 12H8a2 2 0 0 0-2 2v1"></path>
              </svg>
            </div>
            <h3>Blockchain Verified</h3>
            <div className="stat-number">
              <BlockchainBadge status="verified" size="large" prominent={true} />
            </div>
            <p>All your connections are blockchain verified</p>
            <div className="stat-trend positive">100% verified</div>
          </div>
        </div>

        <div className="action-section">
          <h2>What would you like to do today?</h2>
          <div className="action-cards">
            <div className="action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <h3>Browse Community</h3>
              <p>Discover offers and needs in your community</p>
              <button 
                className="action-button"
                onClick={() => window.location.href = '/browse'}
              >
                Start Browsing
              </button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <h3>Share Your Heart</h3>
              <p>Offer help or share what you need with the community</p>
              <button 
                className="action-button"
                onClick={() => window.location.href = '/create-post'}
              >
                Create Post
              </button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>My Connections</h3>
              <p>View and manage your current connections and conversations</p>
              <button 
                className="action-button"
                onClick={() => window.location.href = '/connections'}
              >
                View Connections
              </button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h3>Test Authentication</h3>
              <p>Run a test of the authentication flow</p>
              <button 
                className="action-button"
                onClick={handleTestAuth}
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Run Test'}
              </button>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <div className="activity-content">
                <p><strong>Welcome to HopeChain!</strong></p>
                <p className="activity-time">Just now</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="activity-content">
                <p>Profile created successfully</p>
                <p className="activity-time">A moment ago</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  <path d="M13 12h3a2 2 0 0 1 2 2v1"></path>
                  <path d="M11 12H8a2 2 0 0 0-2 2v1"></path>
                </svg>
              </div>
              <div className="activity-content">
                <p>First connection verified on blockchain</p>
                <p className="activity-time">Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;