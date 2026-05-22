import { CheckCircle2 } from 'lucide-react';

import { IsoBadge } from '../../../components/ui/IsoBadge';
import { LiquidCard } from '../../../components/ui/LiquidCard';

/**
 * Card institucional com o princípio pedagógico da ISOMÉTRICA.
 */
export function PrincipleCard() {
  return (
    <LiquidCard className="lg:col-span-2">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[rgba(56,178,172,0.12)] text-[var(--success-700)] dark:text-[var(--success-500)]">
        <CheckCircle2 className="h-6 w-6" />
      </div>

      <IsoBadge variant="success">
        Princípio pedagógico
      </IsoBadge>

      <h3 className="mt-4 text-2xl font-black tracking-tight text-[var(--text)]">
        IA como monitor técnico
      </h3>

      <p className="mt-4 max-w-4xl leading-7 text-[var(--text-soft)]">
        A plataforma não existe para entregar respostas prontas. Ela existe para
        ajudar o estudante a entender conceitos, validar raciocínios, corrigir
        erros e desenvolver maturidade técnica durante a graduação.
      </p>

      <span className="iso-icon-ghost">✓</span>
    </LiquidCard>
  );
}