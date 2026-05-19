import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { api } from '../api/client';

type User = {
  id: string;
  nome: string;
  email: string;
  role: string;
  xpTotal: number;
  nivel: number;
};

type LoginInput = {
  email: string;
  senha: string;
};

type AuthState = {
  user: User | null;
  token: string | null;

  signIn: (data: LoginInput) => Promise<void>;
  signOut: () => void;
  loadUser: () => Promise<void>;
};

type LoginResponse = {
  user: User;
  token: string;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      async signIn(data) {
        const response = await api.post<LoginResponse>(
          '/auth/login',
          data,
        );

        const { token, user } = response.data;

        localStorage.setItem('@isometrica:token', token);

        set({
          token,
          user,
        });
      },

      signOut() {
        localStorage.removeItem('@isometrica:token');

        set({
          token: null,
          user: null,
        });
      },

      async loadUser() {
  try {
    const response = await api.get('/students/me');

    set((state) => ({
      ...state,
      user: response.data.user,
    }));
  } catch {
    localStorage.removeItem('@isometrica:token');

    set({
      token: null,
      user: null,
    });
  }
},
    }),
    {
      name: '@isometrica:auth',
    },
  ),
);