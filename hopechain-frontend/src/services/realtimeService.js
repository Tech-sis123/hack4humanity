// Real-time updates service using polling
class RealtimeService {
  constructor() {
    this.pollingInterval = null;
    this.subscribers = [];
    this.pollingFrequency = 30000; // 30 seconds
  }

  // Subscribe to updates
  subscribe(callback) {
    const id = Date.now().toString();
    this.subscribers.push({ id, callback });
    return id;
  }

  // Unsubscribe from updates
  unsubscribe(id) {
    this.subscribers = this.subscribers.filter(sub => sub.id !== id);
  }

  // Start polling for updates
  startPolling() {
    if (this.pollingInterval) {
      return; // Already polling
    }

    this.pollingInterval = setInterval(async () => {
      try {
        // In a real implementation, this would fetch actual updates from the server
        // For demo purposes, we'll simulate updates
        const updates = this.generateMockUpdates();
        
        // Notify all subscribers
        this.subscribers.forEach(sub => {
          try {
            sub.callback(updates);
          } catch (error) {
            console.error('Error in realtime update callback:', error);
          }
        });
      } catch (error) {
        console.error('Error fetching realtime updates:', error);
      }
    }, this.pollingFrequency);
  }

  // Stop polling for updates
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Generate mock updates for demo purposes
  generateMockUpdates() {
    // Simulate different types of updates
    const updateTypes = ['new_post', 'connection_update', 'message', 'system'];
    const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    
    const updates = {
      timestamp: new Date().toISOString(),
      type: randomType
    };
    
    switch (randomType) {
      case 'new_post':
        updates.data = {
          id: `post-${Date.now()}`,
          title: 'New post in your area',
          type: Math.random() > 0.5 ? 'offer' : 'need'
        };
        break;
      case 'connection_update':
        updates.data = {
          id: `conn-${Date.now()}`,
          status: ['pending', 'active', 'completed'][Math.floor(Math.random() * 3)],
          message: 'Connection status updated'
        };
        break;
      case 'message':
        updates.data = {
          id: `msg-${Date.now()}`,
          text: 'You have a new message',
          sender: 'Community Member'
        };
        break;
      case 'system':
        updates.data = {
          id: `sys-${Date.now()}`,
          message: 'System maintenance scheduled'
        };
        break;
      default:
        updates.data = { message: 'New update available' };
    }
    
    return updates;
  }

  // Set polling frequency (in milliseconds)
  setPollingFrequency(frequency) {
    this.pollingFrequency = frequency;
    
    // Restart polling with new frequency if it's currently running
    if (this.pollingInterval) {
      this.stopPolling();
      this.startPolling();
    }
  }
}

// Create a singleton instance
const realtimeService = new RealtimeService();

export default realtimeService;