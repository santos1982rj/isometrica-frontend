import {
  ArrowRight,
  Flame,
  Trophy,
} from 'lucide-react';

import { IsoBadge } from '../../../components/ui/IsoBadge';
import { IsoButton } from '../../../components/ui/IsoButton';
import { LiquidCard } from '../../../components/ui/LiquidCard';
import { StatBlock } from '../../../components/ui/StatBlock';

type AnalyticsHeroProps = {
  xp: number;
  streak: number;
  level: number;
};

/**
 * Hero principal do dashboard acadêmico.
 */
export function AnalyticsHero({
  xp,
  streak,
  level,
}: AnalyticsHeroProps) {
  return (
    <LiquidCard className="overflow-hidden rounded-[2rem] p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <IsoBadge>
            Engenharia acadêmica
          </IsoBadge>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold text-[var(--text)] lg:text-6xl">
            Aprendizado técnico, progresso real e prática contínua.
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--text-soft)] lg:text-lg">
            Acompanhe sua evolução em disciplinas de engenharia, valide
            raciocínios e avance com consistência acadêmica.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <IsoButton>
              Continuar estudos
              <ArrowRight className="h-4 w-4" />
            </IsoButton>

            <IsoButton variant="soft">
              Ver disciplinas
            </IsoButton>
          </div>
        </div>

        <div className="grid gap-4">
          <StatBlock
            label="XP total"
            value={xp}
            helper="Experiência acadêmica acumulada."
            icon={<Trophy className="h-4 w-4" />}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <StatBlock
              label="Streak"
              value={streak}
              helper="dias"
              icon={<Flame className="h-4 w-4 text-[var(--accent-500)]" />}
            />

            <StatBlock
              label="Nível"
              value={level}
              helper="progressão"
              icon={<Trophy className="h-4 w-4 text-[var(--success-500)]" />}
            />
          </div>
        </div>
      </div>

      <span className="iso-icon-ghost text-[10rem]">∑</span>
    </LiquidCard>
  );
}
