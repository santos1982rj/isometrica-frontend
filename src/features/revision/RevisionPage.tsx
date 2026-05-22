import { Brain, CheckCircle2, Clock3, Target } from 'lucide-react';

const signals = [
  { title: 'Dificuldade', description: 'Aulas e exercícios com maior fricção.', icon: <Target className="h-4 w-4" /> },
  { title: 'Retencao', description: 'Topicos que pedem retorno no momento certo.', icon: <Brain className="h-4 w-4" /> },
  { title: 'Frequencia', description: 'Ritmo recente e intervalos de estudo.', icon: <Clock3 className="h-4 w-4" /> },
];

export function RevisionPage() {
  return (
    <section className="w-full space-y-4">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Revisao inteligente</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Revisoes recomendadas</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Esta área está preparada para priorizar o que merece revisão, sem empilhar conteúdo aleatório.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--iso-primary-soft)] text-[var(--iso-primary)]">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">Fila de revisão em construção</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Enquanto o motor de recomendação evolui, use o dashboard e o histórico de aulas para revisar seus pontos ativos.
              </p>
            </div>
          </div>
        </article>

        <section className="grid gap-3">
          {signals.map((signal) => (
            <article key={signal.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--surface-soft)] text-[var(--iso-primary)]">{signal.icon}</span>
                <div>
                  <h2 className="text-sm font-semibold text-[var(--text)]">{signal.title}</h2>
                  <p className="mt-1 text-sm leading-5 text-[var(--text-muted)]">{signal.description}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
