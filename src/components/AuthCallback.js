import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { handleSuccessfulLogin } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    
    const handleAuthCallback = async () => {
      hasProcessed.current = true;
      
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const refreshToken = urlParams.get('refreshToken');
      const userId = urlParams.get('userId');
      const error = urlParams.get('error');
      
      console.log('Auth callback received:', { token, refreshToken, userId, error });
      
      if (token && userId) {
        try {
          // Store the access token and userId
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          
          // Store refresh token if available, otherwise we'll handle token refresh differently
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          
          // Verify the token with backend to get user data
          const response = await fetch('https://green-planet-moc.onrender.com/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            
            // Update auth state with the actual user data
            handleSuccessfulLogin(token, userId, userData.user || userData);
            
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            
            toast.success('Login successful! Welcome back!', {
              toastId: 'login-success'
            });
            
            navigate('/');
          } else {
            throw new Error('Token verification failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          toast.error('Login failed. Please try again.', {
            toastId: 'login-error'
          });
          navigate('/login');
        }
      } else if (error) {
        // Handle error
        toast.error(`Login failed: ${error}`, {
          toastId: 'login-error'
        });
        navigate('/login');
      } else {
        // No auth data found
        toast.error('Invalid authentication response. Please try again.', {
          toastId: 'login-invalid'
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, handleSuccessfulLogin]);

  return (
    <Container>
      <Spinner />
      <Message>Completing your login...</Message>
      <SubMessage>You'll be redirected in a moment</SubMessage>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  text-align: center;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2e7d32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.h2`
  color: #2e7d32;
  margin-bottom: 0.5rem;
`;

const SubMessage = styled.p`
  color: #666;
`;

export default AuthCallback;