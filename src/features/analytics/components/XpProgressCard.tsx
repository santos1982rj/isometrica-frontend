type XpProgressCardProps = {
  xp: number;
};

export function XpProgressCard({ xp }: XpProgressCardProps) {
  const nextLevelXp = 1000;
  const percentage = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
      <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Evolução acadêmica</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">XP total</h3>
          <strong className="numeric mt-2 block text-3xl font-semibold text-[var(--text)]">{xp}</strong>
        </div>
        <span className="numeric text-sm font-semibold text-[var(--iso-primary)]">{Math.round(percentage)}%</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
        <div className="h-full rounded-full bg-[var(--iso-primary)]" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-3 text-sm text-[var(--text-muted)]">progresso para o proximo nivel</p>
    </article>
  );
}
