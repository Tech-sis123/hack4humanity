import { useState } from 'react';
import { RESOURCE_TYPE_INFO, URGENCY_INFO } from '../services/postService';
import './PostCard.css';

const NeedCard = ({ 
  need, 
  onConnect, 
  onViewDetails, 
  showActions = true,
  size = 'medium' 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const resourceInfo = RESOURCE_TYPE_INFO[need.resourceType] || RESOURCE_TYPE_INFO.other;
  const urgencyInfo = URGENCY_INFO[need.urgency] || URGENCY_INFO.medium;
  
  const handleConnect = async () => {
    if (isConnecting || !onConnect) return;
    
    setIsConnecting(true);
    try {
      await onConnect(need);
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeLeft = () => {
    if (!need.deadline) return null;
    
    const deadline = new Date(need.deadline);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Deadline passed';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks left`;
    return `${Math.ceil(diffDays / 30)} months left`;
  };

  const getStatusClass = () => {
    if (need.isActive === false) return 'inactive';
    if (need.isFulfilled) return 'fulfilled';
    if (need.urgency === 'critical') return 'critical';
    return 'active';
  };

  const timeLeft = getTimeLeft();
  const statusClass = getStatusClass();

  return (
    <div className={`post-card need-card ${size} ${statusClass}`}>
      <div className="card-header">
        <div className="resource-badge" style={{ '--resource-color': resourceInfo.color }}>
          <span className="resource-icon">{resourceInfo.icon}</span>
          <span className="resource-label">{resourceInfo.label}</span>
        </div>
        
        <div className="urgency-badge" style={{ '--urgency-color': urgencyInfo.color }}>
          <span className="urgency-icon">{urgencyInfo.icon}</span>
          <span className="urgency-label">{urgencyInfo.label}</span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="post-title">{need.title}</h3>
        <p className="post-description">{need.description}</p>
        
        <div className="post-details">
          {need.quantity && (
            <div className="detail-item">
              <span className="detail-icon">📦</span>
              <span className="detail-text">Needed: {need.quantity} {need.unit || 'items'}</span>
            </div>
          )}
          
          {need.location && (
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span className="detail-text">{need.location}</span>
            </div>
          )}
          
          {timeLeft && (
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <span className="detail-text">{timeLeft}</span>
            </div>
          )}
          
          {need.contactMethod && (
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <span className="detail-text">{need.contactMethod}</span>
            </div>
          )}
          
          {need.beneficiaries && (
            <div className="detail-item">
              <span className="detail-icon">👥</span>
              <span className="detail-text">For {need.beneficiaries} people</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div className="post-meta">
          <div className="author-info">
            <div className="author-avatar">
              {need.author?.avatar ? (
                <img src={need.author.avatar} alt={need.author.name} />
              ) : (
                need.author?.name?.charAt(0).toUpperCase() || '👤'
              )}
            </div>
            <div className="author-details">
              <span className="author-name">{need.author?.name || 'Anonymous'}</span>
              <span className="post-date">Posted {formatDate(need.createdAt)}</span>
            </div>
          </div>
          
          {need.isFulfilled && (
            <div className="fulfillment-badge">
              <span className="fulfillment-icon">✅</span>
              <span className="fulfillment-text">Fulfilled</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="card-actions">
            {onViewDetails && (
              <button 
                onClick={() => onViewDetails(need)}
                className="action-button secondary"
              >
                View Details
              </button>
            )}
            
            {onConnect && !need.isFulfilled && need.isActive !== false && (
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="action-button primary help-button"
              >
                {isConnecting ? 'Connecting...' : 'Offer Help 💝'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NeedCard;