import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { api } from '../api/client';

type User = {
  id: string;
  nome: string;
  email: string;
  avatar?: string | null;
  headline?: string | null;
  location?: string | null;
  bio?: string | null;
  experience?: string | null;
  education?: string | null;
  skills?: string | null;
  interests?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  instagramUrl?: string | null;
  whatsapp?: string | null;
  role: string;
  xpTotal: number;
  nivel: number;
  emailVerifiedAt?: string | null;
  termsAcceptedAt?: string | null;
  privacyAcceptedAt?: string | null;
  marketingConsent?: boolean;
  trackingConsent?: boolean;
};

type LoginInput = {
  email: string;
  senha: string;
};

type RegisterInput = LoginInput & {
  nome: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  marketingConsent: boolean;
  trackingConsent: boolean;
};

type AuthState = {
  user: User | null;
  token: string | null;

  signIn: (data: LoginInput) => Promise<void>;
  signUp: (data: RegisterInput) => Promise<void>;
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

      async signUp(data) {
        const response = await api.post<LoginResponse>(
          '/auth/register',
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
