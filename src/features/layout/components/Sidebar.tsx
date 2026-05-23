import {
  Calculator,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Repeat2,
  Trophy,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { useAuthStore } from '../../../core/store/authStore';
import { resolveAssetUrl } from '../../../core/utils/assetUrl';

const navigation = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Cursos', href: '/courses', icon: GraduationCap },
  { label: 'Calculadoras', href: '/calculators', icon: Calculator },
  { label: 'Revisao', href: '/revision', icon: Repeat2 },
  { label: 'Analytics', href: '/analytics', icon: LineChart },
  { label: 'Ranking', href: '/ranking', icon: Trophy },
  { label: 'Comunidade', href: '/community', icon: Users },
];

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

type SidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const avatarUrl = resolveAssetUrl(user?.avatar);

  const canManageContent = user?.role === 'PROFESSOR' || user?.role === 'ADMIN';
  const canManagePlatform = user?.role === 'ADMIN';
  const visibleNavigation = [
    ...navigation,
    ...(canManageContent ? [{ label: 'Professor', href: '/teacher', icon: ClipboardList }] : []),
    ...(canManagePlatform ? [{ label: 'Admin', href: '/admin', icon: Wrench }] : []),
  ];

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition lg:hidden',
          isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onCloseMobile}
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 h-screen w-[84vw] max-w-[18rem] shrink-0 border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 lg:sticky lg:top-0 lg:z-auto lg:flex lg:h-auto lg:w-auto lg:max-w-none lg:flex-col',
          isCollapsed ? 'lg:w-[68px]' : 'lg:w-[232px]',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
      >
        <div className={isCollapsed ? 'px-2 pb-3 pt-4' : 'px-3 pb-4 pt-4'}>
          <div className={isCollapsed ? 'flex justify-center' : 'flex items-center justify-between gap-2'}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--iso-primary)] text-[var(--surface)] shadow-sm shadow-black/10">
                <span className="text-base font-black">I</span>
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <strong className="block text-sm font-black tracking-[0.08em] text-[var(--text)]">
                    ISOMETRICA
                  </strong>
                  <span className="mt-0.5 block truncate text-xs text-[var(--text-muted)]">
                    Engenharia acadêmica
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)] lg:hidden"
                onClick={onCloseMobile}
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <nav className={isCollapsed ? 'flex-1 overflow-y-auto overflow-x-visible px-2 pb-3' : 'flex-1 overflow-y-auto overflow-x-visible px-3 pb-4'}>
          <div className="space-y-1">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={`${item.href}-${item.label}`}
                  to={item.href}
                  title={isCollapsed ? item.label : undefined}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    [
                      'group relative flex min-h-11 items-center rounded-md border border-transparent transition-all duration-200',
                      isCollapsed ? 'justify-center px-0 py-2' : 'gap-3 px-3 py-2.5',
                      isActive
                        ? 'border-[var(--accent-border)] bg-[var(--iso-primary-soft)] text-[var(--iso-primary)]'
                        : 'text-[var(--text-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          className={[
                            'absolute left-0 w-0.5 rounded-r-full bg-[var(--iso-primary)]',
                            isCollapsed ? 'top-2 h-7' : 'top-2.5 h-6',
                          ].join(' ')}
                        />
                      )}

                      <Icon className="h-[18px] w-[18px] shrink-0 transition duration-200 group-hover:text-[var(--iso-primary)]" />

                      {!isCollapsed && (
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.label}</span>
                      )}

                      {isCollapsed && (
                        <span className="pointer-events-none absolute left-[calc(100%+0.5rem)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text)] opacity-0 shadow-xl shadow-black/15 transition duration-200 group-hover:opacity-100">
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className={isCollapsed ? 'border-t border-[var(--border)] p-2' : 'p-3'}>
          <NavLink
            to="/profile"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              [
                'mb-2 flex items-center rounded-md border transition',
                isCollapsed ? 'justify-center border-transparent p-1.5' : 'gap-3 border-[var(--border)] bg-[var(--surface-soft)] p-2.5',
                isActive ? 'border-[var(--accent-border)] bg-[var(--iso-primary-soft)]' : 'hover:border-[var(--border-strong)] hover:bg-[var(--surface-soft)]',
              ].join(' ')
            }
            title={isCollapsed ? user?.nome ?? 'Perfil' : undefined}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--accent-border)] bg-[var(--accent-bg)] text-xs font-semibold text-[var(--accent)]">
              {avatarUrl ? (
                <img className="h-full w-full object-cover" src={avatarUrl} alt={user?.nome ?? 'Perfil'} />
              ) : (
                getInitials(user?.nome)
              )}
            </span>

            {!isCollapsed && (
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--text)]">
                  {user?.nome ?? 'Aluno'}
                </span>
                <span className="block truncate text-xs text-[var(--text-muted)]">
                  {user?.headline ?? `Nível ${user?.nivel ?? 1}`}
                </span>
              </span>
            )}
          </NavLink>

          <div className={isCollapsed ? 'flex justify-center py-2' : 'rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3'}>
            {isCollapsed ? (
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--success-500)]" title="Plataforma ativa" />
            ) : (
              <>
                <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Ambiente</span>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[var(--success-500)]" />
                  <span className="text-xs font-medium text-[var(--text-soft)]">Plataforma ativa</span>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
