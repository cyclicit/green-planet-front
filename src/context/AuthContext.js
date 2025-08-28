import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within anAuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Set base URL for API calls
  const API_BASE_URL = 'https://green-planet-moc.onrender.com';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/user`, { 
        withCredentials: true 
      });
      
      if (res.data.isAuthenticated && res.data.user) {
        setUser(res.data.user);
        setError('');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Unable to check authentication status');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    // Clear any previous errors
    setError('');
    
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/auth/logout`, { 
        withCredentials: true 
      });
      setUser(null);
      setError('');
      
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    }
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    loginWithGoogle,
    logout,
    loading,
    error,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};