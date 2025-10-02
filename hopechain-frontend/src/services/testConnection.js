// Test connection between frontend and backend
import api from './authService';

// Use environment variable for API base URL or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test API connection
    const apiResponse = await api.get('/health');
    console.log('API test:', apiResponse.data);
    
    return {
      success: true,
      message: 'Successfully connected to backend',
      data: {
        health: healthData,
        api: apiResponse.data
      }
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      message: 'Failed to connect to backend',
      error: error.message
    };
  }
};

export default testConnection;