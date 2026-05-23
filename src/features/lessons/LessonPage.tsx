import {
  ArrowLeft,
  BookText,
  CheckCircle2,
  ClipboardCheck,
  CircleCheck,
  CircleX,
  LockKeyhole,
  LogIn,
  UserPlus,
  X,
  FileText,
  Paperclip,
  Save,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { IsoBadge } from '../../components/ui/IsoBadge';
import { LiquidCard } from '../../components/ui/LiquidCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { LessonPageSkeleton } from '../../components/skeletons/LessonPageSkeleton';
import { LessonAttachmentsSection } from '../attachments/components/LessonAttachmentsSection';
import { LessonExercisesSection } from '../exercises/components/LessonExercisesSection';
import { LessonPlayer } from '../player/components/LessonPlayer';
import { getCourseBySlug } from '../courses/courses.service';
import { useAuthStore } from '../../core/store/authStore';
import { useLessonAttachments } from '../attachments/useLessonAttachments';
import { useLessonExercises } from '../exercises/useLessonExercises';
import { completeLesson, getMyProgress, updateLessonNotes } from '../progress/progress.service';
import { getLessonById } from './lessons.service';
import { LessonNavigationCard } from './components/LessonNavigationCard';
import { LessonStudyPanel } from './components/LessonStudyPanel';
import { ModuleLessonsList } from './components/ModuleLessonsList';

type LessonTab = 'content' | 'attachments' | 'exercises' | 'notes';

export function LessonPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id, courseSlug, lessonSlug } = useParams();
  const token = useAuthStore((state) => state.token);

  const [activeTab, setActiveTab] = useState<LessonTab>('content');
  const [notesByLesson, setNotesByLesson] = useState<Record<string, string>>({});
  const [notesSavedAtByLesson, setNotesSavedAtByLesson] = useState<Record<string, number>>({});
  const [notesSavedValueByLesson, setNotesSavedValueByLesson] = useState<Record<string, string>>({});
  const [notesToast, setNotesToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { data: routeCourse, isLoading: isLoadingRouteCourse } = useQuery({
    queryKey: ['course-details', courseSlug],
    queryFn: () => getCourseBySlug(courseSlug!),
    enabled: !id && !!courseSlug,
  });

  const resolvedLessonId = useMemo(() => {
    if (id) {
      return id;
    }

    if (!routeCourse || !lessonSlug) {
      return undefined;
    }

    return routeCourse.modulos
      .flatMap((module) => module.aulas)
      .find((lessonItem) => lessonItem.slug === lessonSlug)?.id;
  }, [id, lessonSlug, routeCourse]);

  const {
    data: lesson,
    isLoading,
    isError,
    error: lessonQueryError,
  } = useQuery({
    queryKey: ['lesson', resolvedLessonId],
    queryFn: () => getLessonById(resolvedLessonId!),
    enabled: !!resolvedLessonId,
  });

  const { data: course } = useQuery({
    queryKey: ['course-details', lesson?.modulo.curso.slug],
    queryFn: () => getCourseBySlug(lesson!.modulo.curso.slug),
    enabled: !!lesson?.modulo.curso.slug,
  });

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: getMyProgress,
    enabled: !!token,
  });

  const studyFeaturesEnabled = !!token && !lesson?.locked;
  const { data: exercises = [] } = useLessonExercises(resolvedLessonId, studyFeaturesEnabled);
  const { data: attachments = [] } = useLessonAttachments(resolvedLessonId, studyFeaturesEnabled);

  const completeLessonMutation = useMutation({
    mutationFn: () => completeLesson(resolvedLessonId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const updateLessonNotesMutation = useMutation({
    mutationFn: (payload: { lessonId: string; notas: string }) =>
      updateLessonNotes(payload.lessonId, payload.notas),
    onSuccess: (_data, variables) => {
      setNotesSavedAtByLesson((previous) => ({
        ...previous,
        [variables.lessonId]: Date.now(),
      }));
      setNotesSavedValueByLesson((previous) => ({
        ...previous,
        [variables.lessonId]: variables.notas,
      }));
      setNotesToast({
        type: 'success',
        message: 'Notas salvas com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
    onError: () => {
      setNotesToast({
        type: 'error',
        message: 'Falha ao salvar notas. Tente novamente.',
      });
    },
  });

  const currentProgress = useMemo(
    () => (lesson ? progress?.find((item) => item.aulaId === lesson.id) : undefined),
    [lesson, progress],
  );

  const notesValue = lesson ? notesByLesson[lesson.id] ?? currentProgress?.notas ?? '' : '';
  const savedNotesValue = lesson
    ? notesSavedValueByLesson[lesson.id] ?? currentProgress?.notas ?? ''
    : '';
  const hasUnsavedNotes = !!lesson && notesValue !== savedNotesValue;

  useEffect(() => {
    if (!lesson) {
      return;
    }

    if (activeTab !== 'notes') {
      return;
    }

    const localNotes = notesByLesson[lesson.id];
    if (localNotes === undefined) {
      return;
    }

    const lastSavedValue = notesSavedValueByLesson[lesson.id];
    if (localNotes === lastSavedValue) {
      return;
    }

    if (updateLessonNotesMutation.isPending) {
      return;
    }

    const timeout = setTimeout(() => {
      updateLessonNotesMutation.mutate({
        lessonId: lesson.id,
        notas: localNotes,
      });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [
    activeTab,
    lesson,
    notesByLesson,
    notesSavedValueByLesson,
    updateLessonNotesMutation,
  ]);

  useEffect(() => {
    if (!notesToast) {
      return;
    }

    const timeout = setTimeout(() => {
      setNotesToast(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [notesToast]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedNotes) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedNotes]);

  if (isLoading || isLoadingRouteCourse) {
    return <LessonPageSkeleton />;
  }

  if (!id && courseSlug && lessonSlug && routeCourse && !resolvedLessonId) {
    return (
      <LiquidCard>
        <p className="font-semibold text-red-400">Aula não encontrada neste curso.</p>
      </LiquidCard>
    );
  }

  if (isError || !lesson) {
    const isPremiumAccessError =
      lessonQueryError instanceof AxiosError &&
      lessonQueryError.response?.status === 403;

    if (isPremiumAccessError) {
      return (
        <LiquidCard className="mx-auto max-w-3xl rounded-2xl p-6 sm:p-8">
          <IsoBadge variant="orange">Acesso premium</IsoBadge>
          <h1 className="mt-4 text-2xl font-black text-[var(--text)] sm:text-3xl">
            Esta aula está bloqueada
          </h1>
          <p className="mt-4 leading-8 text-[var(--text-soft)]">
            Esta aula faz parte de um curso premium. Faça a matrícula ou acesse com uma assinatura ativa para continuar estudando.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="iso-button-primary mt-6 px-5"
          >
            Voltar
          </button>
        </LiquidCard>
      );
    }

    return (
      <LiquidCard>
        <p className="font-semibold text-red-400">Não foi possível carregar a aula.</p>
      </LiquidCard>
    );
  }

  const courseUrl = `/courses/${lesson.modulo.curso.slug}`;
  const registrationUrl = `/register?next=${encodeURIComponent(courseUrl)}`;
  const loginUrl = `/login?next=${encodeURIComponent(courseUrl)}`;

  if (lesson.locked) {
    return (
      <section className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <LiquidCard className="rounded-xl p-5 sm:p-7">
          <IsoBadge variant="orange">
            <LockKeyhole className="mr-1 h-3.5 w-3.5" />
            Aula premium
          </IsoBadge>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
            {lesson.modulo.curso.titulo}
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
            {lesson.titulo}
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--text-soft)]">
            Esta aula faz parte do acesso premium. O conteúdo completo e o vídeo ficam disponíveis após a matrícula no curso.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(courseUrl)}
              className="iso-button-primary gap-2 px-5"
            >
              <LockKeyhole className="h-4 w-4" />
              Ver acesso ao curso
            </button>
            {!token && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(registrationUrl)}
                  className="iso-button-soft gap-2 px-5"
                >
                  <UserPlus className="h-4 w-4" />
                  Criar conta
                </button>
                <button
                  type="button"
                  onClick={() => navigate(loginUrl)}
                  className="iso-button-soft gap-2 px-5"
                >
                  <LogIn className="h-4 w-4" />
                  Entrar
                </button>
              </>
            )}
          </div>
        </LiquidCard>

        <LiquidCard className="rounded-xl p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            O que libera
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--text-soft)]">
            <p>Vídeo e conteúdo completo da aula.</p>
            <p>Anexos, exercícios e anotações do estudo.</p>
            <p>Progresso salvo dentro da trilha.</p>
          </div>
        </LiquidCard>
      </section>
    );
  }

  const isCompleted = progress?.some((item) => item.aulaId === lesson.id && item.concluida);
  const isPublicPreview = !token;
  const currentModule = course?.modulos.find((module) => module.id === lesson.modulo.id);
  const moduleLessons = currentModule?.aulas ?? [];
  const currentLessonIndex = moduleLessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = currentLessonIndex > 0 ? moduleLessons[currentLessonIndex - 1] : undefined;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < moduleLessons.length - 1
      ? moduleLessons[currentLessonIndex + 1]
      : undefined;

  const notesSavedAt = notesSavedAtByLesson[lesson.id];
  const lessonUrl = (targetLesson: { id: string; slug: string }) =>
    course ? `/courses/${course.slug}/lessons/${targetLesson.slug}` : `/lessons/${targetLesson.id}`;

  const navigateToLessonById = (lessonId: string) => {
    const targetLesson = moduleLessons.find((item) => item.id === lessonId);
    navigateWithUnsavedGuard(targetLesson ? lessonUrl(targetLesson) : `/lessons/${lessonId}`);
  };

  const navigateWithUnsavedGuard = (to: string) => {
    if (!hasUnsavedNotes) {
      navigate(to);
      return;
    }

    const confirmed = window.confirm(
      'Você tem notas não salvas. Deseja sair mesmo assim?',
    );

    if (confirmed) {
      navigate(to);
    }
  };

  return (
    <section className="w-full">
      <button
        type="button"
        onClick={() => navigateWithUnsavedGuard(`/courses/${lesson.modulo.curso.slug}`)}
        className="iso-button-soft mb-5 gap-2 px-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para a disciplina
      </button>

      <LiquidCard className="relative overflow-hidden rounded-xl p-4 sm:p-5">
        <div className="relative z-10 max-w-5xl">
          <div className="mb-5 inline-flex items-center gap-2">
            <IsoBadge>
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Aula técnica | ISOMETRICA
            </IsoBadge>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
            {lesson.modulo.curso.titulo}
          </p>

          <h1 className="mt-4 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
            {lesson.titulo}
          </h1>

          {lesson.descricao && (
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--text-soft)]">
              {lesson.descricao}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <IsoBadge>Engenharia</IsoBadge>
            <IsoBadge variant="orange">Exercícios integrados</IsoBadge>
            <IsoBadge variant="success">Materiais técnicos</IsoBadge>
            {isCompleted && (
              <IsoBadge variant="success">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Aula concluída
              </IsoBadge>
            )}
          </div>
        </div>
      </LiquidCard>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div>
          <LessonPlayer
            lessonId={lesson.id}
            videoUrl={lesson.videoUrl}
            title={lesson.titulo}
            initialTime={currentProgress?.tempoAssistido ?? 0}
            trackProgress={!isPublicPreview}
          />

          <LiquidCard className="mt-4 rounded-xl p-4 sm:p-5">
            <div className="mb-5 flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
              <TabButton
                active={activeTab === 'content'}
                icon={<BookText className="h-4 w-4" />}
                label="Conteúdo"
                onClick={() => setActiveTab('content')}
              />
              {!isPublicPreview && (
                <>
                  <TabButton
                    active={activeTab === 'attachments'}
                icon={<Paperclip className="h-4 w-4" />}
                label={`Anexos (${attachments.length})`}
                onClick={() => setActiveTab('attachments')}
              />
              <TabButton
                active={activeTab === 'exercises'}
                icon={<ClipboardCheck className="h-4 w-4" />}
                label={`Exercícios (${exercises.length})`}
                onClick={() => setActiveTab('exercises')}
              />
                  <TabButton
                    active={activeTab === 'notes'}
                icon={<FileText className="h-4 w-4" />}
                label="Notas"
                onClick={() => setActiveTab('notes')}
                  />
                </>
              )}
            </div>

            {activeTab === 'content' && (
              <>
                <SectionHeader
                  eyebrow="Conteúdo da aula"
                  title="Desenvolvimento técnico"
                  description="Estude o conteúdo base da aula antes de avançar para materiais e exercícios."
                />
                {lesson.conteudo ? (
                  <div className="max-w-none whitespace-pre-line text-sm leading-7 text-[var(--text-soft)] sm:text-base">
                    {lesson.conteudo}
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)]">Nenhum conteúdo textual disponível.</p>
                )}
                {isPublicPreview && (
                  <div className="mt-6 flex flex-col gap-3 rounded-lg border border-[var(--accent-border)] bg-[var(--iso-primary-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-2xl text-sm leading-6 text-[var(--text-soft)]">
                      Esta é uma prévia gratuita. Crie sua conta para salvar progresso, usar anexos, exercícios e notas.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(registrationUrl)}
                      className="iso-button-primary shrink-0 gap-2 px-4"
                    >
                      <UserPlus className="h-4 w-4" />
                      Criar conta
                    </button>
                  </div>
                )}
              </>
            )}

            {!isPublicPreview && activeTab === 'attachments' && (
              <LessonAttachmentsSection attachments={attachments} />
            )}

            {!isPublicPreview && activeTab === 'exercises' && (
              <LessonExercisesSection lessonId={lesson.id} exercises={exercises} />
            )}

            {!isPublicPreview && activeTab === 'notes' && (
              <div>
                {notesToast && (
                  <div
                    className={[
                      'mb-4 flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm',
                      notesToast.type === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-red-500/30 bg-red-500/10 text-red-300',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2">
                      {notesToast.type === 'success' ? (
                        <CircleCheck className="h-4 w-4" />
                      ) : (
                        <CircleX className="h-4 w-4" />
                      )}
                      <span>{notesToast.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotesToast(null)}
                      className="opacity-80 transition hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <SectionHeader
                  eyebrow="Anotações"
                  title="Seu caderno técnico"
                  description="Salve hipóteses, fórmulas e decisões para revisão."
                />
                <textarea
                  value={notesValue}
                  onChange={(event) =>
                    setNotesByLesson((previous) => ({
                      ...previous,
                      [lesson.id]: event.target.value,
                    }))
                  }
                  placeholder="Escreva suas notas desta aula..."
                  className="min-h-44 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 leading-7 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)] focus:ring-4 focus:ring-[rgba(0,168,204,0.12)]"
                />
                <div className="mt-4 flex justify-end">
                  <p className="mr-auto self-center text-xs font-semibold text-[var(--text-muted)]">
                    {updateLessonNotesMutation.isPending
                      ? 'Salvando automaticamente...'
                      : hasUnsavedNotes
                        ? 'Alterações não salvas'
                      : notesSavedAt
                        ? `Salvo às ${new Date(notesSavedAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`
                        : 'Sem salvamento nesta sessão'}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      updateLessonNotesMutation.mutate({
                        lessonId: lesson.id,
                        notas: notesValue,
                      })
                    }
                    disabled={updateLessonNotesMutation.isPending}
                    className="iso-button-primary gap-2 px-5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {updateLessonNotesMutation.isPending ? 'Salvando...' : 'Salvar agora'}
                  </button>
                </div>
              </div>
            )}
          </LiquidCard>
        </div>

        <aside className="space-y-4">
          {isPublicPreview ? (
            <LiquidCard className="rounded-xl p-5">
              <IsoBadge variant="success">Prévia aberta</IsoBadge>
              <h2 className="mt-4 text-lg font-semibold text-[var(--text)]">
                Continue pelo curso
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                Veja a grade completa, os valores e as próximas aulas na página da disciplina.
              </p>
              <button
                type="button"
                onClick={() => navigate(courseUrl)}
                className="iso-button-primary mt-5 w-full px-4"
              >
                Voltar ao curso
              </button>
            </LiquidCard>
          ) : (
            <>
              <LessonStudyPanel
                duration={lesson.duracao}
                isFree={lesson.isGratuita}
                isCompleted={!!isCompleted}
                attachmentsCount={attachments.length}
                exercisesCount={exercises.length}
                isCompleting={completeLessonMutation.isPending}
                onComplete={() => completeLessonMutation.mutate()}
              />

              <ModuleLessonsList
                currentLessonId={lesson.id}
                lessons={moduleLessons}
                progress={progress}
                onNavigateLesson={navigateToLessonById}
              />

              <LessonNavigationCard
                previousLesson={previousLesson}
                nextLesson={nextLesson}
                onNavigateLesson={navigateToLessonById}
              />
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex min-h-9 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition',
        active
          ? 'border-[var(--iso-primary)] bg-[var(--iso-primary-soft)] text-[var(--iso-primary)]'
          : 'border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:text-[var(--text)]',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}
