import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, SpotifyUser } from '../types/spotify';
import ApiService from '../services/apiService';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
  setUserId: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    userId: null,
  });

  const login = async () => {
    try {
      const { authUrl } = await ApiService.getSpotifyAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('jwtToken');
    setAuthState({
      isAuthenticated: false,
      user: null,
      userId: null,
    });
  };

  const setUserId = (userId: string) => {
    localStorage.setItem('userId', userId);
    setAuthState(prev => ({
      ...prev,
      userId,
      isAuthenticated: true,
    }));
  };

  // Load authentication state on app start
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('jwtToken');
    
    if (storedUserId && storedToken) {
      setAuthState(prev => ({
        ...prev,
        userId: storedUserId,
        isAuthenticated: true,
      }));

      // Optionally fetch user profile
      // Note: You'll need to implement JWT token generation for the userId
      // For now, we'll just mark as authenticated
    }
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    setUserId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 