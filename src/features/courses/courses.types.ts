export type Course = {
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
  cargaHoraria: number | null;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  categoria: string | null;
  totalModulos: number;
  isEnrolled: boolean;
  enrollment: CourseEnrollment | null;
  createdAt: string;
};

export interface CoursesResponse {
  courses: Course[];
}

export type Lesson = {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  duracao: number | null;
  ordem: number;
  isGratuita: boolean;
};

export type Module = {
  id: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
  aulas: Lesson[];
};

export type CourseDetails = {
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
  cargaHoraria: number | null;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  categoria: string | null;
  isEnrolled: boolean;
  enrollment: CourseEnrollment | null;
  createdAt: string;
  modulos: Module[];
};

export interface CourseDetailsResponse {
  course: CourseDetails;
}

export type CourseEnrollment = {
  id: string;
  tipoAcesso: 'GRATUITO' | 'COMPRA_AVULSA' | 'ASSINATURA_ATIVA';
  progresso: number;
  concluido: boolean;
};

export type EnrollCourseResponse = {
  enrollment: CourseEnrollment;
};

export type MyCourseEnrollment = CourseEnrollment & {
  createdAt: string;
  curso: Omit<Course, 'createdAt' | 'totalModulos' | 'isEnrolled' | 'enrollment'> & {
    modulos: { id: string }[];
  };
};

export type MyCoursesResponse = {
  enrollments: MyCourseEnrollment[];
};
