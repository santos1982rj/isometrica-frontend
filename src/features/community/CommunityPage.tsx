import { MessageCircle, Users } from 'lucide-react';

export function CommunityPage() {
  return (
    <section className="w-full space-y-4">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Comunidade</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Estudantes ajudando estudantes</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          A área social será focada em estudo técnico, dúvidas bem formuladas e troca por curso.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--iso-primary-soft)] text-[var(--iso-primary)]">
            <Users className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-[var(--text)]">Grupos de estudo</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Espaço planejado para grupos por curso, turma e dificuldade.
          </p>
        </article>

        <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--accent-bg)] text-[var(--accent)]">
            <MessageCircle className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-[var(--text)]">Discussões técnicas</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Troca de hipoteses, metodos e solucoes sem transformar a plataforma em resposta automatica.
          </p>
        </article>
      </div>
    </section>
  );
}
