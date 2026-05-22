import { createContext } from 'react';

import type { ThemeMode } from './theme.types';

export type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
};

/**
 * Contexto global do sistema de tema.
 */
export const ThemeContext =
  createContext<ThemeContextValue | null>(null);