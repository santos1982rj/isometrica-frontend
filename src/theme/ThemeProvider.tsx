import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  DEFAULT_THEME,
  STORAGE_THEME_KEY,
} from './theme.constants';

import { ThemeContext } from './ThemeContext';

import type { ThemeMode } from './theme.types';

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Obtém o tema inicial:
 * - localStorage;
 * - preferência do sistema;
 * - fallback default.
 */
function getInitialTheme(): ThemeMode {
  const storedTheme =
    localStorage.getItem(
      STORAGE_THEME_KEY,
    ) as ThemeMode | null;

  if (
    storedTheme === 'light' ||
    storedTheme === 'dark'
  ) {
    return storedTheme;
  }

  const prefersDark =
    window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

  return prefersDark
    ? 'dark'
    : DEFAULT_THEME;
}

/**
 * Provider global de tema da ISOMÉTRICA.
 */
export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] =
    useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const html =
      document.documentElement;

    html.classList.remove(
      'light',
      'dark',
    );

    html.classList.add(theme);

    localStorage.setItem(
      STORAGE_THEME_KEY,
      theme,
    );
  }, [theme]);

  function setTheme(theme: ThemeMode) {
    setThemeState(theme);
  }

  function toggleTheme() {
    setThemeState((previous) =>
      previous === 'dark'
        ? 'light'
        : 'dark',
    );
  }

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}