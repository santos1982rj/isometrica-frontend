export type AdminOverview = {
  users: {
    total: number;
    students: number;
    teachers: number;
    admins: number;
  };
  content: {
    courses: number;
    publicCourses: number;
    modules: number;
    lessons: number;
  };
  payments: {
    transactions: number;
    approved: number;
    pending: number;
    rejected: number;
    refunded: number;
    approvedRevenue: number;
  };
};

export type AdminUser = {
  id: string;
  nome: string;
  email: string;
  role: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
  xpTotal: number;
  nivel: number;
  hasActiveSub: boolean;
  subExpiresAt: string | null;
  createdAt: string;
};

export type AdminCourse = {
  id: string;
  titulo: string;
  slug: string;
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';
  publico: boolean;
  isPremium: boolean;
  preco: number | null;
  resumo: string | null;
  imagem: string | null;
  beneficios: string | null;
  publicoAlvo: string | null;
  nivel: string;
  categoria: string | null;
  criadoPor: {
    id: string;
    nome: string;
    email: string;
  } | null;
  modulos: {
    id: string;
    titulo: string;
    aulas: {
      id: string;
      titulo: string;
      conteudo: string | null;
      videoUrl: string | null;
      isGratuita: boolean;
    }[];
  }[];
  updatedAt: string;
};

export type UpdateAdminCourseStatusInput = {
  status: 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';
};

export type UpdateAdminCourseCommercialInput = {
  isPremium: boolean;
  preco: number | null;
};

export type UpdateAdminCourseSalesInput = {
  resumo: string;
  imagem: string;
  beneficios: string;
  publicoAlvo: string;
};

export type AdminTransaction = {
  id: string;
  mpPaymentId: string;
  valorTotal: number;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'ESTORNADO';
  metodoPagamento: string;
  referenciaCompra: string;
  linkPagamento: string | null;
  createdAt: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
};

export type AdminTrackingSettings = {
  googleTagManagerId: string | null;
  googleAnalyticsMeasurementId: string | null;
  metaPixelId: string | null;
  updatedAt: string | null;
};

export type UpdateAdminTrackingSettingsInput = {
  googleTagManagerId: string;
  googleAnalyticsMeasurementId: string;
  metaPixelId: string;
};
