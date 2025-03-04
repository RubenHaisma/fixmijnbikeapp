import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Base URL for API requests
const API_BASE_URL = 'https://fixmijnbike.nl/api';

// Helper function to get token from storage
const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('auth_token');
  } else {
    return await SecureStore.getItemAsync('auth_token');
  }
};

// Generic API request function with authentication
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Er is een fout opgetreden');
  }
  
  return response.json();
};

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData: any) => 
    apiRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  forgotPassword: (email: string) => 
    apiRequest('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  
  resetPassword: (token: string, password: string) => 
    apiRequest('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  
  verifyEmail: (token: string) => 
    apiRequest(`/verify-email?token=${token}`),
  
  resendVerification: () => 
    apiRequest('/resend-verification', {
      method: 'POST',
    }),
};

// User API calls
export const userAPI = {
  getProfile: () => 
    apiRequest('/users/me'),
  
  updateProfile: (profileData: any) => 
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  
  updateRole: (role: 'RIDER' | 'FIXER') => 
    apiRequest('/users/role', {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),
  
  updateFixerProfile: (profileData: any) => 
    apiRequest('/users/fixer-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  
  getFixerStats: () => 
    apiRequest('/users/fixer-stats'),
  
  updateAvailability: (isAvailable: boolean) => 
    apiRequest('/users/availability', {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    }),
};

// Repair API calls
export const repairAPI = {
  createRepair: (repairData: any) => 
    apiRequest('/repairs', {
      method: 'POST',
      body: JSON.stringify(repairData),
    }),
  
  getRepair: (id: string) => 
    apiRequest(`/repairs/${id}`),
  
  getRiderRepairs: () => 
    apiRequest('/repairs/rider'),
  
  getFixerRepairs: () => 
    apiRequest('/repairs/fixer'),
  
  acceptRepair: (id: string) => 
    apiRequest(`/repairs/${id}/accept`, {
      method: 'PUT',
    }),
  
  declineRepair: (id: string, reason: string) => 
    apiRequest(`/repairs/${id}/decline`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),
  
  completeRepair: (id: string) => 
    apiRequest(`/repairs/${id}/complete`, {
      method: 'PUT',
    }),
  
  cancelRepair: (id: string) => 
    apiRequest(`/repairs/${id}/cancel`, {
      method: 'PUT',
    }),
  
  reviewRepair: (id: string, rating: number, comment: string) => 
    apiRequest(`/fixer-profile/review`, {
      method: 'POST',
      body: JSON.stringify({ 
        profileId: id, 
        rating, 
        comment 
      }),
    }),
};

// Notification API calls
export const notificationAPI = {
  getNotifications: (limit = 20, offset = 0) => 
    apiRequest(`/notifications?limit=${limit}&offset=${offset}`),
  
  getUnreadCount: () => 
    apiRequest('/notifications?countOnly=true'),
  
  markAsRead: (notificationId: string) => 
    apiRequest('/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notificationId }),
    }),
  
  markAllAsRead: () => 
    apiRequest('/notifications', {
      method: 'PUT',
      body: JSON.stringify({ markAllRead: true }),
    }),
  
  deleteNotification: (id: string) => 
    apiRequest(`/notifications?id=${id}`, {
      method: 'DELETE',
    }),
  
  getPreferences: () => 
    apiRequest('/notifications/preferences'),
  
  updatePreferences: (preferences: any) => 
    apiRequest('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    }),
};

// Payment API calls
export const paymentAPI = {
  createSession: (repairId: string) => 
    apiRequest('/payments/create-session', {
      method: 'POST',
      body: JSON.stringify({ repairId }),
    }),
  
  requestPayout: () => 
    apiRequest('/payouts/request', {
      method: 'POST',
    }),
};

// Referral API calls
export const referralAPI = {
  applyReferral: (referralCode: string) => 
    apiRequest('/referrals', {
      method: 'POST',
      body: JSON.stringify({ referralCode }),
    }),
  
  getReferrals: () => 
    apiRequest('/referrals'),
};

// Fixer profile API calls
export const fixerProfileAPI = {
  getProfile: (userId: string) => 
    apiRequest(`/fixer-profile?userId=${userId}`),
  
  createProfile: (profileData: any) => 
    apiRequest('/fixer-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    }),
  
  updateProfile: (profileData: any) => 
    apiRequest('/fixer-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

export default {
  auth: authAPI,
  user: userAPI,
  repair: repairAPI,
  notification: notificationAPI,
  payment: paymentAPI,
  referral: referralAPI,
  fixerProfile: fixerProfileAPI,
};