import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, fetchMeApi } from '../services/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('opportunity_os_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserSession() {
      const storedToken = localStorage.getItem('opportunity_os_token');
      if (storedToken) {
        try {
          const res = await fetchMeApi();
          if (res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('opportunity_os_token');
            setToken(null);
          }
        } catch (err) {
          console.error('Session validation error:', err);
          localStorage.removeItem('opportunity_os_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUserSession();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    if (res.token && res.user) {
      localStorage.setItem('opportunity_os_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || 'Login failed.');
  };

  const register = async (userData) => {
    const res = await registerApi(userData);
    if (res.token && res.user) {
      localStorage.setItem('opportunity_os_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.error || 'Registration failed.');
  };

  const logout = () => {
    localStorage.removeItem('opportunity_os_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
