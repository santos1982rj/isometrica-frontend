export type StudentAnalytics = {
  xpTotal: number;
  nivel: number;
  streak: number;
  aulasConcluidas: number;
  cursosEmAndamento: number;
  cursosConcluidos: number;
  tempoTotalEstudo: number;
};

export type StudentAnalyticsResponse = {
  analytics: StudentAnalytics;
};

export type WeeklyAnalyticsDay = {
  data: string;
  xpGanho: number;
  exercicios: number;
  calculos: number;
};

export type WeeklyAnalyticsResponse = {
  weekly: WeeklyAnalyticsDay[];
};