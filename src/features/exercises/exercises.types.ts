/**
 * Última tentativa registrada pelo aluno em um exercício.
 */
export type ExerciseAttempt = {
  id: string;
  userId: string;
  exercicioId: string;
  resposta: string | null;
  correta: boolean;
  xpGanho: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Exercício vinculado a uma aula.
 */
export type Exercise = {
  id: string;
  titulo: string;
  enunciado: string;
  dificuldade: string;
  xpRecompensa: number;
  createdAt: string;
  resolvido: boolean;
  ultimaTentativa: ExerciseAttempt | null;
};

/**
 * Resposta da listagem de exercícios por aula.
 */
export type LessonExercisesResponse = {
  exercises: Exercise[];
};

/**
 * Payload para registrar tentativa.
 */
export type AttemptExerciseRequest = {
  resposta: string;
  correta: boolean;
};

/**
 * Resposta do backend ao registrar tentativa.
 */
export type AttemptExerciseResponse = {
  attempt: ExerciseAttempt;
};