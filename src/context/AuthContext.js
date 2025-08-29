// In src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('https://green-planet-moc.onrender.com/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser(userData.user || userData); // Handle both response structures
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
      return false;
    }
  };

  const loginWithGoogle = () => {
    window.location.href = 'https://green-planet-moc.onrender.com/api/auth/google';
  };

  // Add this function to update auth state after successful login
  const handleSuccessfulLogin = (token, userId, userData = null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    
    if (userData) {
      setUser(userData);
    }
    
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUser(null);
    
    // Optional: call backend logout endpoint
    fetch('https://green-planet-moc.onrender.com/api/auth/logout', {
      method: 'POST'
    }).catch(err => console.error('Logout error:', err));
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await fetch('https://green-planet-moc.onrender.com/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // Setup token refresh interval
  useEffect(() => {
    const setupTokenRefresh = () => {
      // Refresh token every 30 minutes
      const refreshInterval = setInterval(async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await fetch('https://green-planet-moc.onrender.com/api/auth/refresh', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('token', data.token);
              console.log('Token refreshed successfully');
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
          }
        }
      }, 30 * 60 * 1000); // 30 minutes
      
      return () => clearInterval(refreshInterval);
    };

    const cleanup = setupTokenRefresh();
    return cleanup;
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        await verifyToken(token);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const value = {
    isAuthenticated,
    user,
    loginWithGoogle,
    refreshToken,
    logout,
    loading,
    handleSuccessfulLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;