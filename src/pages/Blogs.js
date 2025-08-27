import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/blogs');
      setBlogs(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <LoadingText>Loading blog posts...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <RetryButton onClick={fetchBlogs}>Try Again</RetryButton>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Green Planet Blog</Title>
        <Subtitle>Discover tips, stories, and insights about plant care and gardening</Subtitle>
      </Header>

      <Stats>
        <StatItem>
          <StatNumber>{blogs.length}</StatNumber>
          <StatLabel>Blog Posts</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>
            {new Set(blogs.map(blog => blog.plantType)).size}
          </StatNumber>
          <StatLabel>Plant Types Covered</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>
            {blogs.reduce((total, blog) => total + (blog.likes ? blog.likes.length : 0), 0)}
          </StatNumber>
          <StatLabel>Total Likes</StatLabel>
        </StatItem>
      </Stats>

      <BlogGrid>
        {blogs.map(blog => (
          <BlogCard key={blog._id}>
            <BlogImage>
              {blog.image ? (
                <img src={`https://green-planet-moc.onrender.com/${blog.image}`} alt={blog.title} />
              ) : (
                <PlaceholderImage>🌿</PlaceholderImage>
              )}
            </BlogImage>
            
            <BlogContent>
              <BlogCategory>{blog.plantType}</BlogCategory>
              <BlogTitle>{blog.title}</BlogTitle>
              
              <BlogExcerpt>
                {blog.content.length > 120 
                  ? `${blog.content.substring(0, 120)}...` 
                  : blog.content
                }
              </BlogExcerpt>
              
              <BlogMeta>
                <AuthorInfo>
                  {blog.author && blog.author.avatar && (
                    <AuthorAvatar src={blog.author.avatar} alt={blog.author.name} />
                  )}
                  <div>
                    <AuthorName>{blog.author?.name || 'Unknown Author'}</AuthorName>
                    <BlogDate>{formatDate(blog.createdAt)}</BlogDate>
                  </div>
                </AuthorInfo>
                
                <BlogStats>
                  <Stat>❤️ {blog.likes ? blog.likes.length : 0} likes</Stat>
                </BlogStats>
              </BlogMeta>
              
              <ReadMoreButton to={`/blogs/${blog._id}`}>
                Read More →
              </ReadMoreButton>
            </BlogContent>
          </BlogCard>
        ))}
      </BlogGrid>

      {blogs.length === 0 && !loading && (
        <NoBlogs>
          <NoBlogsIcon>📝</NoBlogsIcon>
          <NoBlogsText>No blog posts yet</NoBlogsText>
          <NoBlogsSubtext>Be the first to share your plant stories!</NoBlogsSubtext>
        </NoBlogs>
      )}
    </Container>
  );
};

// Reuse the same styled components from Products page with some adjustments
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

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const BlogCard = styled.div`
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

const BlogImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: #e8f5e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogCategory = styled.span`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
  display: inline-block;
`;

const BlogTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
`;

const BlogExcerpt = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const AuthorAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
`;

const AuthorName = styled.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const BlogDate = styled.div`
  color: #888;
  font-size: 0.8rem;
`;

const BlogStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const Stat = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const ReadMoreButton = styled(Link)`
  color: #2e7d32;
  text-decoration: none;
  font-weight: 500;
  padding: 0.8rem 0;
  display: inline-block;
  transition: color 0.3s;

  &:hover {
    color: #388e3c;
    text-decoration: underline;
  }
`;

const NoBlogs = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const NoBlogsIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const NoBlogsText = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const NoBlogsSubtext = styled.p`
  color: #888;
`;

// Reuse loading and error components from Products page
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

export default Blogs;