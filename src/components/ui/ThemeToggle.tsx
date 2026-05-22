import { Moon, Sun } from 'lucide-react';

import { useTheme } from '../../theme/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] transition hover:border-[var(--accent-border)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
      aria-label="Alternar tema"
      title="Alternar tema"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[var(--accent-500)]" />
      ) : (
        <Moon className="h-4 w-4 text-[var(--secondary-700)]" />
      )}
    </button>
  );
}
