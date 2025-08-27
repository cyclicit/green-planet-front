import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/products?search=${searchTerm}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Welcome to Green Planet</HeroTitle>
          <HeroSubtitle>Your destination for all things plants</HeroSubtitle>
          
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search for plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton type="submit">Search</SearchButton>
          </SearchForm>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionTitle>Featured Products</SectionTitle>
        <ProductGrid>
          {products.slice(0, 4).map(product => (
            <ProductCard key={product._id}>
              <ProductImage src={`https://green-planet-moc.onrender.com/${product.images[0]}`} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>${product.price}</ProductPrice>
                <ViewButton to={`/products/${product._id}`}>View Details</ViewButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </Section>

      <Section>
        <SectionTitle>Why Choose Green Planet?</SectionTitle>
        <FeaturesGrid>
          <Feature>
            <FeatureIcon>🌱</FeatureIcon>
            <FeatureTitle>Quality Plants</FeatureTitle>
            <FeatureDescription>We offer the highest quality plants from trusted growers</FeatureDescription>
          </Feature>
          <Feature>
            <FeatureIcon>🚚</FeatureIcon>
            <FeatureTitle>Fast Delivery</FeatureTitle>
            <FeatureDescription>Get your plants delivered quickly and safely</FeatureDescription>
          </Feature>
          <Feature>
            <FeatureIcon>💚</FeatureIcon>
            <FeatureTitle>Eco-Friendly</FeatureTitle>
            <FeatureDescription>We're committed to sustainable practices</FeatureDescription>
          </Feature>
        </FeaturesGrid>
      </Section>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 3rem;
`;

const HeroContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  padding: 1rem 2rem;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #e85a2a;
  }
  
  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const Section = styled.section`
  margin: 4rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #2e7d32;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 1rem;
`;

const ViewButton = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #2e7d32;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;

  &:hover {
    background: #388e3c;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const Feature = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2e7d32;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

export default Home;