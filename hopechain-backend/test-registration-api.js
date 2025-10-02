/**
 * Test Registration API - Direct test without Postman
 */

require('dotenv').config();

const testRegistration = async () => {
  console.log('🧪 Testing Registration API...\n');
  
  const registrationData = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    type: 'donor',
    bloodType: 'O+',
    location: 'New York, NY'
  };
  
  console.log('📤 Sending registration request:');
  console.log(JSON.stringify(registrationData, null, 2));
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const result = await response.json();
    
    console.log('\n📥 Response received:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ REGISTRATION SUCCESSFUL!');
    } else {
      console.log('\n❌ REGISTRATION FAILED!');
      console.log('Error:', result.message);
    }
    
  } catch (error) {
    console.error('\n💥 REQUEST FAILED!');
    console.error('Error:', error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:5000');
  }
};

testRegistration();