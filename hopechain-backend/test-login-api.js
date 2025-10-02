/**
 * Test Login API - Direct test without Postman
 */

require('dotenv').config();

const testLogin = async () => {
  console.log('🧪 Testing Login API...\n');
  
  const loginData = {
    email: 'test-1758861034278@example.com',  // Use the email from our previous test
    password: 'password123'
  };
  
  console.log('📤 Sending login request:');
  console.log(JSON.stringify(loginData, null, 2));
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    const result = await response.json();
    
    console.log('\n📥 Response received:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
    } else {
      console.log('\n❌ LOGIN FAILED!');
      console.log('Error:', result.message);
    }
    
  } catch (error) {
    console.error('\n💥 REQUEST FAILED!');
    console.error('Error:', error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:5000');
  }
};

testLogin();