import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// Set base URL for API calls
axios.defaults.baseURL = 'https://green-planet-moc.onrender.com';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get token from URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          // Set default authorization header for axios
          axios.defaults.headers.common['x-auth-token'] = token;
          
          // Get user info
          const res = await axios.get('/api/auth/me');
          console.log('User logged in:', res.data);
          
          // Redirect to home page
          navigate('/');
        } else {
          throw new Error('No token received');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        navigate('/login', { state: { error: 'Authentication failed' } });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <Container>
      <LoadingSpinner>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </LoadingSpinner>
      <Message>Completing authentication...</Message>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

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

const Message = styled.p`
  margin-top: 20px;
  font-size: 18px;
  color: #333;
`;

export default AuthCallback;