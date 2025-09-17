// API utility functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://invest-learn-c08kv5erl-haleyhigas-projects.vercel.app';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  return fetch(url, { ...defaultOptions, ...options });
};

export default apiCall;
