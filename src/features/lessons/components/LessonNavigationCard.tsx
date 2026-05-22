import { ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type LessonNavigationItem = {
  id: string;
  titulo: string;
};

type LessonNavigationCardProps = {
  previousLesson?: LessonNavigationItem;
  nextLesson?: LessonNavigationItem;
  onNavigateLesson?: (lessonId: string) => void;
};

export function LessonNavigationCard({
  previousLesson,
  nextLesson,
  onNavigateLesson,
}: LessonNavigationCardProps) {
  const navigate = useNavigate();

  const navigateToLesson = (lessonId: string) => {
    if (onNavigateLesson) {
      onNavigateLesson(lessonId);
      return;
    }

    navigate(`/lessons/${lessonId}`);
  };

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5">
      <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Continuidade</p>
      <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Navegação da trilha</h2>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          disabled={!previousLesson}
          onClick={() => previousLesson && navigateToLesson(previousLesson.id)}
          className="flex min-h-16 items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-left transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase text-[var(--text-muted)]">Anterior</span>
            <span className="mt-1 block truncate text-sm font-semibold text-[var(--text)]">{previousLesson?.titulo ?? 'Não disponível'}</span>
          </span>
          <ArrowLeft className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        </button>

        <button
          type="button"
          disabled={!nextLesson}
          onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
          className="flex min-h-16 items-center justify-between gap-3 rounded-lg border border-[var(--accent-border)] bg-[var(--iso-primary-soft)] p-3 text-left transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase text-[var(--iso-primary)]">Próxima</span>
            <span className="mt-1 block truncate text-sm font-semibold text-[var(--text)]">{nextLesson?.titulo ?? 'Trilha finalizada'}</span>
          </span>
          {nextLesson ? (
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--iso-primary)]" />
          ) : (
            <PlayCircle className="h-4 w-4 shrink-0 text-[var(--success-500)]" />
          )}
        </button>
      </div>
    </section>
  );
}
