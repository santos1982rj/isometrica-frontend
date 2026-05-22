import { Flame } from 'lucide-react';

type StudyStreakCardProps = {
  streak: number;
};

export function StudyStreakCard({ streak }: StudyStreakCardProps) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Sequencia</p>
          <strong className="numeric mt-3 block text-3xl font-semibold text-[var(--text)]">{streak}</strong>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--accent-bg)] text-[var(--accent)]">
          <Flame className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm text-[var(--text-muted)]">dias consecutivos de estudo</p>
    </article>
  );
}
