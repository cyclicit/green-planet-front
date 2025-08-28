import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if user is authenticated
        await checkAuthStatus();
        
        // Redirect to dashboard after successful authentication
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, checkAuthStatus]);

  return (
    <Container>
      <MessageCard>
        <SuccessIcon>✅</SuccessIcon>
        <Title>Authentication Successful!</Title>
        <Message>You are being redirected to your dashboard...</Message>
        <LoadingSpinnerSmall>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </LoadingSpinnerSmall>
      </MessageCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  padding: 2rem;
`;

const MessageCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #2e7d32;
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const LoadingSpinnerSmall = styled.div`
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 4px;
    border: 4px solid #2e7d32;
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

export default AuthCallback;