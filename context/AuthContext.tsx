import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Platform } from 'react-native';

// Define types
type User = {
  id: string;
  email: string;
  name: string;
  role: 'rider' | 'fixer' | null;
  isVerified: boolean;
  profileCompleted: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateUserRole: (role: 'rider' | 'fixer') => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Mock API base URL - replace with your actual API URL
const API_BASE_URL = 'https://fixmijnbike.nl/api';

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getItemFromStorage(USER_KEY);
        const token = await getItemFromStorage(TOKEN_KEY);
        
        if (userData && token) {
          setUser(JSON.parse(userData));
          // Here you would typically validate the token with your backend
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Helper function for storage (handles web and native platforms)
  const saveItemToStorage = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  };

  const getItemFromStorage = async (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  };

  const removeItemFromStorage = async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  };

  // Auth functions
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      // const response = await fetch(`${API_BASE_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      
      // Mock successful response
      const mockUser: User = {
        id: '123',
        email,
        name: 'Test User',
        role: 'rider',
        isVerified: true,
        profileCompleted: true
      };
      
      const mockToken = 'mock_jwt_token';
      
      // Save to storage
      await saveItemToStorage(TOKEN_KEY, mockToken);
      await saveItemToStorage(USER_KEY, JSON.stringify(mockUser));
      
      setUser(mockUser);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call here
      // const response = await fetch(`${API_BASE_URL}/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name }),
      // });
      // const data = await response.json();
      
      // Mock successful response
      const mockUser: User = {
        id: '123',
        email,
        name,
        role: null,
        isVerified: false,
        profileCompleted: false
      };
      
      const mockToken = 'mock_jwt_token';
      
      // Save to storage
      await saveItemToStorage(TOKEN_KEY, mockToken);
      await saveItemToStorage(USER_KEY, JSON.stringify(mockUser));
      
      setUser(mockUser);
      router.replace('/onboarding/role');
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Remove from storage
      await removeItemFromStorage(TOKEN_KEY);
      await removeItemFromStorage(USER_KEY);
      
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      // In a real app, you would make an API call here
      // await fetch(`${API_BASE_URL}/forgot-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      
      // Mock successful response
      return Promise.resolve();
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      // In a real app, you would make an API call here
      // await fetch(`${API_BASE_URL}/reset-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password }),
      // });
      
      // Mock successful response
      return Promise.resolve();
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // In a real app, you would make an API call here
      // await fetch(`${API_BASE_URL}/verify-email`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token }),
      // });
      
      // Update user verification status
      if (user) {
        const updatedUser = { ...user, isVerified: true };
        await saveItemToStorage(USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  };

  const updateUserRole = async (role: 'rider' | 'fixer') => {
    try {
      // In a real app, you would make an API call here
      // await fetch(`${API_BASE_URL}/users/role`, {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${await getItemFromStorage(TOKEN_KEY)}`
      //   },
      //   body: JSON.stringify({ role }),
      // });
      
      // Update user role locally
      if (user) {
        const updatedUser = { ...user, role };
        await saveItemToStorage(USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Navigate based on role
        if (role === 'fixer') {
          router.replace('/onboarding/fixer');
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      console.error('Role update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
        resetPassword,
        verifyEmail,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};