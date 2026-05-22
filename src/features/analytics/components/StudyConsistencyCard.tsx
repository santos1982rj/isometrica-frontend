const cells = [
  'bg-[var(--iso-primary-soft)]',
  'bg-[rgba(56,178,172,0.16)]',
  'bg-[var(--accent-bg)]',
  'bg-[rgba(56,178,172,0.24)]',
  'bg-[var(--iso-primary-soft)]',
];

export function StudyConsistencyCard() {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
      <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Consistencia</p>
      <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">Ritmo saudavel</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        Frequencia constante melhora a retomada entre aulas, materiais e pratica.
      </p>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {cells.map((cell, index) => (
          <div key={`${cell}-${index}`} className={`h-12 rounded-md border border-[var(--border)] ${cell}`} />
        ))}
      </div>
    </article>
  );
}
