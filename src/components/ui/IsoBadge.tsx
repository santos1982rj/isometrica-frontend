import type { ReactNode } from 'react';

type IsoBadgeVariant = 'cyan' | 'orange' | 'success';

type IsoBadgeProps = {
  children: ReactNode;
  variant?: IsoBadgeVariant;
  className?: string;
};

/**
 * Badge semântico padrão da ISOMÉTRICA.
 */
export function IsoBadge({
  children,
  variant = 'cyan',
  className = '',
}: IsoBadgeProps) {
  const variantClass = {
    cyan: 'iso-badge-cyan',
    orange: 'iso-badge-orange',
    success: 'iso-badge-success',
  }[variant];

  return (
    <span
      className={[
        variantClass,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}