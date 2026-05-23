import { ChevronDown, CheckCircle2, LockKeyhole, PlayCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { CourseDetails } from '../../courses/courses.types';

type LessonProgressItem = {
  aulaId: string;
  concluida: boolean;
};

type CourseCurriculumSidebarProps = {
  course: CourseDetails;
  currentLessonId: string;
  progress?: LessonProgressItem[];
  onNavigateLesson: (lessonId: string) => void;
};

export function CourseCurriculumSidebar({
  course,
  currentLessonId,
  progress,
  onNavigateLesson,
}: CourseCurriculumSidebarProps) {
  const currentModule = useMemo(
    () => course.modulos.find((module) =>
      module.aulas.some((lesson) => lesson.id === currentLessonId),
    ),
    [course.modulos, currentLessonId],
  );
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(course.modulos.map((module) => [module.id, module.id === currentModule?.id])),
  );

  const totalLessons = course.modulos.reduce((total, module) => total + module.aulas.length, 0);
  const completedLessons = course.modulos.reduce(
    (total, module) =>
      total +
      module.aulas.filter((lesson) =>
        progress?.some((item) => item.aulaId === lesson.id && item.concluida),
      ).length,
    0,
  );

  const toggleModule = (moduleId: string) => {
    setOpenModules((previous) => ({
      ...previous,
      [moduleId]: !previous[moduleId],
    }));
  };

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm shadow-black/5">
      <div className="border-b border-[var(--border)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Conteúdo do curso</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">Módulos e aulas</h2>
          <span className="numeric text-sm font-semibold text-[var(--text-muted)]">
            {completedLessons}/{totalLessons}
          </span>
        </div>
      </div>

      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-2">
        {course.modulos.map((module, moduleIndex) => {
          const isOpen = module.id === currentModule?.id || (openModules[module.id] ?? false);
          const completedInModule = module.aulas.filter((lesson) =>
            progress?.some((item) => item.aulaId === lesson.id && item.concluida),
          ).length;

          return (
            <div key={module.id} className="rounded-lg">
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[var(--surface-soft)]"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase text-[var(--text-muted)]">
                    Módulo {moduleIndex + 1}
                  </span>
                  <span className="mt-1 block truncate text-sm font-semibold text-[var(--text)]">
                    {module.titulo}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="numeric text-xs font-semibold text-[var(--text-muted)]">
                    {completedInModule}/{module.aulas.length}
                  </span>
                  <ChevronDown
                    className={[
                      'h-4 w-4 text-[var(--text-muted)] transition-transform',
                      isOpen ? 'rotate-180' : '',
                    ].join(' ')}
                  />
                </span>
              </button>

              {isOpen && (
                <div className="space-y-1 pb-2">
                  {module.aulas.map((lesson, lessonIndex) => {
                    const isActive = lesson.id === currentLessonId;
                    const isCompleted = progress?.some(
                      (item) => item.aulaId === lesson.id && item.concluida,
                    );

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => onNavigateLesson(lesson.id)}
                        className={[
                          'group relative flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition',
                          isActive
                            ? 'bg-[var(--iso-primary-soft)] text-[var(--text)]'
                            : 'text-[var(--text-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]',
                        ].join(' ')}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-2.5 h-8 w-0.5 rounded-r-full bg-[var(--iso-primary)]" />
                        )}
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface)]">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-[var(--success-500)]" />
                          ) : lesson.isGratuita ? (
                            <PlayCircle className="h-4 w-4 text-[var(--iso-primary)]" />
                          ) : (
                            <LockKeyhole className="h-4 w-4 text-[var(--text-muted)]" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block line-clamp-2 text-sm font-semibold leading-5">
                            {lesson.titulo}
                          </span>
                          <span className="mt-1 block text-xs text-[var(--text-muted)]">
                            Aula {lessonIndex + 1} | {lesson.duracao ?? 0} min
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
