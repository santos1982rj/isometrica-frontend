import { Bell, LogOut, Search } from 'lucide-react';

import { useAuthStore } from '../../core/store/authStore';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#060e18]/70 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Painel acadêmico
          </p>

          <h1 className="mt-1 text-xl font-semibold text-slate-50">
            Olá, {user?.nome ?? 'Estudante'}
          </h1>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-slate-400">
            <Search className="h-4 w-4" />
            <span className="text-sm">
              Buscar disciplina, aula ou cálculo
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                XP
              </p>

              <strong className="numeric text-slate-50">
                {user?.xpTotal ?? 0}
              </strong>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                Nível
              </p>

              <strong className="numeric text-slate-50">
                {user?.nivel ?? 1}
              </strong>
            </div>
          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.06]">
            <Bell className="h-5 w-5" />
          </button>

          <button
            onClick={signOut}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}