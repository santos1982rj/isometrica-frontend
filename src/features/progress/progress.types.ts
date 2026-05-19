export type LessonProgress = {
  id: string;
  aulaId: string;
  concluida: boolean;
  tempoAssistido: number | null;
  concluidaEm: string | null;
  aula: {
    id: string;
    titulo: string;
    slug: string;
    modulo: {
      id: string;
      titulo: string;
      curso: {
        id: string;
        titulo: string;
        slug: string;
      };
    };
  };
};

export type ProgressResponse = {
  progress: LessonProgress[];
};

export type CompleteLessonResponse = {
  progress: LessonProgress;
};