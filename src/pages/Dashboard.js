import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    plantType: '',
    cultivationTips: ''
  });

  // Donation form state
  const [donationForm, setDonationForm] = useState({
    plantName: '',
    description: '',
    location: ''
  });

 const handleProductSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');
  
  try {
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('category', productForm.category);
    formData.append('stock', productForm.stock);
    
    if (productForm.image) {
      formData.append('image', productForm.image); // Make sure this is 'image' not 'images'
    }

    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': localStorage.getItem('token')
      }
    });
    
    setMessage('Product created successfully!');
    setProductForm({ 
      name: '', 
      description: '', 
      price: '', 
      category: '', 
      stock: '', 
      image: null 
    });
    
    // Clear file input
    if (document.getElementById('product-image')) {
      document.getElementById('product-image').value = '';
    }
    
  } catch (error) {
    console.error('Product creation error:', error);
    const errorMsg = error.response?.data?.msg || 
                    error.response?.data?.error || 
                    error.message || 
                    'Unknown error occurred';
    setMessage('Error creating product: ' + errorMsg);
  } finally {
    setLoading(false);
  }
};

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Submitting blog data:', blogForm);
      
      const response = await axios.post('/api/blogs', blogForm, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      setMessage('Blog post created successfully!');
      setBlogForm({ title: '', content: '', plantType: '', cultivationTips: '' });
      
    } catch (error) {
      console.error('Blog creation error:', error);
      const errorMsg = error.response?.data?.msg || 
                      error.response?.data?.error || 
                      error.message || 
                      'Unknown error occurred';
      setMessage('Error creating blog: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Submitting donation data:', donationForm);
      
      const response = await axios.post('/api/donations', donationForm, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      setMessage('Donation post created successfully!');
      setDonationForm({ plantName: '', description: '', location: '' });
      
    } catch (error) {
      console.error('Donation creation error:', error);
      const errorMsg = error.response?.data?.msg || 
                      error.response?.data?.error || 
                      error.message || 
                      'Unknown error occurred';
      setMessage('Error creating donation post: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <Message $error>Please log in to access the dashboard</Message>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Welcome>Welcome, {user.name}!</Welcome>
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
              <Label>Product Name *</Label>
              <Input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Description *</Label>
              <Textarea
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                required
                disabled={loading}
                rows="4"
              />
            </FormGroup>

            <FormGroup>
              <Label>Price ($) *</Label>
              <Input
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
              <Label>Category *</Label>
              <Select
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
              <Label>Stock Quantity *</Label>
              <Input
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Product Image</Label>
              <Input
                id="product-image"
                type="file"
                onChange={(e) => setProductForm({...productForm, image: e.target.files[0]})}
                accept="image/*"
                disabled={loading}
              />
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
              <Label>Title *</Label>
              <Input
                type="text"
                value={blogForm.title}
                onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Plant Type *</Label>
              <Input
                type="text"
                value={blogForm.plantType}
                onChange={(e) => setBlogForm({...blogForm, plantType: e.target.value})}
                required
                placeholder="e.g., Rose, Tomato, Bonsai"
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Content *</Label>
              <Textarea
                rows="6"
                value={blogForm.content}
                onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                required
                placeholder="Write about the plant, its characteristics, and your experience..."
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Cultivation Tips *</Label>
              <Textarea
                rows="4"
                value={blogForm.cultivationTips}
                onChange={(e) => setBlogForm({...blogForm, cultivationTips: e.target.value})}
                required
                placeholder="Share tips on how to grow and care for this plant..."
                disabled={loading}
              />
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
              <Label>Plant Name *</Label>
              <Input
                type="text"
                value={donationForm.plantName}
                onChange={(e) => setDonationForm({...donationForm, plantName: e.target.value})}
                required
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Description *</Label>
              <Textarea
                rows="4"
                value={donationForm.description}
                onChange={(e) => setDonationForm({...donationForm, description: e.target.value})}
                required
                placeholder="Describe the plant's condition, size, and any special care instructions..."
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Label>Location *</Label>
              <Input
                type="text"
                value={donationForm.location}
                onChange={(e) => setDonationForm({...donationForm, location: e.target.value})}
                required
                placeholder="Your city or area for pickup"
                disabled={loading}
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Donation'}
            </SubmitButton>
          </Form>
        )}
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