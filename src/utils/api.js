const API_BASE_URL = 'https://green-planet-moc.onrender.com';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    let token = localStorage.getItem('token');
    
    console.log('API Request:', url, options.method || 'GET');
    console.log('Token exists:', !!token);
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      console.log('API Response Status:', response.status);
      
      // Handle 401 by attempting token refresh
      if (response.status === 401) {
        console.log('Token expired, attempting refresh...');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });
            
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              localStorage.setItem('token', refreshData.token);
              localStorage.setItem('refreshToken', refreshData.refreshToken);
              
              // Retry the original request with new token
              headers['Authorization'] = `Bearer ${refreshData.token}`;
              const retryResponse = await fetch(url, {
                ...options,
                headers,
              });
              
              if (!retryResponse.ok) {
                throw new Error('Retry failed after token refresh');
              }
              
              const data = await retryResponse.json();
              return data;
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
          }
        }
        
        throw new Error('Authentication required. Please login again.');
      }
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.message || errorData.msg || `Request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response Data:', data);
      return data;
      
    } catch (error) {
      console.error('API request failed:', error.message);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Connection closed')) {
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  },
  
  // Test connection first
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  // Verify token validity
  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  },

  // Specific methods
  getProducts() {
    return this.request('/api/products');
  },
  
  getBlogs() {
    return this.request('/api/blogs');
  },
  
  getDonations() {
    return this.request('/api/donations');
  },
  
  claimDonation(donationId, message) {
    return this.request(`/api/donations/${donationId}/claim`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  // Product creation
 // Update the API method to handle FormData
 createProduct(productData) {
   // Check if productData is FormData (for file upload)
   const isFormData = productData instanceof FormData;
   
   return this.request('/api/products', {
     method: 'POST',
     headers: isFormData ? {} : { 'Content-Type': 'application/json' },
     body: isFormData ? productData : JSON.stringify(productData),
   });
 },

  // Blog creation
  createBlog(blogData) {
    return this.request('/api/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  // Donation creation
  createDonation(donationData) {
    return this.request('/api/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }
};