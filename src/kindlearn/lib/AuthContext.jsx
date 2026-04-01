import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authApi } from '@/kindlearn/api/auth';
import { queryClientInstance } from '@/lib/query-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('kl_token');
    if (!token) {
      setIsLoadingAuth(false);
      return;
    }
    try {
      const currentUser = await authApi.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('kl_token');
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    // Clear any cached data from a previous session before loading new user data
    queryClientInstance.clear();
    const { user: u } = await authApi.login(email, password);
    setUser(u);
    setIsAuthenticated(true);
    return u;
  };

  const register = async (email, password, name) => {
    // Clear any cached data from a previous session before loading new user data
    queryClientInstance.clear();
    const { user: u } = await authApi.register(email, password, name);
    setUser(u);
    setIsAuthenticated(true);
    return u;
  };

  const logout = () => {
    authApi.logout();
    // Wipe all cached query data so next user starts completely fresh
    queryClientInstance.clear();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/kindlearn/login';
  };

  const refreshUser = async () => {
    try {
      const u = await authApi.me();
      setUser(u);
      return u;
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      login,
      register,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
