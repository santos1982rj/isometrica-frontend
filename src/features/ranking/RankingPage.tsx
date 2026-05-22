import { BarChart3, Medal, Trophy, Zap } from 'lucide-react';

const rankingSignals = [
  { label: 'XP acadêmico', icon: <Zap className="h-4 w-4" /> },
  { label: 'Exercicios resolvidos', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Consistencia semanal', icon: <Medal className="h-4 w-4" /> },
];

export function RankingPage() {
  return (
    <section className="w-full space-y-4">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Ranking acadêmico</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Evolucao dos estudantes</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          O placar vai valorizar constância e prática técnica, não apenas volume de cliques.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--accent-bg)] text-[var(--accent)]">
              <Trophy className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">Ranking em preparação</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Baseado nos sinais do estudo real.</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((position) => (
              <div key={position} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <span className="numeric grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text)]">
                  {position}
                </span>
                <div className="h-2 flex-1 rounded-full bg-[var(--surface)]" />
                <span className="text-xs font-semibold text-[var(--text-muted)]">em breve</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="grid gap-3">
          {rankingSignals.map((signal) => (
            <div key={signal.label} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--surface-soft)] text-[var(--iso-primary)]">{signal.icon}</span>
              <span className="text-sm font-semibold text-[var(--text)]">{signal.label}</span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
