import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form state variables
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });
  
  const [blogForm, setBlogForm] = useState({
    title: '',
    plantType: '',
    content: '',
    cultivationTips: '',
    image: null
  });
  
  const [donationForm, setDonationForm] = useState({
    plantName: '',
    description: '',
    location: '',
    images: []
  });

  const { user } = useAuth();

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

 const handleProductSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    setMessage('');
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price);
    formData.append('category', productForm.category);
    formData.append('stock', productForm.stock);
    if (productForm.image) {
      formData.append('image', productForm.image);
    }

    const newProduct = await api.createProduct(formData);
    setProducts([...products, newProduct]);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: null
    });
    setShowProductForm(false);
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
      const newBlog = await api.createBlog(blogForm);
      setBlogs([...blogs, newBlog]);
      setBlogForm({
        title: '',
        plantType: '',
        content: '',
        cultivationTips: '',
        image: null
      });
      toast.success('Blog post created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Failed to create blog post';
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
      const newDonation = await api.createDonation(donationForm);
      setDonations([...donations, newDonation]);
      setDonationForm({
        plantName: '',
        description: '',
        location: '',
        images: []
      });
      toast.success('Donation post created successfully!');
    } catch (error) {
      console.error('Error creating donation:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Failed to create donation post';
      toast.error(errorMsg);
      setMessage(`Error: ${errorMsg}`);
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
              <Label htmlFor="product-image">Product Image</Label>
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
                onChange={(e) => setBlogForm({...blogForm, image: e.target.files[0]})}
                accept="image/*"
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
              <Label htmlFor="donation-images">Plant Images</Label>
              <Input
                id="donation-images"
                type="file"
                multiple
                onChange={(e) => setDonationForm({...donationForm, images: Array.from(e.target.files)})}
                accept="image/*"
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