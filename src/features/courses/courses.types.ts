export type Course = {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  resumo: string | null;
  imagem: string | null;
  isPremium: boolean;
  preco: number | null;
  cargaHoraria: number | null;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  categoria: string | null;
  totalModulos: number;
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
  isPremium: boolean;
  preco: number | null;
  cargaHoraria: number | null;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  categoria: string | null;
  createdAt: string;
  modulos: Module[];
};

export interface CourseDetailsResponse {
  course: CourseDetails;
}