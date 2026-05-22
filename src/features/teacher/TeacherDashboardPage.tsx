import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Brain,
  BookOpen,
  Eye,
  Target,
  Paperclip,
  Trash2,
  Layers3,
  Pencil,
  Plus,
  Video,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { IsoBadge } from '../../components/ui/IsoBadge';
import { IsoButton } from '../../components/ui/IsoButton';
import { LiquidCard } from '../../components/ui/LiquidCard';

import {
  createTeacherCourse,
  createTeacherExercise,
  createTeacherLesson,
  createTeacherModule,
  deleteTeacherCourse,
  deleteTeacherLesson,
  deleteTeacherModule,
  getTeacherKpis,
  listTeacherCourses,
  updateTeacherCourse,
  updateTeacherLesson,
  updateTeacherModule,
  uploadTeacherAttachment,
} from './teacher.service';

import type {
  CourseLevel,
  CourseStatus,
  CourseManagementInput,
  ExerciseManagementInput,
  LessonManagementInput,
  ModuleManagementInput,
  TeacherCourse,
  TeacherLesson,
  TeacherModule,
} from './teacher.types';
import type { ReactNode } from 'react';
import { useLessonExercises } from '../exercises/useLessonExercises';
import { useLessonAttachments } from '../attachments/useLessonAttachments';

const initialCourseForm: CourseManagementInput = {
  titulo: '',
  slug: '',
  descricao: '',
  resumo: '',
  imagem: null,
  isPremium: true,
  preco: null,
  status: 'RASCUNHO',
  cargaHoraria: null,
  nivel: 'INICIANTE',
  categoria: '',
};

const initialModuleForm: ModuleManagementInput = {
  titulo: '',
  descricao: '',
  ordem: 1,
};

const initialLessonForm: LessonManagementInput = {
  titulo: '',
  slug: '',
  descricao: '',
  conteudo: '',
  videoUrl: '',
  duracao: null,
  ordem: 1,
  isGratuita: false,
};

const initialExerciseForm: ExerciseManagementInput = {
  titulo: '',
  enunciado: '',
  resolucao: '',
  dificuldade: 'Média',
  xpRecompensa: 10,
};

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeCourseForm(form: CourseManagementInput) {
  return {
    ...form,
    resumo: form.resumo || null,
    imagem: form.imagem || null,
    categoria: form.categoria || null,
  };
}

function normalizeModuleForm(form: ModuleManagementInput) {
  return {
    ...form,
    descricao: form.descricao || null,
  };
}

function normalizeLessonForm(form: LessonManagementInput) {
  return {
    ...form,
    descricao: form.descricao || null,
    conteudo: form.conteudo || null,
    videoUrl: form.videoUrl || null,
  };
}

function courseToForm(course: TeacherCourse): CourseManagementInput {
  return {
    titulo: course.titulo,
    slug: course.slug,
    descricao: course.descricao,
    resumo: course.resumo ?? '',
    imagem: course.imagem,
    isPremium: course.isPremium,
    preco: course.preco,
    status: course.status,
    cargaHoraria: course.cargaHoraria,
    nivel: course.nivel,
    categoria: course.categoria ?? '',
  };
}

function moduleToForm(module: TeacherModule): ModuleManagementInput {
  return {
    titulo: module.titulo,
    descricao: module.descricao ?? '',
    ordem: module.ordem,
  };
}

function lessonToForm(lesson: TeacherLesson): LessonManagementInput {
  return {
    titulo: lesson.titulo,
    slug: lesson.slug,
    descricao: lesson.descricao ?? '',
    conteudo: lesson.conteudo ?? '',
    videoUrl: lesson.videoUrl ?? '',
    duracao: lesson.duracao,
    ordem: lesson.ordem,
    isGratuita: lesson.isGratuita,
  };
}

function getEditorStatus(
  dirty: boolean,
  pending: boolean,
) {
  if (pending) {
    return {
      label: 'Salvando...',
      className:
        'border-[var(--iso-primary)]/30 bg-[var(--iso-primary-soft)] text-[var(--iso-primary)]',
    };
  }

  if (dirty) {
    return {
      label: 'Alterações não salvas',
      className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    };
  }

  return {
    label: 'Sem pendências',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  };
}

export function TeacherDashboardPage() {
  const queryClient = useQueryClient();
  const [kpiPeriodDays, setKpiPeriodDays] = useState<7 | 30 | 90>(30);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['teacher', 'courses'],
    queryFn: listTeacherCourses,
  });
  const {
    data: kpis,
    isLoading: isLoadingKpis,
    isError: isErrorKpis,
  } = useQuery({
    queryKey: ['teacher', 'kpis', kpiPeriodDays],
    queryFn: () => getTeacherKpis(kpiPeriodDays),
  });

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [editingCourseId, setEditingCourseId] = useState('');
  const [editingModuleId, setEditingModuleId] = useState('');
  const [editingLessonId, setEditingLessonId] = useState('');
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [moduleForm, setModuleForm] = useState(initialModuleForm);
  const [lessonForm, setLessonForm] = useState(initialLessonForm);
  const [exerciseForm, setExerciseForm] = useState(initialExerciseForm);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isCourseDirty, setIsCourseDirty] = useState(false);
  const [isModuleDirty, setIsModuleDirty] = useState(false);
  const [isLessonDirty, setIsLessonDirty] = useState(false);
  const [isExerciseDirty, setIsExerciseDirty] = useState(false);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId),
    [courses, selectedCourseId],
  );

  const selectedModule = useMemo(
    () =>
      selectedCourse?.modulos.find(
        (module) => module.id === selectedModuleId,
      ),
    [selectedCourse, selectedModuleId],
  );

  const { data: lessonExercises = [] } =
    useLessonExercises(selectedLessonId || undefined);

  const { data: lessonAttachments = [] } =
    useLessonAttachments(selectedLessonId || undefined);

  const invalidateCourses = () =>
    queryClient.invalidateQueries({
      queryKey: ['teacher', 'courses'],
    });

  const createCourseMutation = useMutation({
    mutationFn: createTeacherCourse,
    onSuccess: async () => {
      setIsCourseDirty(false);
      resetCourseForm(true);
      await invalidateCourses();
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (data: CourseManagementInput) =>
      updateTeacherCourse(editingCourseId, data),
    onSuccess: async () => {
      setIsCourseDirty(false);
      resetCourseForm(true);
      await invalidateCourses();
    },
  });

  const createModuleMutation = useMutation({
    mutationFn: (data: ModuleManagementInput) =>
      createTeacherModule(selectedCourseId, data),
    onSuccess: async () => {
      setIsModuleDirty(false);
      resetModuleForm((selectedCourse?.modulos.length ?? 0) + 2, true);
      await invalidateCourses();
    },
  });

  const updateModuleMutation = useMutation({
    mutationFn: (data: ModuleManagementInput) =>
      updateTeacherModule(editingModuleId, data),
    onSuccess: async () => {
      setIsModuleDirty(false);
      resetModuleForm((selectedCourse?.modulos.length ?? 0) + 1, true);
      await invalidateCourses();
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: (data: LessonManagementInput) =>
      createTeacherLesson(selectedModuleId, data),
    onSuccess: async () => {
      setIsLessonDirty(false);
      resetLessonForm((selectedModule?.aulas.length ?? 0) + 2, true);
      await invalidateCourses();
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: (data: LessonManagementInput) =>
      updateTeacherLesson(editingLessonId, data),
    onSuccess: async () => {
      setIsLessonDirty(false);
      resetLessonForm((selectedModule?.aulas.length ?? 0) + 1, true);
      await invalidateCourses();
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteTeacherCourse,
    onSuccess: async () => {
      if (editingCourseId) {
        resetCourseForm(true);
      }
      setSelectedCourseId('');
      setSelectedModuleId('');
      setSelectedLessonId('');
      await invalidateCourses();
    },
  });

  const deleteModuleMutation = useMutation({
    mutationFn: deleteTeacherModule,
    onSuccess: async () => {
      resetModuleForm(1, true);
      setSelectedModuleId('');
      setSelectedLessonId('');
      await invalidateCourses();
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: deleteTeacherLesson,
    onSuccess: async () => {
      resetLessonForm(1, true);
      await invalidateCourses();
    },
  });

  const reorderModuleMutation = useMutation({
    mutationFn: async ({
      currentModule,
      targetModule,
    }: {
      currentModule: TeacherModule;
      targetModule: TeacherModule;
    }) => {
      await Promise.all([
        updateTeacherModule(
          currentModule.id,
          normalizeModuleForm({
            ...moduleToForm(currentModule),
            ordem: targetModule.ordem,
          }),
        ),
        updateTeacherModule(
          targetModule.id,
          normalizeModuleForm({
            ...moduleToForm(targetModule),
            ordem: currentModule.ordem,
          }),
        ),
      ]);
    },
    onSuccess: async () => {
      await invalidateCourses();
    },
  });

  const reorderLessonMutation = useMutation({
    mutationFn: async ({
      currentLesson,
      targetLesson,
    }: {
      currentLesson: TeacherLesson;
      targetLesson: TeacherLesson;
    }) => {
      await Promise.all([
        updateTeacherLesson(
          currentLesson.id,
          normalizeLessonForm({
            ...lessonToForm(currentLesson),
            ordem: targetLesson.ordem,
          }),
        ),
        updateTeacherLesson(
          targetLesson.id,
          normalizeLessonForm({
            ...lessonToForm(targetLesson),
            ordem: currentLesson.ordem,
          }),
        ),
      ]);
    },
    onSuccess: async () => {
      await invalidateCourses();
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: (data: ExerciseManagementInput) =>
      createTeacherExercise(selectedLessonId, data),
    onSuccess: async () => {
      setExerciseForm(initialExerciseForm);
      setIsExerciseDirty(false);
      await queryClient.invalidateQueries({
        queryKey: ['lesson-exercises', selectedLessonId],
      });
    },
  });

  const uploadAttachmentMutation = useMutation({
    mutationFn: (file: File) =>
      uploadTeacherAttachment(selectedLessonId, file),
    onSuccess: async () => {
      setAttachmentFile(null);
      await queryClient.invalidateQueries({
        queryKey: ['lesson-attachments', selectedLessonId],
      });
    },
  });

  function confirmDiscard(label: string) {
    return window.confirm(
      `Existem alterações não salvas em ${label}. Deseja descartar e continuar?`,
    );
  }

  function canSwitchTeacherContext() {
    if (isCourseDirty && !confirmDiscard('curso')) {
      return false;
    }
    if (isModuleDirty && !confirmDiscard('módulo')) {
      return false;
    }
    if (isLessonDirty && !confirmDiscard('aula')) {
      return false;
    }
    if (isExerciseDirty && !confirmDiscard('exercício')) {
      return false;
    }

    return true;
  }

  function resetCourseForm(force = false) {
    if (!force && isCourseDirty && !confirmDiscard('curso')) {
      return;
    }
    setEditingCourseId('');
    setCourseForm(initialCourseForm);
    setIsCourseDirty(false);
  }

  function resetModuleForm(ordem = 1, force = false) {
    if (!force && isModuleDirty && !confirmDiscard('módulo')) {
      return;
    }
    setEditingModuleId('');
    setModuleForm({
      ...initialModuleForm,
      ordem,
    });
    setIsModuleDirty(false);
  }

  function resetLessonForm(ordem = 1, force = false) {
    if (!force && isLessonDirty && !confirmDiscard('aula')) {
      return;
    }
    setEditingLessonId('');
    setSelectedLessonId('');
    setLessonForm({
      ...initialLessonForm,
      ordem,
    });
    setIsLessonDirty(false);
  }

  function handleCourseTitleChange(value: string) {
    setIsCourseDirty(true);
    setCourseForm((current) => ({
      ...current,
      titulo: value,
      slug: current.slug ? current.slug : slugify(value),
    }));
  }

  function handleLessonTitleChange(value: string) {
    setIsLessonDirty(true);
    setLessonForm((current) => ({
      ...current,
      titulo: value,
      slug: current.slug ? current.slug : slugify(value),
    }));
  }

  function selectCourse(courseId: string) {
    if (!canSwitchTeacherContext()) {
      return;
    }

    const nextCourse = courses.find((course) => course.id === courseId);

    setSelectedCourseId(courseId);
    setSelectedModuleId('');
    setSelectedLessonId('');
    setEditingModuleId('');
    setEditingLessonId('');
    setExerciseForm(initialExerciseForm);
    setIsExerciseDirty(false);
    resetModuleForm((nextCourse?.modulos.length ?? 0) + 1, true);
    resetLessonForm(1, true);
  }

  function selectModule(moduleId: string) {
    if (!canSwitchTeacherContext()) {
      return;
    }

    const nextModule = selectedCourse?.modulos.find(
      (module) => module.id === moduleId,
    );

    setSelectedModuleId(moduleId);
    setSelectedLessonId('');
    setEditingLessonId('');
    setExerciseForm(initialExerciseForm);
    setIsExerciseDirty(false);
    resetLessonForm((nextModule?.aulas.length ?? 0) + 1, true);
  }

  function startCourseEdit(course: TeacherCourse) {
    if (!canSwitchTeacherContext()) {
      return;
    }

    setEditingCourseId(course.id);
    setSelectedCourseId(course.id);
    setCourseForm(courseToForm(course));
    setIsCourseDirty(false);
  }

  function startModuleEdit(module: TeacherModule) {
    if (!canSwitchTeacherContext()) {
      return;
    }

    setEditingModuleId(module.id);
    setSelectedModuleId(module.id);
    setModuleForm(moduleToForm(module));
    setIsModuleDirty(false);
  }

  function startLessonEdit(lesson: TeacherLesson) {
    if (!canSwitchTeacherContext()) {
      return;
    }

    setEditingLessonId(lesson.id);
    setSelectedLessonId(lesson.id);
    setLessonForm(lessonToForm(lesson));
    setIsLessonDirty(false);
    setExerciseForm(initialExerciseForm);
    setIsExerciseDirty(false);
  }

  function handleDeleteCourse(courseId: string) {
    const confirmed = window.confirm(
      'Excluir este curso? Todos os módulos e aulas serão removidos.',
    );

    if (!confirmed) {
      return;
    }

    deleteCourseMutation.mutate(courseId);
  }

  function handleDeleteModule(moduleId: string) {
    const confirmed = window.confirm(
      'Excluir este módulo? Todas as aulas deste módulo serão removidas.',
    );

    if (!confirmed) {
      return;
    }

    deleteModuleMutation.mutate(moduleId);
  }

  function handleDeleteLesson(lessonId: string) {
    const confirmed = window.confirm(
      'Excluir esta aula? Esta ação não pode ser desfeita.',
    );

    if (!confirmed) {
      return;
    }

    deleteLessonMutation.mutate(lessonId);
  }

  function handleMoveModule(
    course: TeacherCourse,
    moduleIndex: number,
    direction: 'up' | 'down',
  ) {
    const currentModule = course.modulos[moduleIndex];
    const targetIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1;
    const targetModule = course.modulos[targetIndex];

    if (!currentModule || !targetModule) {
      return;
    }

    reorderModuleMutation.mutate({
      currentModule,
      targetModule,
    });
  }

  function handleMoveLesson(
    module: TeacherModule,
    lessonIndex: number,
    direction: 'up' | 'down',
  ) {
    const currentLesson = module.aulas[lessonIndex];
    const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    const targetLesson = module.aulas[targetIndex];

    if (!currentLesson || !targetLesson) {
      return;
    }

    reorderLessonMutation.mutate({
      currentLesson,
      targetLesson,
    });
  }

  return (
    <section className="space-y-6">
      <LiquidCard className="rounded-[2rem] p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <IsoBadge>Área do professor</IsoBadge>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)]">
              Gestão de cursos, módulos e aulas
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-[var(--text-soft)]">
              Crie e edite a estrutura acadêmica que alimenta a plataforma dos
              alunos. Admin vê tudo; professor gerencia apenas os próprios
              cursos.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat icon={<BookOpen />} label="Cursos" value={courses.length} />
            <Stat
              icon={<Layers3 />}
              label="Módulos"
              value={courses.reduce(
                (total, course) => total + course.modulos.length,
                0,
              )}
            />
            <Stat
              icon={<Video />}
              label="Aulas"
              value={courses.reduce(
                (total, course) =>
                  total +
                  course.modulos.reduce(
                    (sum, module) => sum + module.aulas.length,
                    0,
                  ),
                0,
              )}
            />
          </div>
        </div>
      </LiquidCard>

      <LiquidCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[var(--text)]">
              KPIs da turma
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Engajamento, aprendizagem e risco de abandono das aulas.
            </p>
          </div>
          <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Período
            <select
              value={kpiPeriodDays}
              onChange={(event) =>
                setKpiPeriodDays(Number(event.target.value) as 7 | 30 | 90)
              }
              className="h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
            >
              <option value={7}>Últimos 7 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={90}>Últimos 90 dias</option>
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            icon={<Target />}
            label={`Ativos ${kpis?.engagement.periodDays ?? kpiPeriodDays}d`}
            value={kpis?.engagement.activeStudents ?? 0}
            trend={kpis?.engagement.activeStudentsDelta ?? 0}
          />
          <Stat
            icon={<Brain />}
            label="Conclusão aulas"
            value={kpis ? kpis.learning.lessonCompletionRate : 0}
            suffix="%"
            trend={kpis?.learning.lessonCompletionRateDelta ?? 0}
          />
          <Stat
            icon={<Target />}
            label="Acerto exercícios"
            value={kpis ? kpis.learning.exerciseAccuracyRate : 0}
            suffix="%"
            trend={kpis?.learning.exerciseAccuracyRateDelta ?? 0}
          />
        </div>

        {isLoadingKpis && (
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Carregando indicadores...
          </p>
        )}

        {isErrorKpis && (
          <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            Não foi possível carregar os KPIs agora.
          </p>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Visão geral
            </h3>
            <div className="mt-4 grid gap-2 text-sm text-[var(--text-soft)]">
              <p>
                Matrículas: <strong className="text-[var(--text)]">{kpis?.overview.enrollments ?? 0}</strong>
              </p>
              <p>
                Progresso médio: <strong className="text-[var(--text)]">{kpis?.engagement.avgEnrollmentProgress ?? 0}%</strong>
              </p>
              <p>
                Tentativas em exercícios: <strong className="text-[var(--text)]">{kpis?.learning.attemptsTotal ?? 0}</strong>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              <AlertTriangle className="h-4 w-4 text-[var(--accent-500)]" />
              Aulas com maior abandono
            </h3>

            <div className="mt-4 space-y-2">
              {(kpis?.dropoffLessons ?? []).length === 0 && (
                <p className="text-sm text-[var(--text-muted)]">
                  Ainda sem dados suficientes de progresso.
                </p>
              )}

              {(kpis?.dropoffLessons ?? []).map((lesson) => (
                <div
                  key={lesson.lessonId}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-2"
                >
                  <p className="truncate text-sm font-semibold text-[var(--text)]">
                    {lesson.lessonTitle}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {lesson.courseTitle} • {lesson.moduleTitle}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">
                    Iniciaram: {lesson.started} | Concluíram: {lesson.completed} | Abandono: {lesson.dropoff}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LiquidCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <LiquidCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-[var(--text)]">
                {editingCourseId ? 'Editar curso' : 'Novo curso'}
              </h2>
              <p
                className={[
                  'mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold',
                  getEditorStatus(
                    isCourseDirty,
                    createCourseMutation.isPending || updateCourseMutation.isPending,
                  ).className,
                ].join(' ')}
              >
                {
                  getEditorStatus(
                    isCourseDirty,
                    createCourseMutation.isPending || updateCourseMutation.isPending,
                  ).label
                }
              </p>
            </div>

            {editingCourseId && (
              <IsoButton variant="soft" onClick={() => resetCourseForm()}>
                <X className="h-4 w-4" />
                Cancelar
              </IsoButton>
            )}
          </div>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const payload = normalizeCourseForm(courseForm);

              if (editingCourseId) {
                updateCourseMutation.mutate(payload);
                return;
              }

              createCourseMutation.mutate(payload);
            }}
          >
            <TextInput
              label="Título"
              value={courseForm.titulo}
              onChange={handleCourseTitleChange}
            />

            <TextInput
              label="Slug"
              value={courseForm.slug}
              onChange={(value) => {
                setIsCourseDirty(true);
                setCourseForm((current) => ({
                  ...current,
                  slug: slugify(value),
                }));
              }}
            />

            <TextArea
              label="Descrição"
              value={courseForm.descricao}
              onChange={(value) => {
                setIsCourseDirty(true);
                setCourseForm((current) => ({
                  ...current,
                  descricao: value,
                }));
              }}
            />

            <TextInput
              label="Resumo curto"
              value={courseForm.resumo ?? ''}
              onChange={(value) => {
                setIsCourseDirty(true);
                setCourseForm((current) => ({
                  ...current,
                  resumo: value,
                }));
              }}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Categoria"
                value={courseForm.categoria ?? ''}
                onChange={(value) => {
                  setIsCourseDirty(true);
                  setCourseForm((current) => ({
                    ...current,
                    categoria: value,
                  }));
                }}
              />

              <SelectInput
                label="Nível"
                value={courseForm.nivel}
                onChange={(value) => {
                  setIsCourseDirty(true);
                  setCourseForm((current) => ({
                    ...current,
                    nivel: value as CourseLevel,
                  }));
                }}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput
                label="Carga horária"
                value={courseForm.cargaHoraria}
                onChange={(value) => {
                  setIsCourseDirty(true);
                  setCourseForm((current) => ({
                    ...current,
                    cargaHoraria: value,
                  }));
                }}
              />

              <NumberInput
                label="Preço"
                value={courseForm.preco}
                onChange={(value) => {
                  setIsCourseDirty(true);
                  setCourseForm((current) => ({
                    ...current,
                    preco: value,
                    isPremium: value !== null && value > 0,
                  }));
                }}
              />
            </div>

            <SelectStatusInput
              label="Status editorial"
              value={courseForm.status}
              onChange={(value) => {
                setIsCourseDirty(true);
                setCourseForm((current) => ({
                  ...current,
                  status: value as CourseStatus,
                }));
              }}
            />

            <IsoButton
              className="w-full"
              disabled={
                createCourseMutation.isPending ||
                updateCourseMutation.isPending
              }
              type="submit"
            >
              {editingCourseId ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {editingCourseId ? 'Salvar curso' : 'Criar curso'}
            </IsoButton>
          </form>
        </LiquidCard>

        <LiquidCard>
          <h2 className="text-2xl font-black text-[var(--text)]">
            Estrutura do conteúdo
          </h2>

          <div className="mt-6 grid gap-4">
            <SelectCourse
              courses={courses}
              value={selectedCourseId}
              loading={isLoading}
              onChange={selectCourse}
            />

            <form
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!selectedCourseId) {
                  return;
                }

                const payload = normalizeModuleForm(moduleForm);

                if (editingModuleId) {
                  updateModuleMutation.mutate(payload);
                  return;
                }

                createModuleMutation.mutate(payload);
              }}
            >
            <FormTitle
              title={editingModuleId ? 'Editar módulo' : 'Novo módulo'}
              status={getEditorStatus(
                isModuleDirty,
                createModuleMutation.isPending || updateModuleMutation.isPending,
              )}
              onCancel={editingModuleId ? () => resetModuleForm() : undefined}
            />

              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px]">
                <TextInput
                  label="Título"
                  value={moduleForm.titulo}
                  onChange={(value) => {
                    setIsModuleDirty(true);
                    setModuleForm((current) => ({
                      ...current,
                      titulo: value,
                    }));
                  }}
                />

                <NumberInput
                  label="Ordem"
                  value={moduleForm.ordem}
                  onChange={(value) => {
                    setIsModuleDirty(true);
                    setModuleForm((current) => ({
                      ...current,
                      ordem: value ?? 1,
                    }));
                  }}
                />
              </div>

              <TextInput
                label="Descrição"
                value={moduleForm.descricao ?? ''}
                onChange={(value) => {
                  setIsModuleDirty(true);
                  setModuleForm((current) => ({
                    ...current,
                    descricao: value,
                  }));
                }}
              />

              <IsoButton
                className="mt-4"
                disabled={
                  !selectedCourseId ||
                  createModuleMutation.isPending ||
                  updateModuleMutation.isPending
                }
                type="submit"
                variant="soft"
              >
                {editingModuleId ? 'Salvar módulo' : 'Criar módulo'}
              </IsoButton>

              {editingModuleId && (
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                  onClick={() => handleDeleteModule(editingModuleId)}
                  disabled={deleteModuleMutation.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deleteModuleMutation.isPending ? 'Excluindo...' : 'Excluir módulo'}
                </button>
              )}
            </form>

            <SelectModule
              modules={selectedCourse?.modulos ?? []}
              value={selectedModuleId}
              onChange={selectModule}
            />

            <SelectLesson
              lessons={selectedModule?.aulas ?? []}
              value={selectedLessonId}
              onChange={(lessonId) => {
                if (!canSwitchTeacherContext()) {
                  return;
                }

                const nextLesson = selectedModule?.aulas.find(
                  (lesson) => lesson.id === lessonId,
                );

                setSelectedLessonId(lessonId);

                if (nextLesson) {
                  startLessonEdit(nextLesson);
                }
              }}
            />

            <form
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!selectedModuleId) {
                  return;
                }

                const payload = normalizeLessonForm(lessonForm);

                if (editingLessonId) {
                  updateLessonMutation.mutate(payload);
                  return;
                }

                createLessonMutation.mutate(payload);
              }}
            >
              <FormTitle
                title={editingLessonId ? 'Editar aula' : 'Nova aula'}
                status={getEditorStatus(
                  isLessonDirty,
                  createLessonMutation.isPending || updateLessonMutation.isPending,
                )}
                onCancel={
                  editingLessonId ? () => resetLessonForm() : undefined
                }
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Título"
                  value={lessonForm.titulo}
                  onChange={handleLessonTitleChange}
                />

                <TextInput
                  label="Slug"
                  value={lessonForm.slug}
                  onChange={(value) => {
                    setIsLessonDirty(true);
                    setLessonForm((current) => ({
                      ...current,
                      slug: slugify(value),
                    }));
                  }}
                />
              </div>

              <TextInput
                label="URL do vídeo"
                value={lessonForm.videoUrl ?? ''}
                onChange={(value) => {
                  setIsLessonDirty(true);
                  setLessonForm((current) => ({
                    ...current,
                    videoUrl: value,
                  }));
                }}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Duração em minutos"
                  value={lessonForm.duracao}
                  onChange={(value) => {
                    setIsLessonDirty(true);
                    setLessonForm((current) => ({
                      ...current,
                      duracao: value,
                    }));
                  }}
                />

                <NumberInput
                  label="Ordem"
                  value={lessonForm.ordem}
                  onChange={(value) => {
                    setIsLessonDirty(true);
                    setLessonForm((current) => ({
                      ...current,
                      ordem: value ?? 1,
                    }));
                  }}
                />
              </div>

              <TextArea
                label="Conteúdo / roteiro"
                value={lessonForm.conteudo ?? ''}
                onChange={(value) => {
                  setIsLessonDirty(true);
                  setLessonForm((current) => ({
                    ...current,
                    conteudo: value,
                  }));
                }}
              />

              <label className="mt-3 flex items-center gap-3 text-sm font-semibold text-[var(--text-soft)]">
                <input
                  type="checkbox"
                  checked={lessonForm.isGratuita}
                  onChange={(event) => {
                    setIsLessonDirty(true);
                    setLessonForm((current) => ({
                      ...current,
                      isGratuita: event.target.checked,
                    }));
                  }}
                />
                Aula gratuita
              </label>

              <IsoButton
                className="mt-4"
                disabled={
                  !selectedModuleId ||
                  createLessonMutation.isPending ||
                  updateLessonMutation.isPending
                }
                type="submit"
                variant="soft"
              >
                {editingLessonId ? 'Salvar aula' : 'Criar aula'}
              </IsoButton>

              {editingLessonId && (
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                  onClick={() => handleDeleteLesson(editingLessonId)}
                  disabled={deleteLessonMutation.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deleteLessonMutation.isPending ? 'Excluindo...' : 'Excluir aula'}
                </button>
              )}
            </form>

            <form
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              onSubmit={(event) => {
                event.preventDefault();

                if (!selectedLessonId || !attachmentFile) {
                  return;
                }

                uploadAttachmentMutation.mutate(attachmentFile);
              }}
            >
              <FormTitle
                title="Anexos da aula"
                status={getEditorStatus(
                  !!attachmentFile,
                  uploadAttachmentMutation.isPending,
                )}
              />

              <label className="mt-4 grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
                Arquivo
                <input
                  type="file"
                  onChange={(event) =>
                    setAttachmentFile(event.target.files?.[0] ?? null)
                  }
                  className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text)]"
                />
              </label>

              <IsoButton
                className="mt-4"
                disabled={
                  !selectedLessonId ||
                  !attachmentFile ||
                  uploadAttachmentMutation.isPending
                }
                type="submit"
                variant="soft"
              >
                <Paperclip className="h-4 w-4" />
                {uploadAttachmentMutation.isPending
                  ? 'Enviando...'
                  : 'Enviar anexo'}
              </IsoButton>

              {lessonAttachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {lessonAttachments.slice(0, 4).map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-2"
                    >
                      <p className="truncate text-xs text-[var(--text-soft)]">
                        {attachment.nome}
                      </p>
                      <span className="text-[10px] uppercase text-[var(--text-muted)]">
                        {attachment.tipo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </form>

            <form
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              onSubmit={(event) => {
                event.preventDefault();

                if (!selectedLessonId) {
                  return;
                }

                createExerciseMutation.mutate({
                  ...exerciseForm,
                  resolucao: exerciseForm.resolucao || null,
                });
              }}
            >
              <FormTitle
                title="Exercícios da aula"
                status={getEditorStatus(
                  isExerciseDirty,
                  createExerciseMutation.isPending,
                )}
              />

              <div className="mt-4 grid gap-4">
                <TextInput
                  label="Título"
                  value={exerciseForm.titulo}
                  onChange={(value) => {
                    setIsExerciseDirty(true);
                    setExerciseForm((current) => ({
                      ...current,
                      titulo: value,
                    }));
                  }}
                />

                <TextArea
                  label="Enunciado"
                  value={exerciseForm.enunciado}
                  onChange={(value) => {
                    setIsExerciseDirty(true);
                    setExerciseForm((current) => ({
                      ...current,
                      enunciado: value,
                    }));
                  }}
                />

                <TextArea
                  label="Resolução (opcional)"
                  value={exerciseForm.resolucao ?? ''}
                  onChange={(value) => {
                    setIsExerciseDirty(true);
                    setExerciseForm((current) => ({
                      ...current,
                      resolucao: value,
                    }));
                  }}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Dificuldade"
                    value={exerciseForm.dificuldade}
                    onChange={(value) => {
                      setIsExerciseDirty(true);
                      setExerciseForm((current) => ({
                        ...current,
                        dificuldade: value,
                      }));
                    }}
                  />

                  <NumberInput
                    label="XP"
                    value={exerciseForm.xpRecompensa}
                    onChange={(value) => {
                      setIsExerciseDirty(true);
                      setExerciseForm((current) => ({
                        ...current,
                        xpRecompensa: value ?? 10,
                      }));
                    }}
                  />
                </div>
              </div>

              <IsoButton
                className="mt-4"
                disabled={!selectedLessonId || createExerciseMutation.isPending}
                type="submit"
                variant="soft"
              >
                <Plus className="h-4 w-4" />
                {createExerciseMutation.isPending
                  ? 'Criando...'
                  : 'Criar exercício'}
              </IsoButton>

              {lessonExercises.length > 0 && (
                <div className="mt-4 space-y-2">
                  {lessonExercises.slice(0, 4).map((exercise) => (
                    <div
                      key={exercise.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-2"
                    >
                      <p className="truncate text-xs font-semibold text-[var(--text)]">
                        {exercise.titulo}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                        {exercise.dificuldade} • {exercise.xpRecompensa} XP
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        </LiquidCard>
      </div>

      <LiquidCard>
        <h2 className="text-2xl font-black text-[var(--text)]">
          Cursos cadastrados
        </h2>

        <div className="mt-5 grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-black text-[var(--text)]">
                    {course.titulo}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-soft)]">
                    {course.descricao}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <IsoBadge
                    variant={
                      course.status === 'PUBLICADO'
                        ? 'success'
                        : 'orange'
                    }
                  >
                    {course.status === 'PUBLICADO'
                      ? 'Publicado'
                      : course.status === 'ARQUIVADO'
                        ? 'Arquivado'
                        : 'Rascunho'}
                  </IsoBadge>

                  <button
                    type="button"
                    onClick={() => startCourseEdit(course)}
                    className="iso-button-soft min-h-0 gap-2 px-3 py-2 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="inline-flex min-h-0 items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                    disabled={deleteCourseMutation.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--text-muted)]">
                <span>{course.modulos.length} módulos</span>
                <span>
                  {course.modulos.reduce(
                    (total, module) => total + module.aulas.length,
                    0,
                  )}{' '}
                  aulas
                </span>
                <span>{course.nivel}</span>
              </div>

              {course.modulos.length > 0 && (
                <div className="mt-4 grid gap-3">
                  {course.modulos.map((module, moduleIndex) => (
                    <div
                      key={module.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-[var(--text)]">
                            {module.ordem}. {module.titulo}
                          </p>
                          <p className="mt-1 text-xs text-[var(--text-muted)]">
                            {module.aulas.length} aulas
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleMoveModule(course, moduleIndex, 'up')}
                            disabled={moduleIndex === 0 || reorderModuleMutation.isPending}
                            className="iso-button-soft min-h-0 px-2 py-2 text-xs disabled:opacity-50"
                            title="Subir módulo"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveModule(course, moduleIndex, 'down')}
                            disabled={moduleIndex === course.modulos.length - 1 || reorderModuleMutation.isPending}
                            className="iso-button-soft min-h-0 px-2 py-2 text-xs disabled:opacity-50"
                            title="Descer módulo"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              startModuleEdit(module);
                            }}
                            className="iso-button-soft min-h-0 px-3 py-2 text-xs"
                          >
                            Editar
                          </button>
                        </div>
                      </div>

                      {module.aulas.length > 0 && (
                        <div className="mt-3 grid gap-2">
                          {module.aulas.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2"
                            >
                              <p className="truncate text-xs text-[var(--text-soft)]">
                                {lesson.ordem}. {lesson.titulo}
                              </p>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveLesson(module, lessonIndex, 'up')}
                                  disabled={lessonIndex === 0 || reorderLessonMutation.isPending}
                                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--text-soft)] disabled:opacity-50"
                                  title="Subir aula"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveLesson(module, lessonIndex, 'down')}
                                  disabled={lessonIndex === module.aulas.length - 1 || reorderLessonMutation.isPending}
                                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--text-soft)] disabled:opacity-50"
                                  title="Descer aula"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  className="text-[11px] font-semibold text-[var(--iso-primary)] hover:underline"
                                  onClick={() => {
                                    setSelectedCourseId(course.id);
                                    setSelectedModuleId(module.id);
                                    startLessonEdit(lesson);
                                  }}
                                >
                                  Editar aula
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-soft)] hover:text-[var(--text)]"
                                  onClick={() => window.open(`/lessons/${lesson.id}`, '_blank')}
                                  title="Visualizar como aluno"
                                >
                                  <Eye className="h-3 w-3" />
                                  Preview
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </LiquidCard>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  suffix = '',
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  suffix?: string;
  trend?: number;
}) {
  const hasTrend = typeof trend === 'number';
  const trendPositive = (trend ?? 0) > 0;
  const trendNeutral = (trend ?? 0) === 0;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <div className="mb-3 h-5 w-5 text-cyan-300">{icon}</div>
      <p className="text-2xl font-black text-[var(--text)]">
        {value}
        {suffix}
      </p>
      {hasTrend && (
        <p
          className={[
            'mt-1 text-xs font-semibold',
            trendNeutral
              ? 'text-[var(--text-muted)]'
              : trendPositive
                ? 'text-[var(--success-500)]'
                : 'text-[var(--accent-500)]',
          ].join(' ')}
        >
          {trendPositive ? '+' : ''}
          {trend}
          {suffix} vs período anterior
        </p>
      )}
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}

function FormTitle({
  title,
  status,
  onCancel,
}: {
  title: string;
  status?: {
    label: string;
    className: string;
  };
  onCancel?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-[var(--text)]">{title}</h3>
        {status && (
          <span
            className={[
              'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]',
              status.className,
            ].join(' ')}
          >
            {status.label}
          </span>
        )}
      </div>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
      {label}
      <input
        type="number"
        value={value ?? ''}
        onChange={(event) =>
          onChange(
            event.target.value ? Number(event.target.value) : null,
          )
        }
        className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CourseLevel;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
      >
        <option value="INICIANTE">Iniciante</option>
        <option value="INTERMEDIARIO">Intermediário</option>
        <option value="AVANCADO">Avançado</option>
      </select>
    </label>
  );
}

function SelectStatusInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CourseStatus;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
      >
        <option value="RASCUNHO">Rascunho</option>
        <option value="PUBLICADO">Publicado</option>
        <option value="ARQUIVADO">Arquivado</option>
      </select>
    </label>
  );
}

function SelectCourse({
  courses,
  value,
  loading,
  onChange,
}: {
  courses: { id: string; titulo: string }[];
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
      Curso
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
      >
        <option value="">
          {loading ? 'Carregando cursos...' : 'Selecione um curso'}
        </option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.titulo}
          </option>
        ))}
      </select>
    </label>
  );
}

function SelectModule({
  modules,
  value,
  onChange,
}: {
  modules: { id: string; titulo: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
      Módulo
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
      >
        <option value="">Selecione um módulo</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.titulo}
          </option>
        ))}
      </select>
    </label>
  );
}

function SelectLesson({
  lessons,
  value,
  onChange,
}: {
  lessons: { id: string; titulo: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--text-soft)]">
      Aula para editar
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-[var(--text)] outline-none transition focus:border-[var(--secondary-500)]"
      >
        <option value="">Criar nova aula</option>
        {lessons.map((lesson) => (
          <option key={lesson.id} value={lesson.id}>
            {lesson.titulo}
          </option>
        ))}
      </select>
    </label>
  );
}
