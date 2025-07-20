// Test login and get new token
const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ceo@company.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('🎫 Token:', data.token);
      
      // Test users API
      const usersResponse = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      const usersData = await usersResponse.json();
      console.log('👥 Users API response:', usersData);
      
      // Test customers API
      const customersResponse = await fetch('http://localhost:3000/api/customers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      const customersData = await customersResponse.json();
      console.log('🏢 Customers API response:', customersData);
      
    } else {
      console.log('❌ Login failed:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testLogin();