import { CheckCircle2, Clock3, FileText, Lock, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';

type LessonStudyPanelProps = {
  duration: number | null;
  isFree: boolean;
  isCompleted: boolean;
  attachmentsCount: number;
  exercisesCount: number;
  isCompleting: boolean;
  onComplete: () => void;
};

export function LessonStudyPanel({
  duration,
  isFree,
  isCompleted,
  attachmentsCount,
  exercisesCount,
  isCompleting,
  onComplete,
}: LessonStudyPanelProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5">
      <div className="border-b border-[var(--border)] pb-4">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Painel de estudo</p>
        <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Resumo da aula</h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <PanelCell icon={<Clock3 className="h-4 w-4" />} label="Duração" value={`${duration ?? 0} min`} />
        <PanelCell icon={<Lock className="h-4 w-4" />} label="Acesso" value={isFree ? 'Gratuita' : 'Premium'} />
        <PanelCell icon={<FileText className="h-4 w-4" />} label="Materiais" value={attachmentsCount} />
        <PanelCell icon={<Trophy className="h-4 w-4" />} label="Exercícios" value={exercisesCount} />
      </div>

      <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className={isCompleted ? 'h-4 w-4 text-[var(--success-500)]' : 'h-4 w-4 text-[var(--text-muted)]'} />
          <p className="text-sm font-semibold text-[var(--text)]">{isCompleted ? 'Aula concluída' : 'Em andamento'}</p>
        </div>
        <p className="mt-2 text-sm leading-5 text-[var(--text-muted)]">
          {isCompleted ? 'Siga para a próxima etapa ou revise os exercícios.' : 'Conclua a aula quando terminar o estudo e a prática.'}
        </p>
      </div>

      <button
        type="button"
        disabled={isCompleted || isCompleting}
        onClick={onComplete}
        className="iso-button-primary mt-4 w-full gap-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CheckCircle2 className="h-4 w-4" />
        {isCompleted ? 'Aula concluída' : isCompleting ? 'Salvando...' : 'Marcar como concluída'}
      </button>
    </section>
  );
}

function PanelCell({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-2.5">
      <span className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span className="text-[var(--iso-primary)]">{icon}</span>
        {label}
      </span>
      <strong className="numeric mt-2 block truncate text-sm font-semibold text-[var(--text)]">{value}</strong>
    </div>
  );
}
