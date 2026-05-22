import { Link } from 'react-router-dom';

import { useAuthStore } from '../../core/store/authStore';

import type { ReactNode } from 'react';

export function PublicCoursesFrame({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--text)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex min-h-20 w-full max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--iso-primary)] font-black text-white">
              I
            </span>
            <span className="text-sm font-black">ISOMÉTRICA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link className="iso-button-soft min-h-10 px-4 text-sm" to="/courses">
              Cursos
            </Link>
            <Link
              className="iso-button-primary min-h-10 px-4 text-sm"
              to={token ? '/dashboard' : '/register'}
            >
              {token ? 'Dashboard' : 'Criar conta'}
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[1480px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </div>
    </main>
  );
}
