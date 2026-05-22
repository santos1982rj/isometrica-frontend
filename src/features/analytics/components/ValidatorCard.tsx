import { Calculator } from 'lucide-react';

import { LiquidCard } from '../../../components/ui/LiquidCard';

/**
 * Card de entrada para ferramentas de validação técnica.
 */
export function ValidatorCard() {
  return (
    <LiquidCard className="lg:col-span-2">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(0,168,204,0.12)] text-[var(--secondary-700)] dark:text-[var(--secondary-300)]">
        <Calculator className="h-6 w-6" />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Ferramenta técnica
      </p>

      <h3 className="mt-3 text-2xl font-black tracking-tight text-[var(--text)]">
        Validador de cálculo
      </h3>

      <p className="mt-4 leading-7 text-[var(--text-soft)]">
        Confira unidades, hipóteses, fórmulas e resultados antes de confiar no
        seu dimensionamento.
      </p>

      <span className="iso-icon-ghost">π</span>
    </LiquidCard>
  );
}