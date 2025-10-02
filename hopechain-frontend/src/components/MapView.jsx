import { useState, useEffect } from 'react';
import './MapView.css';

const MapView = ({ posts = [], onPostSelect }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });

  // Group posts by location for the map
  const getLocationGroups = () => {
    const locationMap = {};
    
    posts.forEach(post => {
      if (post.location) {
        if (!locationMap[post.location]) {
          locationMap[post.location] = [];
        }
        locationMap[post.location].push(post);
      }
    });
    
    return Object.entries(locationMap);
  };

  const locationGroups = getLocationGroups();

  const handleLocationClick = (location, posts) => {
    setSelectedPost({ location, posts });
    // In a real implementation, we would center the map on this location
    // For demo purposes, we'll just show the posts in a sidebar
  };

  const handleClosePopup = () => {
    setSelectedPost(null);
  };

  return (
    <div className="map-view-container">
      <div className="map-placeholder">
        <div className="map-header">
          <h3>Community Map</h3>
          <p>Click on locations to see posts</p>
        </div>
        
        <div className="map-content">
          {/* Simple visual representation of locations */}
          {locationGroups.map(([location, posts], index) => {
            // Calculate pseudo-random positions for demo purposes
            const position = {
              left: `${20 + (index * 15) % 60}%`,
              top: `${30 + (index * 25) % 40}%`
            };
            
            const offersCount = posts.filter(p => !p.urgency).length;
            const needsCount = posts.filter(p => p.urgency).length;
            
            return (
              <div
                key={location}
                className="location-marker"
                style={position}
                onClick={() => handleLocationClick(location, posts)}
              >
                <div className="marker-icon">📍</div>
                <div className="marker-label">{location}</div>
                <div className="marker-stats">
                  <span className="offers-count">💝 {offersCount}</span>
                  <span className="needs-count">🙏 {needsCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPost && (
        <div className="location-popup">
          <div className="popup-header">
            <h4>{selectedPost.location}</h4>
            <button onClick={handleClosePopup} className="close-button">×</button>
          </div>
          
          <div className="popup-content">
            <div className="posts-list">
              {selectedPost.posts.map(post => (
                <div 
                  key={post.id} 
                  className="post-preview"
                  onClick={() => onPostSelect && onPostSelect(post)}
                >
                  <div className="post-type">
                    {post.urgency ? '🙏 Need' : '💝 Offer'}
                  </div>
                  <h5 className="post-title">{post.title}</h5>
                  <p className="post-description">{post.description}</p>
                  <div className="post-meta">
                    <span className="post-author">{post.author?.name || 'Anonymous'}</span>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;