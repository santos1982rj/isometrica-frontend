export type CourseLevel = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
export type CourseStatus = 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';

export type TeacherLesson = {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  conteudo: string | null;
  videoUrl: string | null;
  duracao: number | null;
  ordem: number;
  isGratuita: boolean;
};

export type TeacherModule = {
  id: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
  aulas: TeacherLesson[];
};

export type TeacherCourse = {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  resumo: string | null;
  imagem: string | null;
  beneficios: string | null;
  publicoAlvo: string | null;
  isPremium: boolean;
  preco: number | null;
  status: CourseStatus;
  publico: boolean;
  cargaHoraria: number | null;
  nivel: CourseLevel;
  categoria: string | null;
  modulos: TeacherModule[];
};

export type TeacherCoursesResponse = {
  courses: TeacherCourse[];
};

export type CourseManagementInput = {
  titulo: string;
  slug: string;
  descricao: string;
  resumo: string | null;
  imagem: string | null;
  beneficios: string | null;
  publicoAlvo: string | null;
  isPremium: boolean;
  preco: number | null;
  status: CourseStatus;
  cargaHoraria: number | null;
  nivel: CourseLevel;
  categoria: string | null;
};

export type ModuleManagementInput = {
  titulo: string;
  descricao: string | null;
  ordem: number;
};

export type LessonManagementInput = {
  titulo: string;
  slug: string;
  descricao: string | null;
  conteudo: string | null;
  videoUrl: string | null;
  duracao: number | null;
  ordem: number;
  isGratuita: boolean;
};

export type ExerciseManagementInput = {
  titulo: string;
  enunciado: string;
  resolucao: string | null;
  dificuldade: string;
  xpRecompensa: number;
};

export type TeacherKpis = {
  overview: {
    courses: number;
    modules: number;
    lessons: number;
    enrollments: number;
  };
  engagement: {
    activeStudents: number;
    periodDays: 7 | 30 | 90;
    avgEnrollmentProgress: number;
    activeStudentsDelta: number;
  };
  learning: {
    lessonCompletionRate: number;
    exerciseAccuracyRate: number;
    attemptsTotal: number;
    lessonCompletionRateDelta: number;
    exerciseAccuracyRateDelta: number;
  };
  dropoffLessons: Array<{
    lessonId: string;
    lessonTitle: string;
    moduleTitle: string;
    courseTitle: string;
    started: number;
    completed: number;
    dropoff: number;
    completionRate: number;
  }>;
};
