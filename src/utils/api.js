const API_BASE_URL = 'https://green-planet-moc.onrender.com';

// Use a consistent anonymous ID
const ANONYMOUS_USER_ID = '000000000000000000000000';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('API Request:', url, options.method || 'GET');
    
    // Always use JSON
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      console.log('API Response Status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('API Error Details:', errorData);
        } catch (e) {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.message || errorData.msg || `Request failed with status ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('API request failed:', error.message);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Connection closed')) {
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  },

  // Test connection
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
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
  
 


  createProduct(productData) {
  const productWithUser = {
    ...productData,
    user: ANONYMOUS_USER_ID,
    sellerName: productData.sellerName || 'Anonymous Seller',
    images: productData.image ? [productData.image] : [] // Add image to images array
  };
  
  return this.request('/api/products', {
    method: 'POST',
    body: JSON.stringify(productWithUser),
  });
  
},

 createBlog(blogData) {
  const blogWithUser = {
    title: blogData.title,
    plantType: blogData.plantType,
    content: blogData.content,
    cultivationTips: blogData.cultivationTips,
    user: ANONYMOUS_USER_ID,
    author: ANONYMOUS_USER_ID,
    ccc: blogData.ccc,
    images: blogData.image ? [blogData.image] : [] // Add image to images array
  };
  
  return this.request('/api/blogs', {
    method: 'POST',
    body: JSON.stringify(blogWithUser),
  });
},

  // Donation creation
createDonation(donationData) {
  const donationWithUser = {
    plantName: donationData.plantName,
    description: donationData.description,
    location: donationData.location,
    ccc: donationData.ccc,
    user: ANONYMOUS_USER_ID,
    donor: donationData.donorName || 'Anonymous Donor',
    images: donationData.image ? [donationData.image] : [] // Add image to images array
  };
  
  return this.request('/api/donations', {
    method: 'POST',
    body: JSON.stringify(donationWithUser),
  });
}
};