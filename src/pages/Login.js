import React from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Login = () => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    
    // Use window.location to navigate to the backend endpoint
    // This will trigger a full page redirect to Google OAuth
    window.location.href = 'https://green-planet-moc.onrender.com/api/auth/google';
  };

  return (
    <Container>
      <LoginCard>
        <Logo>Green Planet</Logo>
        <Title>Sign In</Title>
        <Subtitle>Welcome back to your plant paradise</Subtitle>
        
        <GoogleButton onClick={handleGoogleLogin}>
          <GoogleIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
          </GoogleIcon>
          Sign in with Google
        </GoogleButton>
        
        <Disclaimer>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Disclaimer>

        <DebugInfo>
          <DebugTitle>Debug Information</DebugTitle>
          <DebugText>
            Backend URL: https://green-planet-moc.onrender.com<br/>
            API Endpoint: /api/auth/google<br/>
            Clicking will redirect to Google OAuth
          </DebugText>
        </DebugInfo>
      </LoginCard>
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

const LoginCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  position: relative;
`;

const Logo = styled.h1`
  color: #2e7d32;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  gap: 0.5rem;

  &:hover {
    background: #357ae8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const GoogleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Disclaimer = styled.p`
  margin-top: 2rem;
  color: #999;
  font-size: 0.8rem;
  line-height: 1.4;
`;

const DebugInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #2e7d32;
`;

const DebugTitle = styled.h4`
  color: #2e7d32;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const DebugText = styled.p`
  color: #666;
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
`;

export default Login;