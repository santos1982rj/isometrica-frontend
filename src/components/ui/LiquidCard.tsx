import type { ReactNode } from 'react';

type LiquidCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Card base com Liquid Glass da ISOMÉTRICA.
 *
 * Use em dashboards, aulas, cursos, painéis e blocos premium.
 */
export function LiquidCard({
  children,
  className = '',
}: LiquidCardProps) {
  return (
    <article
      className={[
        'liquid-glass rounded-xl p-6',
        className,
      ].join(' ')}
    >
      {children}
    </article>
  );
}
