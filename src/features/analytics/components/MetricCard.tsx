import type { ReactNode } from 'react';

import { LiquidCard } from '../../../components/ui/LiquidCard';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
};

/**
 * Card reutilizável para métricas acadêmicas.
 */
export function MetricCard({
  title,
  value,
  icon,
  description,
}: MetricCardProps) {
  return (
    <LiquidCard>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--secondary-700)] dark:text-[var(--secondary-300)]">
        {icon}
      </div>

      <p className="text-sm font-medium text-[var(--text-muted)]">
        {title}
      </p>

      <strong className="iso-stat-number mt-2 block text-4xl font-black text-[var(--text)]">
        {value}
      </strong>

      {description && (
        <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
          {description}
        </p>
      )}

      <span className="iso-icon-ghost">∑</span>
    </LiquidCard>
  );
}