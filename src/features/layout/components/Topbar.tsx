import { Bell, ChevronLeft, ChevronRight, LogOut, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { ThemeToggle } from '../../../components/ui/ThemeToggle';
import { useAuthStore } from '../../../core/store/authStore';
import { GlobalSearch } from '../../search/GlobalSearch';

type TopbarProps = {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

function getInitials(name?: string) {
  if (!name) {
    return 'IS';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function Topbar({
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenMobileSidebar,
}: TopbarProps) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="flex min-h-16 items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 lg:px-7">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] transition hover:border-[var(--accent-border)] hover:text-[var(--text)] lg:hidden"
            aria-label="Abrir menu"
            onClick={onOpenMobileSidebar}
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] transition hover:border-[var(--accent-border)] hover:text-[var(--text)] lg:flex"
            aria-label={
              isSidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'
            }
            onClick={onToggleSidebar}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          <GlobalSearch />
        </div>

        <div className="flex items-center gap-1.5 border-l border-[var(--border)] pl-2 sm:gap-2 sm:pl-3">
          <ThemeToggle />

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] transition hover:border-[var(--accent-border)] hover:bg-[var(--surface)] hover:text-[var(--text)] sm:flex"
            aria-label="Notificacoes"
          >
            <Bell className="h-4 w-4" />
          </button>

          <Link
            className="hidden min-w-0 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] py-1.5 pl-1.5 pr-2.5 transition hover:border-[var(--accent-border)] hover:bg-[var(--surface)] sm:flex"
            to="/profile"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] text-xs font-semibold text-[var(--accent)]">
              {user?.avatar ? (
                <img
                  className="h-full w-full object-cover"
                  src={user.avatar}
                  alt={user.nome}
                />
              ) : (
                getInitials(user?.nome)
              )}
            </div>

            <div className="min-w-0">
              <p className="max-w-32 truncate text-sm font-semibold text-[var(--text)]">
                {user?.nome ?? 'Aluno'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Nivel {user?.nivel ?? 1}
              </p>
            </div>
          </Link>

          <button
            aria-label="Sair"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-soft)] transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
            onClick={handleSignOut}
            title="Sair"
            type="button"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
