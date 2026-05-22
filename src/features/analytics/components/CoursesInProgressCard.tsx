import { BookOpen } from 'lucide-react';

type CoursesInProgressCardProps = {
  total: number;
};

export function CoursesInProgressCard({ total }: CoursesInProgressCardProps) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[rgba(56,178,172,0.12)] text-[var(--success-500)]">
        <BookOpen className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Trilhas acadêmicas</p>
      <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">Cursos em andamento</h3>
      <p className="numeric mt-4 text-4xl font-semibold text-[var(--text)]">{total}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">Continue avancando gradualmente. Consistencia vence intensidade.</p>
    </article>
  );
}
