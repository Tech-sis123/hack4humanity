import { useState, useEffect } from 'react';
import realtimeService from '../services/realtimeService';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    const subscriptionId = realtimeService.subscribe(handleUpdate);
    
    // Start polling for updates
    realtimeService.startPolling();
    
    // Cleanup on unmount
    return () => {
      realtimeService.unsubscribe(subscriptionId);
      realtimeService.stopPolling();
    };
  }, []);

  const handleUpdate = (update) => {
    // Create a new notification
    const notification = {
      id: Date.now(),
      ...update,
      read: false,
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Add to notifications list
    setNotifications(prev => [notification, ...prev].slice(0, 5)); // Keep only last 5
    
    // Show notification panel
    setVisible(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
    setVisible(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_post': return '📋';
      case 'connection_update': return '🔄';
      case 'message': return '✉️';
      case 'system': return '📢';
      default: return '🔔';
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case 'new_post': return 'New Post';
      case 'connection_update': return 'Connection Update';
      case 'message': return 'New Message';
      case 'system': return 'System Update';
      default: return 'Notification';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`notification-container ${visible ? 'visible' : ''}`}>
      <div className="notification-header">
        <h3>Notifications</h3>
        <div className="notification-actions">
          <button onClick={markAllAsRead} className="action-button">
            Mark All Read
          </button>
          <button onClick={clearAll} className="action-button">
            Clear All
          </button>
        </div>
      </div>
      
      <div className="notification-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <div className="notification-title">
                {getNotificationTitle(notification.type)}
              </div>
              <div className="notification-message">
                {notification.data?.message || 
                 notification.data?.text || 
                 notification.data?.title ||
                 'New update available'}
              </div>
              <div className="notification-time">
                {notification.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="notification-toggle"
        onClick={() => setVisible(!visible)}
      >
        {visible ? 'Hide Notifications' : 'Show Notifications'}
      </button>
    </div>
  );
};

export default Notification;