import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse, User, Book, Author } from '@/types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401/403 (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/');
      if (!isAuthRoute) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/user', data);
    return response.data;
  },
};

export const userAPI = {
  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },

  create: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/user', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/user/${id}`);
  },
};

export const bookAPI = {
  getAll: async (): Promise<Book[]> => {
    const response = await api.get('/book');
    return response.data;
  },

  getById: async (id: string): Promise<Book> => {
    const response = await api.get(`/book/${id}`);
    return response.data;
  },

  register: async (formData: FormData): Promise<Book> => {
    const response = await api.post('/book', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  buy: async (bookId: string): Promise<any> => {
    const response = await api.put(`/book/buy?id=${bookId}`);
    return response.data;
  },

  downloadEpub: async (bookId: string): Promise<Blob> => {
    const response = await api.get(`/book/epub/${bookId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const authorAPI = {
  getById: async (id: string): Promise<Author> => {
    const response = await api.get(`/author/${id}`);
    return response.data;
  },

  register: async (data: { firstName: string; lastName: string }): Promise<Author> => {
    const response = await api.post('/author', data);
    return response.data;
  },
};

export default api;
