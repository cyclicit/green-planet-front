import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
// Product form state
const [productForm, setProductForm] = useState({
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  sellerName: '',
  ccc: '',
  image: '' // Add image field
});

// Blog form state  
const [blogForm, setBlogForm] = useState({
  title: '',
  plantType: '',
  content: '',
  cultivationTips: '',
  authorName: '',
  ccc: '',
  image: '' // Add image field
});

// Donation form state
const [donationForm, setDonationForm] = useState({
  plantName: '',
  description: '',
  location: '',
  donorName: '',
  ccc: '',
  image: '' // Add image field
});
  

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productsData, blogsData, donationsData] = await Promise.all([
        api.getProducts(),
        api.getBlogs(),
        api.getDonations()
      ]);
      
      setProducts(productsData);
      setBlogs(blogsData);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const testBlogEndpoint = async () => {
  try {
    setLoading(true);
    const testData = {
      title: 'Test Blog',
      plantType: 'Test Plant',
      content: 'Test content',
      cultivationTips: 'Test tips',
      authorName: 'Test Author'
    };
    
    const result = await api.testBlogEndpoint(testData);
    console.log('Blog test result:', result);
    toast.info('Blog test completed. Check console for details.');
  } catch (error) {
    console.error('Blog test failed:', error);
    toast.error('Blog test failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};

const handleImageUpload = (e, setFormFunction) => {
  const file = e.target.files[0];
  if (file) {
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormFunction(prev => ({
        ...prev,
        image: reader.result // Base64 string
      }));
      toast.success('Image uploaded successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to upload image');
    };
    reader.readAsDataURL(file);
  }
};

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      
      // Convert price and stock to numbers
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        sellerName: productForm.sellerName || 'Anonymous Seller' // Default name
      };

      const newProduct = await api.createProduct(productData);
      setProducts([...products, newProduct]);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        sellerName: '',
        ccc: ''
      });
      toast.success('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMsg = error.message || 'Failed to create product';
      toast.error(errorMsg);
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');

      const blogData = {
        ...blogForm,
        authorName: blogForm.authorName || 'Anonymous Gardener' // Default name
      };

      const newBlog = await api.createBlog(blogData);
      setBlogs([...blogs, newBlog]);
      setBlogForm({
        title: '',
        plantType: '',
        content: '',
        cultivationTips: '',
        authorName: '',
        ccc: ''
      });
      toast.success('Blog post created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      const errorMsg = error.message || 'Failed to create blog post';
      toast.error(errorMsg);
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');

      const donationData = {
        ...donationForm,
        donorName: donationForm.donorName || 'Anonymous Donor' // Default name
      };

      const newDonation = await api.createDonation(donationData);
      setDonations([...donations, newDonation]);
      setDonationForm({
        plantName: '',
        description: '',
        location: '',
        donorName: '',
       
      });
      toast.success('Donation post created successfully!');
    } catch (error) {
      console.error('Error creating donation:', error);
      const errorMsg = error.message || 'Failed to create donation post';
      toast.error(errorMsg);
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Green Planet Community</Title>
        <Welcome>Share your plants, stories, and donations with our community!</Welcome>
      </Header>

      {message && (
        <Message $error={message.includes('Error')}>
          {message}
        </Message>
      )}

      {loading && (
        <LoadingMessage>Processing your request...</LoadingMessage>
      )}

      <Tabs>
        <Tab 
          $active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
          disabled={loading}
        >
          Add Product
        </Tab>
        <Tab 
          $active={activeTab === 'blogs'} 
          onClick={() => setActiveTab('blogs')}
          disabled={loading}
        >
          Write Blog
        </Tab>
        <Tab 
          $active={activeTab === 'donations'} 
          onClick={() => setActiveTab('donations')}
          disabled={loading}
        >
          Post Donation
        </Tab>
      </Tabs>

      <Content>
        {activeTab === 'products' && (
          <Form onSubmit={handleProductSubmit}>
            <FormTitle>Add New Product</FormTitle>
            
            <FormGroup>
              <Label htmlFor="product-name">Product Name *</Label>
              <Input
                id="product-name"
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="product-description">Description *</Label>
              <Textarea
                id="product-description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                required
                disabled={loading}
                rows="4"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="product-price">Price ($) *</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="product-category">Category *</Label>
              <Select
                id="product-category"
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                required
                disabled={loading}
              >
                <option value="">Select Category</option>
                <option value="Indoor Plants">Indoor Plants</option>
                <option value="Outdoor Plants">Outdoor Plants</option>
                <option value="Flowers">Flowers</option>
                <option value="Succulents">Succulents</option>
                <option value="Herbs">Herbs</option>
                <option value="Seeds">Seeds</option>
                <option value="Gardening Tools">Gardening Tools</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="product-stock">Stock Quantity *</Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                required
                disabled={loading}
              />
            </FormGroup>

             <FormGroup>
              <Label htmlFor="product-seller">ccc</Label>
              <Input
                id=""
                type="text"
                value={productForm.ccc}
                onChange={(e) => setProductForm({...productForm, ccc: e.target.value})}
                placeholder="ccc"
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="product-seller">Seller Name</Label>
              <Input
                id="product-seller"
                type="text"
                value={productForm.sellerName}
                onChange={(e) => setProductForm({...productForm, sellerName: e.target.value})}
                placeholder="Your name (optional)"
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
  <Label htmlFor="product-image">Product Image</Label>
  <Input
    id="product-image"
    type="file"
    accept="image/*"
    onChange={(e) => handleImageUpload(e, setProductForm)}
    disabled={loading}
  />
  {productForm.image && (
    <img 
      src={productForm.image} 
      alt="Preview" 
      style={{width: '100px', height: '100px', marginTop: '10px', objectFit: 'cover'}}
    />
  )}
</FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </SubmitButton>
          </Form>
        )}

        {activeTab === 'blogs' && (
          <Form onSubmit={handleBlogSubmit}>
            <FormTitle>Write a Blog Post</FormTitle>
            
            <FormGroup>
              <Label htmlFor="blog-title">Title *</Label>
              <Input
                id="blog-title"
                type="text"
                value={blogForm.title}
                onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="blog-author">Your Name</Label>
              <Input
                id="blog-author"
                type="text"
                value={blogForm.authorName}
                onChange={(e) => setBlogForm({...blogForm, authorName: e.target.value})}
                placeholder="Your name (optional)"
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="blog-author">ccc</Label>
              <Input
                id="blog-author"
                type="text"
                value={blogForm.ccc}
                onChange={(e) => setBlogForm({...blogForm, ccc: e.target.value})}
                placeholder="ccc"
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="blog-plantType">Plant Type *</Label>
              <Input
                id="blog-plantType"
                type="text"
                value={blogForm.plantType}
                onChange={(e) => setBlogForm({...blogForm, plantType: e.target.value})}
                required
                placeholder="e.g., Rose, Tomato, Bonsai"
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="blog-content">Content *</Label>
              <Textarea
                id="blog-content"
                rows="6"
                value={blogForm.content}
                onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                required
                placeholder="Write about the plant, its characteristics, and your experience..."
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="blog-cultivationTips">Cultivation Tips *</Label>
              <Textarea
                id="blog-cultivationTips"
                rows="4"
                value={blogForm.cultivationTips}
                onChange={(e) => setBlogForm({...blogForm, cultivationTips: e.target.value})}
                required
                placeholder="Share tips on how to grow and care for this plant..."
                disabled={loading}
              />
            </FormGroup>


            <FormGroup>
  <Label htmlFor="blog-image">Blog Image</Label>
  <Input
    id="blog-image"
    type="file"
    accept="image/*"
    onChange={(e) => handleImageUpload(e, setBlogForm)}
    disabled={loading}
  />
  {blogForm.image && (
    <img 
      src={blogForm.image} 
      alt="Preview" 
      style={{width: '100px', height: '100px', marginTop: '10px', objectFit: 'cover'}}
    />
  )}
</FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Blog'}
            </SubmitButton>
          </Form>
        )}

       {activeTab === 'donations' && (
  <Form onSubmit={handleDonationSubmit}>
    <FormTitle>Post a Plant for Donation</FormTitle>
    
    <FormGroup>
      <Label htmlFor="donation-plantName">Plant Name *</Label>
      <Input
        id="donation-plantName"
        type="text"
        value={donationForm.plantName}
        onChange={(e) => setDonationForm({...donationForm, plantName: e.target.value})}
        required
        disabled={loading}
      />
    </FormGroup>

    <FormGroup>
      <Label htmlFor="donation-ccc">CCC *</Label>
      <Input
        id="donation-ccc"
        type="text"
        value={donationForm.ccc}
        onChange={(e) => setDonationForm({...donationForm, ccc: e.target.value})}
        required
        placeholder="CCC value"
        disabled={loading}
      />
    </FormGroup>

    <FormGroup>
      <Label htmlFor="donation-donor">Your Name</Label>
      <Input
        id="donation-donor"
        type="text"
        value={donationForm.donorName}
        onChange={(e) => setDonationForm({...donationForm, donorName: e.target.value})}
        placeholder="Your name (optional)"
        disabled={loading}
      />
    </FormGroup>

    <FormGroup>
      <Label htmlFor="donation-description">Description *</Label>
      <Textarea
        id="donation-description"
        rows="4"
        value={donationForm.description}
        onChange={(e) => setDonationForm({...donationForm, description: e.target.value})}
        required
        placeholder="Describe the plant's condition, size, and any special care instructions..."
        disabled={loading}
      />
    </FormGroup>

    <FormGroup>
      <Label htmlFor="donation-location">Location *</Label>
      <Input
        id="donation-location"
        type="text"
        value={donationForm.location}
        onChange={(e) => setDonationForm({...donationForm, location: e.target.value})}
        required
        placeholder="Your city or area for pickup"
        disabled={loading}
      />
    </FormGroup>

    <FormGroup>
  <Label htmlFor="donation-image">Plant Image</Label>
  <Input
    id="donation-image"
    type="file"
    accept="image/*"
    onChange={(e) => handleImageUpload(e, setDonationForm)}
    disabled={loading}
  />
  {donationForm.image && (
    <img 
      src={donationForm.image} 
      alt="Preview" 
      style={{width: '100px', height: '100px', marginTop: '10px', objectFit: 'cover'}}
    />
  )}
</FormGroup>

    <SubmitButton type="submit" disabled={loading}>
      {loading ? 'Posting...' : 'Post Donation'}
    </SubmitButton>
  </Form>
)}

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
  <button 
    onClick={testBlogEndpoint} 
    disabled={loading}
    style={{ padding: '10px 20px', margin: '5px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px' }}
  >
    Test Blog Endpoint
  </button>
  <button 
    onClick={() => console.log('Current forms:', { productForm, blogForm, donationForm })} 
    style={{ padding: '10px 20px', margin: '5px', background: '#388e3c', color: 'white', border: 'none', borderRadius: '4px' }}
  >
    Log Form Data
  </button>
</div>
      </Content>
    </Container>
  );
};
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2e7d32;
  margin-bottom: 0.5rem;
`;

const Welcome = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const Message = styled.div`
  background: ${props => props.$error ? '#f8d7da' : '#d4edda'};
  color: ${props => props.$error ? '#721c24' : '#155724'};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.$error ? '#f5c6cb' : '#c3e6cb'};
`;

const LoadingMessage = styled.div`
  background: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ffeaa7;
  text-align: center;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.$active ? '#2e7d32' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  border-radius: 4px 4px 0 0;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover {
    background: ${props => props.disabled ? 'transparent' : (props.$active ? '#2e7d32' : '#f5f5f5')};
  }
`;

const Content = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h2`
  color: #2e7d32;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: ${props => props.disabled ? '#f5f5f5' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  background: ${props => props.disabled ? '#f5f5f5' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: ${props => props.disabled ? '#f5f5f5' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: ${props => props.disabled ? '#ccc' : '#2e7d32'};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 1rem;

  &:hover {
    background: ${props => props.disabled ? '#ccc' : '#388e3c'};
  }

  &:active {
    background: ${props => props.disabled ? '#ccc' : '#1b5e20'};
  }
`;

export default Dashboard;