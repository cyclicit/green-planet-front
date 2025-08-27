import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Set base URL for API calls
axios.defaults.baseURL = 'https://green-planet-moc.onrender.com';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  });

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      getUser();
    }
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    } catch (err) {
      console.error('Error getting user:', err);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      dispatch({ type: 'LOGOUT' });
    }
  };

  const loginWithGoogle = () => {
    console.log('Redirecting to Google OAuth...');
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'https://green-planet-moc.onrender.com/api/auth/google';
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      loginWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);