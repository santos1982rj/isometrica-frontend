export type LessonAttachment = {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number | null;
  aulaId: string;
  createdAt: string;
};

export type LessonAttachmentsResponse = {
  attachments: LessonAttachment[];
};