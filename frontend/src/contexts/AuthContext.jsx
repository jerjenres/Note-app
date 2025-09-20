import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Listen for localStorage changes (login/logout in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
        console.log('[AuthContext] Storage change detected, updating user:', updatedUser);
        setUser(updatedUser);
      }
    };

    // Listen for custom auth events (login/logout in same tab)
    const handleAuthChange = (e) => {
      console.log('[AuthContext] Auth change event detected:', e.detail);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const login = async (email, password) => {
    try {
      console.log('[AuthContext] Login called with email:', email);
      const result = await authService.login(email, password);
      console.log('[AuthContext] Login successful, result:', result);

      const currentUser = authService.getCurrentUser();
      console.log('[AuthContext] Getting current user after login:', currentUser);
      setUser(currentUser);
      console.log('[AuthContext] User state updated to:', currentUser);

      return result;
    } catch (error) {
      console.error('[AuthContext] Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
