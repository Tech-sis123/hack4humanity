import { useState } from 'react';
import { RESOURCE_TYPE_INFO } from '../services/postService';
import './PostCard.css';

const OfferCard = ({ 
  offer, 
  onConnect, 
  onViewDetails, 
  showActions = true,
  size = 'medium' 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const resourceInfo = RESOURCE_TYPE_INFO[offer.resourceType] || RESOURCE_TYPE_INFO.other;
  
  const handleConnect = async () => {
    if (isConnecting || !onConnect) return;
    
    setIsConnecting(true);
    try {
      await onConnect(offer);
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

  const getAvailabilityStatus = () => {
    if (offer.isActive === false) return 'inactive';
    if (offer.quantity && offer.quantity <= 0) return 'unavailable';
    return 'available';
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div className={`post-card offer-card ${size} ${availabilityStatus}`}>
      <div className="card-header">
        <div className="resource-badge" style={{ '--resource-color': resourceInfo.color }}>
          <span className="resource-icon">{resourceInfo.icon}</span>
          <span className="resource-label">{resourceInfo.label}</span>
        </div>
        
        <div className="post-status">
          {availabilityStatus === 'available' && (
            <span className="status-badge available">✓ Available</span>
          )}
          {availabilityStatus === 'unavailable' && (
            <span className="status-badge unavailable">✗ Unavailable</span>
          )}
          {availabilityStatus === 'inactive' && (
            <span className="status-badge inactive">⏸ Inactive</span>
          )}
        </div>
      </div>

      <div className="card-content">
        <h3 className="post-title">{offer.title}</h3>
        <p className="post-description">{offer.description}</p>
        
        <div className="post-details">
          {offer.quantity && (
            <div className="detail-item">
              <span className="detail-icon">📦</span>
              <span className="detail-text">Quantity: {offer.quantity} {offer.unit || 'items'}</span>
            </div>
          )}
          
          {offer.location && (
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span className="detail-text">{offer.location}</span>
            </div>
          )}
          
          {offer.availability && (
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <span className="detail-text">{offer.availability}</span>
            </div>
          )}
          
          {offer.contactMethod && (
            <div className="detail-item">
              <span className="detail-icon">📞</span>
              <span className="detail-text">{offer.contactMethod}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div className="post-meta">
          <div className="author-info">
            <div className="author-avatar">
              {offer.author?.avatar ? (
                <img src={offer.author.avatar} alt={offer.author.name} />
              ) : (
                offer.author?.name?.charAt(0).toUpperCase() || '👤'
              )}
            </div>
            <div className="author-details">
              <span className="author-name">{offer.author?.name || 'Anonymous'}</span>
              <span className="post-date">Posted {formatDate(offer.createdAt)}</span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="card-actions">
            {onViewDetails && (
              <button 
                onClick={() => onViewDetails(offer)}
                className="action-button secondary"
              >
                View Details
              </button>
            )}
            
            {onConnect && availabilityStatus === 'available' && (
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="action-button primary"
              >
                {isConnecting ? 'Connecting...' : 'Connect 🤝'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCard;