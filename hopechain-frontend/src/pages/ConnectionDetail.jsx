import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { RESOURCE_TYPE_INFO } from '../services/postService';
import LoadingSpinner from '../components/LoadingSpinner';
import BlockchainBadge from '../components/BlockchainBadge';
import './ConnectionDetail.css';

const ConnectionDetail = () => {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connection, setConnection] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (connectionId) {
      fetchConnectionDetails();
    }
  }, [connectionId]);

  const fetchConnectionDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await postService.getConnection(connectionId);
      setConnection(data);
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to load connection details. Please try again.');
      console.error('Error fetching connection:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    
    try {
      await postService.updateConnection(connectionId, { status: newStatus });
      await fetchConnectionDetails(); // Refresh the data
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setActionLoading(true);
    
    try {
      await postService.updateConnection(connectionId, { 
        action: 'addMessage',
        message: newMessage.trim()
      });
      setNewMessage('');
      await fetchConnectionDetails(); // Refresh to get new message
    } catch (err) {
      alert(`Failed to send message: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffDays === 2) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        icon: '⏳', 
        label: 'Pending Response', 
        color: '#ffc107',
        description: 'Waiting for the other person to respond'
      },
      active: { 
        icon: '🤝', 
        label: 'Active Connection', 
        color: '#28a745',
        description: 'Both parties have agreed to help each other'
      },
      completed: { 
        icon: '✅', 
        label: 'Successfully Completed', 
        color: '#6c757d',
        description: 'This connection has been marked as complete'
      },
      cancelled: { 
        icon: '❌', 
        label: 'Connection Cancelled', 
        color: '#dc3545',
        description: 'This connection was cancelled by one of the parties'
      }
    };
    
    return configs[status] || configs.pending;
  };

  // Function to truncate transaction hash for display
  const truncateHash = (hash) => {
    if (!hash) return '';
    if (hash.length <= 20) return hash;
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  // Function to simulate viewing on blockchain
  const handleViewOnBlockchain = (hash) => {
    // In a real implementation, this would link to a blockchain explorer
    // For demo purposes, we'll show an alert with the full hash
    alert(`In a real implementation, this would take you to the blockchain explorer for transaction:\n\n${hash}`);
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading connection details..." />;
  }

  if (error || !connection) {
    return (
      <div className="connection-detail-container">
        <div className="error-state">
          <h2>⚠️ Unable to Load Connection</h2>
          <p>{error || 'Connection not found'}</p>
          <div className="error-actions">
            <button onClick={() => navigate('/connections')} className="back-button">
              Back to Connections
            </button>
            {error && (
              <button onClick={fetchConnectionDetails} className="retry-button">
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const post = connection.post || {};
  const otherUser = connection.otherUser || {};
  const resourceInfo = RESOURCE_TYPE_INFO[post.resourceType] || RESOURCE_TYPE_INFO.other;
  const statusConfig = getStatusConfig(connection.status);
  const isOffer = post.type === 'offer' || !post.urgency;

  return (
    <div className="connection-detail-container">
      <div className="detail-header">
        <button 
          onClick={() => navigate('/connections')}
          className="back-button"
        >
          ← Back to Connections
        </button>
        
        <div className="status-display">
          <span 
            className="status-badge large" 
            style={{ '--status-color': statusConfig.color }}
          >
            <span className="status-icon">{statusConfig.icon}</span>
            <span className="status-label">{statusConfig.label}</span>
          </span>
        </div>
      </div>

      <div className="connection-overview">
        <div className="post-summary">
          <div className="post-header">
            <div className="resource-badge" style={{ '--resource-color': resourceInfo.color }}>
              <span className="resource-icon">{resourceInfo.icon}</span>
              <span className="resource-label">{resourceInfo.label}</span>
            </div>
            <div className="post-type-badge">
              {isOffer ? '💝 Offer' : '🙏 Need'}
            </div>
          </div>
          
          <h1 className="post-title">{post.title}</h1>
          <p className="post-description">{post.description}</p>
          
          <div className="post-details">
            {post.location && (
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{post.location}</span>
              </div>
            )}
            {post.quantity && (
              <div className="detail-item">
                <span className="detail-icon">📦</span>
                <span className="detail-text">{post.quantity} {post.unit || 'items'}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <span className="detail-text">Connected {formatDate(connection.createdAt)}</span>
            </div>
            
            {/* Blockchain Information */}
            {connection.transactionHash && (
              <div className="detail-item blockchain-info">
                <span className="detail-icon">🔗</span>
                <div className="blockchain-details">
                  <span className="detail-text">
                    Transaction: 
                    <span className="hash-value" title={connection.transactionHash}>
                      {' '}{truncateHash(connection.transactionHash)}
                    </span>
                  </span>
                  <div className="blockchain-actions">
                    <button 
                      className="btn-blockchain"
                      onClick={() => handleViewOnBlockchain(connection.transactionHash)}
                    >
                      View on Blockchain
                    </button>
                    <BlockchainBadge status="verified" size="medium" prominent={true} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="participants-section">
          <h2>Connection Participants</h2>
          <div className="participants-grid">
            <div className="participant-card">
              <div className="participant-avatar large">
                {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={otherUser.name} />
                ) : (
                  otherUser.name?.charAt(0).toUpperCase() || '👤'
                )}
              </div>
              <div className="participant-info">
                <h3 className="participant-name">{otherUser.name || 'Anonymous User'}</h3>
                <p className="participant-role">
                  {isOffer ? 'Offering Help' : 'Seeking Help'}
                </p>
                {otherUser.location && (
                  <p className="participant-location">📍 {otherUser.location}</p>
                )}
                {otherUser.did && (
                  <div className="participant-did">
                    <span className="did-label">DID: </span>
                    <span className="did-value" title={otherUser.did}>
                      {truncateHash(otherUser.did)}
                    </span>
                    <BlockchainBadge status="verified" size="small" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="connection-bridge">
              <div className="bridge-line"></div>
              <div className="bridge-icon">🤝</div>
              <div className="bridge-line"></div>
            </div>
            
            <div className="participant-card">
              <div className="participant-avatar large">You</div>
              <div className="participant-info">
                <h3 className="participant-name">You</h3>
                <p className="participant-role">
                  {isOffer ? 'Seeking Help' : 'Offering Help'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="status-section">
        <h2>Connection Status</h2>
        <div className="status-card">
          <div className="status-info">
            <div className="status-icon-large">{statusConfig.icon}</div>
            <div className="status-details">
              <h3>{statusConfig.label}</h3>
              <p>{statusConfig.description}</p>
            </div>
          </div>
          
          <div className="status-actions">
            {connection.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('active')}
                  disabled={actionLoading}
                  className="action-button primary"
                >
                  {actionLoading ? 'Processing...' : 'Accept Connection'}
                </button>
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={actionLoading}
                  className="action-button danger"
                >
                  {actionLoading ? 'Processing...' : 'Decline'}
                </button>
              </>
            )}
            
            {connection.status === 'active' && (
              <button
                onClick={() => handleStatusUpdate('completed')}
                disabled={actionLoading}
                className="action-button success"
              >
                {actionLoading ? 'Processing...' : 'Mark as Complete'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="messages-section">
        <h2>Messages</h2>
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.fromCurrentUser ? 'own' : 'other'}`}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">{formatDate(message.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {connection.status !== 'cancelled' && (
            <form onSubmit={handleSendMessage} className="message-form">
              <div className="message-input-group">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows="3"
                  disabled={actionLoading}
                />
                <button
                  type="submit"
                  disabled={actionLoading || !newMessage.trim()}
                  className="send-button"
                >
                  {actionLoading ? '⏳' : '📤'} Send
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionDetail;