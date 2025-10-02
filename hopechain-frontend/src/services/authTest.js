// Test authentication flow
import { authService } from './authService';

export const testAuthFlow = async () => {
  try {
    console.log('Testing authentication flow...');
    
    // Test registration
    const registrationData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      type: 'donor',
      location: 'Test Location'
    };
    
    console.log('Registering user:', registrationData);
    const registerResponse = await authService.register(registrationData);
    console.log('Registration response:', registerResponse);
    
    // Test getting current user
    console.log('Getting current user...');
    const userResponse = await authService.getCurrentUser();
    console.log('Current user response:', userResponse);
    
    return {
      success: true,
      data: {
        registration: registerResponse,
        user: userResponse
      }
    };
  } catch (error) {
    console.error('Authentication flow test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default testAuthFlow;