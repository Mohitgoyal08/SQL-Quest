import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAccessToken } from '../services/api';
import { PlayerProfileService } from '../services/PlayerProfileService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For initial session restoration

  // On mount, try to restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Attempt to refresh the token using the HTTPOnly cookie
        const res = await apiClient.post('/auth/refresh');
        setAccessToken(res.data.access_token);
        
        // Fetch the user's profile
        const profileRes = await apiClient.get('/player/me');
        setUser(profileRes.data);
      } catch (err) {
        // Normal if user is not logged in or cookie expired
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      const res = await apiClient.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      setAccessToken(res.data.access_token);

      const profileRes = await apiClient.get('/player/me');
      setUser(profileRes.data);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to login' 
      };
    }
  };

  const register = async (email, password, displayName) => {
    try {
      await apiClient.post('/auth/register', {
        email,
        password,
        display_name: displayName,
      });
      // Automatically login after successful registration
      return await login(email, password);
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to register' 
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn("Logout request failed, but clearing local state anyway.", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      PlayerProfileService.clearProfile();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
