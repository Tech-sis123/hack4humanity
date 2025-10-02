import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import LoadingSpinner from '../components/LoadingSpinner';
import exportService from '../services/exportService';
import './Matches.css';

const Matches = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending', 'active', 'completed', 'cancelled'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [connections, activeFilter, searchTerm]);

  const fetchConnections = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await postService.getConnections();
      setConnections(data.connections || data || []);
    } catch (err) {
      setError('Failed to load connections. Please try again.');
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...connections];
    
    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(conn => conn.status === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(conn => 
        (conn.post?.title && conn.post.title.toLowerCase().includes(term)) ||
        (conn.otherUser?.name && conn.otherUser.name.toLowerCase().includes(term)) ||
        (conn.messages && conn.messages.some(msg => 
          msg.text && msg.text.toLowerCase().includes(term)
        ))
      );
    }
    
    setFilteredConnections(filtered);
  };

  const handleViewConnection = (connectionId) => {
    navigate(`/connections/${connectionId}`);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        icon: '⏳', 
        label: 'Pending', 
        color: '#ffc107',
        description: 'Waiting for response'
      },
      active: { 
        icon: '🤝', 
        label: 'Active', 
        color: '#28a745',
        description: 'Connection established'
      },
      completed: { 
        icon: '✅', 
        label: 'Completed', 
        color: '#6c757d',
        description: 'Successfully completed'
      },
      cancelled: { 
        icon: '❌', 
        label: 'Cancelled', 
        color: '#dc3545',
        description: 'Connection cancelled'
      }
    };
    
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Export connections data
  const handleExportConnections = () => {
    exportService.exportConnections(connections);
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading your connections..." />;
  }

  return (
    <div className="matches-container">
      <div className="matches-header">
        <div className="header-content">
          <h1>🤝 My Connections</h1>
          <p>Manage your active connections and conversations</p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleExportConnections}
            className="export-button"
          >
            📤 Export Data
          </button>
        </div>
      </div>

      <div className="matches-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-tabs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          >
            All Connections
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`filter-tab ${activeFilter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={fetchConnections} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {filteredConnections.length === 0 ? (
        <div className="no-connections">
          <div className="no-connections-icon">🤝</div>
          <h3>No connections found</h3>
          <p>
            {activeFilter === 'all' 
              ? "You don't have any connections yet. Start by browsing posts and connecting with others!"
              : "No connections match your current filter. Try changing your filter or search term."
            }
          </p>
          <button 
            onClick={() => navigate('/browse')} 
            className="browse-button"
          >
            Browse Community Posts
          </button>
        </div>
      ) : (
        <div className="connections-grid">
          {filteredConnections.map((connection) => {
            const post = connection.post || {};
            const otherUser = connection.otherUser || {};
            const statusConfig = getStatusConfig(connection.status);
            
            return (
              <div key={connection.id} className="connection-card">
                <div className="card-header">
                  <div className="post-info">
                    <h3 className="post-title">{post.title || 'Untitled Post'}</h3>
                    <p className="post-type">
                      {post.urgency ? '🙏 Need' : '💝 Offer'}
                    </p>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ '--status-color': statusConfig.color }}
                  >
                    <span className="status-icon">{statusConfig.icon}</span>
                    <span className="status-label">{statusConfig.label}</span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="participants">
                    <div className="participant">
                      <div className="participant-avatar">
                        {otherUser.avatar ? (
                          <img src={otherUser.avatar} alt={otherUser.name} />
                        ) : (
                          otherUser.name?.charAt(0).toUpperCase() || '👤'
                        )}
                      </div>
                      <div className="participant-info">
                        <span className="participant-name">{otherUser.name || 'Anonymous'}</span>
                        <span className="participant-role">
                          {post.urgency ? 'Offering Help' : 'Seeking Help'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="connection-indicator">⟷</div>
                    
                    <div className="participant">
                      <div className="participant-avatar">You</div>
                      <div className="participant-info">
                        <span className="participant-name">You</span>
                        <span className="participant-role">
                          {post.urgency ? 'Seeking Help' : 'Offering Help'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="connection-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">Connected {formatDate(connection.createdAt)}</span>
                    </div>
                    
                    {connection.messages && connection.messages.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-icon">💬</span>
                        <span className="detail-text">
                          {connection.messages.length} message{connection.messages.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    onClick={() => handleViewConnection(connection.id)}
                    className="view-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;