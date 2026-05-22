import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

type IsoButtonVariant = 'primary' | 'accent' | 'soft';

type IsoButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: IsoButtonVariant;
  };

/**
 * Botão visual padrão da ISOMÉTRICA.
 */
export function IsoButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: IsoButtonProps) {
  const variantClass = {
    primary: 'iso-button-primary',
    accent: 'iso-button-accent',
    soft: 'iso-button-soft',
  }[variant];

  return (
    <button
      type="button"
      className={[
        variantClass,
        'gap-2 px-5',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}