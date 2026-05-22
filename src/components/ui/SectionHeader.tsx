import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

/**
 * Cabeçalho visual reutilizável para seções da ISOMÉTRICA.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-2 text-xl font-semibold text-[var(--text)] sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-soft)]">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}
