import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      console.log('Products API response:', data);
      setProducts(data);
      setFilteredProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(product => product.category))];
      setCategories(uniqueCategories);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (term, category) => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) &&
      (category === '' || product.category === category)
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  // Improved image error handler
  const handleImageError = (e, product) => {
    console.log('Image failed to load:', e.target.src);
    
    // Try to fix common URL issues
    const originalSrc = e.target.src;
    
    // Fix double slashes
    if (originalSrc.includes('//uploads//')) {
      const fixedUrl = originalSrc.replace('//uploads//', '/uploads/');
      e.target.src = fixedUrl;
      return;
    }
    
    // Fix backslashes
    if (originalSrc.includes('\\')) {
      const fixedUrl = originalSrc.replace(/\\/g, '/');
      e.target.src = fixedUrl;
      return;
    }
    
    // Fallback to placeholder
    e.target.src = '/placeholder-plant.jpg';
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </LoadingSpinner>
        <LoadingText>Loading plants...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <RetryButton onClick={fetchProducts}>Try Again</RetryButton>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Our Green Collection</Title>
        <Subtitle>Discover beautiful plants for your home and garden</Subtitle>
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <CategoryFilter>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </CategoryFilter>
        </SearchContainer>
      </Header>

      <Stats>
        <StatItem>
          <StatNumber>{products.length}</StatNumber>
          <StatLabel>Total Plants</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{categories.length}</StatNumber>
          <StatLabel>Categories</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>
            {products.reduce((total, product) => total + product.stock, 0)}
          </StatNumber>
          <StatLabel>In Stock</StatLabel>
        </StatItem>
      </Stats>

      <ProductGrid>
        {filteredProducts.map(product => (
          <ProductCard key={product._id}>
            <ProductImageContainer>
              <ProductImage 
                src={product.images && product.images[0] 
                  ? product.images[0]
                  : '/placeholder-plant.jpg'
                } 
                alt={product.name}
                onError={(e) => handleImageError(e, product)}
                onLoad={(e) => console.log('Image loaded successfully:', e.target.src)}
              />
              <ProductOverlay>
                <ViewButton to={`/products/${product._id}`}>Quick View</ViewButton>
              </ProductOverlay>
              {product.stock === 0 && (
                <OutOfStockBadge>Out of Stock</OutOfStockBadge>
              )}
            </ProductImageContainer>
            
            <ProductInfo>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductName>Plant: {product.name}</ProductName>
              <ProductName>Seller: {product.ccc}</ProductName>
              

              
              <ProductMeta>
                <ProductPrice>${product.price}</ProductPrice>
                <StockInfo>
                  {product.stock > 0 ? (
                    <InStock>{product.stock} in stock</InStock>
                  ) : (
                    <OutOfStock>Out of stock</OutOfStock>
                  )}
                </StockInfo>
              </ProductMeta>
              
              <ButtonGroup>
                <AddToCartButton 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </AddToCartButton>
                <WishlistButton>♡</WishlistButton>
              </ButtonGroup>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>

      {filteredProducts.length === 0 && !loading && (
        <NoProducts>
          <NoProductsIcon>🌱</NoProductsIcon>
          <NoProductsText>No plants found matching your criteria</NoProductsText>
          <NoProductsSubtext>Try adjusting your search or browse all categories</NoProductsSubtext>
        </NoProducts>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #2e7d32;
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
  min-width: 300px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

const CategoryFilter = styled.div`
  select {
    padding: 1rem 1.5rem;
    border: 2px solid #e0e0e0;
    border-radius: 25px;
    font-size: 1rem;
    background: white;
    cursor: pointer;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: #2e7d32;
    }
  }
`;

const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-radius: 15px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-weight: 500;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProductOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ProductCard}:hover & {
    opacity: 1;
  }
`;

const OutOfStockBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ff4757;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductCategory = styled.span`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: inline-block;
`;

const ProductName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
`;

const ProductDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
`;

const StockInfo = styled.div`
  text-align: right;
`;

const InStock = styled.span`
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 500;
`;

const OutOfStock = styled.span`
  color: #dc3545;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 0.8rem 1.5rem;
  background: ${props => props.disabled ? '#ccc' : '#2e7d32'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  transition: background 0.3s;

  &:hover {
    background: ${props => props.disabled ? '#ccc' : '#388e3c'};
  }
`;

const WishlistButton = styled.button`
  padding: 0.8rem;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e8f5e8;
    border-color: #2e7d32;
  }
`;

const ViewButton = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border: 2px solid white;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: white;
    color: #2e7d32;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const NoProductsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const NoProductsText = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const NoProductsSubtext = styled.p`
  color: #888;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: 2rem auto;
  display: block;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #2e7d32;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #2e7d32 transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem 0;
  border: 1px solid #f5c6cb;
`;

const RetryButton = styled.button`
  background: #2e7d32;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background: #388e3c;
  }
`;

// Debug section - remove in production
const DebugSection = styled.div`
  margin-top: 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #2e7d32;
`;

const DebugTitle = styled.h4`
  color: #2e7d32;
  margin-bottom: 1rem;
`;

const DebugText = styled.p`
  color: #666;
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export default Products;