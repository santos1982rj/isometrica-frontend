import { Flame, Trophy } from 'lucide-react';

import { StatBlock } from '../../../components/ui/StatBlock';

type WeeklyPerformanceCardProps = {
  weeklyXp: number;
  weeklyExercises: number;
};

export function WeeklyPerformanceCard({ weeklyXp, weeklyExercises }: WeeklyPerformanceCardProps) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--accent-bg)] text-[var(--accent-500)]">
        <Flame className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Desempenho semanal</p>
      <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">Ritmo de estudo</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <StatBlock label="XP na semana" value={weeklyXp} icon={<Trophy className="h-4 w-4 text-[var(--accent-500)]" />} />
        <StatBlock label="Exercicios" value={weeklyExercises} icon={<Flame className="h-4 w-4 text-[var(--iso-primary)]" />} />
      </div>
    </article>
  );
}
