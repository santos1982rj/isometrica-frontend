import { BookCheck, Clock3, Target } from 'lucide-react';

export function StudyModePage() {
  return (
    <section className="w-full space-y-4">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Modo pre-prova</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Estudo com foco de avaliação</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Revisoes objetivas para organizar tempo, topicos e pratica antes da prova.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Topicos chave', icon: <Target className="h-5 w-5" /> },
          { title: 'Tempo disponivel', icon: <Clock3 className="h-5 w-5" /> },
          { title: 'Checklist final', icon: <BookCheck className="h-5 w-5" /> },
        ].map((item) => (
          <article key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--surface-soft)] text-[var(--iso-primary)]">{item.icon}</span>
            <h2 className="mt-4 text-lg font-semibold text-[var(--text)]">{item.title}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Fluxo em preparação.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
