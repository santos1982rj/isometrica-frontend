import {
  BookOpen,
  Calculator,
  Flame,
  GraduationCap,
  LayoutDashboard,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Disciplinas',
    path: '/courses',
    icon: BookOpen,
  },
  {
    label: 'Calculadoras',
    path: '/calculators',
    icon: Calculator,
  },
  {
    label: 'Modo pré-prova',
    path: '/study-mode',
    icon: Flame,
  },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#060e18]/80 px-5 py-6 backdrop-blur-xl lg:block">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20">
          <GraduationCap className="h-6 w-6" />
        </div>

        <div>
          <strong className="block text-lg tracking-tight text-slate-50">
            ISOMÉTRICA
          </strong>
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
            Engenharia
          </span>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-300/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="liquid-card absolute bottom-5 left-5 right-5 rounded-3xl p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
          Modo estudante
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          Clareza para estudar, rigor para evoluir.
        </p>
      </div>
    </aside>
  );
}