import type { ReactNode } from 'react';

type StatBlockProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
};

/**
 * Bloco numérico para métricas acadêmicas.
 */
export function StatBlock({
  label,
  value,
  helper,
  icon,
}: StatBlockProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">
          {label}
        </p>

        {icon && (
          <div className="text-[var(--iso-primary)]">
            {icon}
          </div>
        )}
      </div>

      <strong className="numeric mt-3 block text-2xl font-semibold text-[var(--text)]">
        {value}
      </strong>

      {helper && (
        <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
          {helper}
        </p>
      )}
    </div>
  );
}
