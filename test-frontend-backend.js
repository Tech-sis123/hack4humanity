// Test script to verify frontend-backend communication
const testFrontendBackend = async () => {
  console.log('Testing frontend-backend communication...');
  
  try {
    // Test backend health endpoint
    const backendResponse = await fetch('http://localhost:5000/api/health');
    const backendData = await backendResponse.json();
    console.log('Backend health check:', backendData);
    
    // Test registration
    const registrationData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      type: 'donor',
      location: 'Test Location'
    };
    
    console.log('Sending registration request...');
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    
    if (registerData.success) {
      console.log('✅ Registration successful!');
      
      // Test login
      console.log('Sending login request...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registrationData.email,
          password: registrationData.password
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (loginData.success) {
        console.log('✅ Login successful!');
        
        // Test getting current user with token
        console.log('Getting current user...');
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json',
          }
        });
        
        const userData = await userResponse.json();
        console.log('Current user response:', userData);
        
        if (userData.success) {
          console.log('✅ Authentication flow completed successfully!');
        } else {
          console.log('❌ Failed to get current user:', userData.message);
        }
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
    } else {
      console.log('❌ Registration failed:', registerData.message);
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
};

testFrontendBackend();