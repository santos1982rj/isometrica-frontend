import { CheckCircle2, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ModuleLessonItem = {
  id: string;
  titulo: string;
  duracao: number | null;
};

type LessonProgressItem = {
  aulaId: string;
  concluida: boolean;
};

type ModuleLessonsListProps = {
  currentLessonId: string;
  lessons: ModuleLessonItem[];
  progress?: LessonProgressItem[];
  onNavigateLesson?: (lessonId: string) => void;
};

export function ModuleLessonsList({
  currentLessonId,
  lessons,
  progress,
  onNavigateLesson,
}: ModuleLessonsListProps) {
  const navigate = useNavigate();
  const completedCount = lessons.filter((lesson) =>
    progress?.some((item) => item.aulaId === lesson.id && item.concluida),
  ).length;

  const navigateToLesson = (lessonId: string) => {
    if (onNavigateLesson) {
      onNavigateLesson(lessonId);
      return;
    }

    navigate(`/lessons/${lessonId}`);
  };

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5">
      <div className="flex items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Módulo atual</p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Sequência</h2>
        </div>
        <span className="numeric text-sm font-semibold text-[var(--text-muted)]">{completedCount}/{lessons.length}</span>
      </div>

      <div className="mt-3 space-y-2">
        {lessons.map((lesson, index) => {
          const isActive = lesson.id === currentLessonId;
          const isCompleted = progress?.some((item) => item.aulaId === lesson.id && item.concluida);

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => navigateToLesson(lesson.id)}
              className={[
                'group relative flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition',
                isActive
                  ? 'border-[var(--accent-border)] bg-[var(--iso-primary-soft)]'
                  : 'border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]',
              ].join(' ')}
            >
              {isActive && <span className="absolute left-0 top-2 h-8 w-0.5 rounded-r-full bg-[var(--iso-primary)]" />}
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface)]">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--success-500)]" />
                ) : (
                  <PlayCircle className="h-4 w-4 text-[var(--text-muted)]" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[var(--text)]">{lesson.titulo}</span>
                <span className="mt-0.5 block text-xs text-[var(--text-muted)]">Aula {index + 1} | {lesson.duracao ?? 0} min</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
