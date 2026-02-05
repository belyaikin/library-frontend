import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI, userAPI } from '@/api';
import type { User, LoginCredentials, RegisterData } from '@/types';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: string;
  role: 'USER' | 'ADMIN';
  exp: number;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isGuest = ref(localStorage.getItem('isGuest') === 'true');

  const isAuthenticated = computed(() => !!accessToken.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await authAPI.login(credentials);
      accessToken.value = response.accessToken;
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.removeItem('isGuest');
      isGuest.value = false;

      const decoded = jwtDecode<TokenPayload>(response.accessToken);

      const userData = await userAPI.getById(decoded.userId);
      user.value = userData;

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      isLoading.value = true;
      error.value = null;

      await authAPI.register(data);

      return await login({
        email: data.email,
        password: data.password,
      });
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const loginAsGuest = () => {
    isGuest.value = true;
    localStorage.setItem('isGuest', 'true');
  };

  const logout = () => {
    user.value = null;
    accessToken.value = null;
    isGuest.value = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isGuest');
  };

  const loadUser = async () => {
    if (!accessToken.value) return;

    try {
      const decoded = jwtDecode<TokenPayload>(accessToken.value);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      const userData = await userAPI.getById(decoded.userId);
      user.value = userData;
    } catch (err) {
      logout();
    }
  };

  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isGuest,
    login,
    register,
    loginAsGuest,
    logout,
    loadUser,
  };
});
