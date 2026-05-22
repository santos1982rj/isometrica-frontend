export type LessonDetails = {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  conteudo: string | null;
  videoUrl: string | null;
  duracao: number | null;
  ordem: number;
  isGratuita: boolean;
  locked: boolean;
  modulo: {
    id: string;
    titulo: string;
    curso: {
      id: string;
      titulo: string;
      slug: string;
      isPremium: boolean;
    };
  };
};

export type LessonResponse = {
  lesson: LessonDetails;
};
