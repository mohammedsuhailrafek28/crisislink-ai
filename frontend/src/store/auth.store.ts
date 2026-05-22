import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { api } from '../lib/api';

interface User {
  id: string;
  username?: string;
  fullName: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  profilePhoto?: string | null;
  talentType: string;
  city: string | null;
  country: string | null;
  skills?: string[];
  verified: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  talentType: string;
  city?: string;
  country?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'fullName' | 'bio' | 'talentType' | 'city' | 'country' | 'skills'>>) => Promise<void>;
  uploadAvatar: (imageBase64: string) => Promise<string>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;
    if (Array.isArray(responseMessage)) {
      return responseMessage.join(', ');
    }
    if (typeof responseMessage === 'string') {
      return responseMessage;
    }

    const responseError = error.response?.data?.error;
    if (typeof responseError === 'string') {
      return responseError;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const isProfileComplete = (user: User | null) => {
  if (!user) {
    return false;
  }

  const hasCoreFields = Boolean(
    user.fullName?.trim() &&
      user.talentType?.trim() &&
      user.bio?.trim() &&
      user.city?.trim() &&
      user.country?.trim() &&
      user.skills &&
      user.skills.length > 0,
  );

  return hasCoreFields && Boolean(user.profilePhoto ?? user.avatarUrl);
};

const toPublicUrl = (path: string) => {
  const baseUrl = api.defaults.baseURL ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
  const mediaHost = baseUrl.replace(/\/api\/v1\/?$/, '');
  return `${mediaHost}${path.startsWith('/') ? path : `/${path}`}`;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  isProfileComplete: false,

  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await SecureStore.setItemAsync('kinship_token', data.accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isProfileComplete: isProfileComplete(data.user),
      });
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed'));
    }
  },

  register: async (registerData) => {
    try {
      const { data } = await api.post('/auth/register', registerData);
      await SecureStore.setItemAsync('kinship_token', data.accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isProfileComplete: isProfileComplete(data.user),
      });
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed'));
    }
  },

  updateProfile: async (profileData) => {
    try {
      const { data } = await api.patch('/users/me/profile', profileData);
      set({ user: data, isProfileComplete: isProfileComplete(data) });
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Profile update failed'));
    }
  },

  uploadAvatar: async (imageBase64) => {
    try {
      const { data } = await api.post('/upload/avatar', { imageBase64 });
      const publicUrl = toPublicUrl(data.url);
      set((state) =>
        state.user
          ? {
              user: { ...state.user, profilePhoto: publicUrl, avatarUrl: publicUrl },
              isProfileComplete: isProfileComplete({ ...state.user, profilePhoto: publicUrl, avatarUrl: publicUrl }),
            }
          : state,
      );
      return publicUrl;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Avatar upload failed'));
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('kinship_token');
    delete api.defaults.headers.common.Authorization;
    set({ user: null, token: null, isAuthenticated: false, isProfileComplete: false });
  },

  loadFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync('kinship_token');
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        const { data } = await api.get('/auth/me');
        set({ user: data, token, isAuthenticated: true, isProfileComplete: isProfileComplete(data) });
      }
    } catch {
      await SecureStore.deleteItemAsync('kinship_token');
    } finally {
      set({ isLoading: false });
    }
  },
}));