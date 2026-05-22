import { LiquidCard } from '../../../components/ui/LiquidCard';
import { IsoBadge } from '../../../components/ui/IsoBadge';

type WeeklyHeatmapProps = {
  values: number[];
};

/**
 * Heatmap semanal de atividade acadêmica.
 */
export function WeeklyHeatmap({
  values,
}: WeeklyHeatmapProps) {
  return (
    <LiquidCard className="lg:col-span-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Ritmo acadêmico
          </p>

          <h3 className="mt-3 text-2xl font-black tracking-tight text-[var(--text)]">
            Heatmap semanal
          </h3>

          <p className="mt-3 max-w-2xl leading-7 text-[var(--text-soft)]">
            Visualize sua consistência de estudos durante a semana. Pequenos
            avanços contínuos geram resultados duradouros.
          </p>
        </div>

        <IsoBadge variant="success">
          consistência ativa
        </IsoBadge>
      </div>

      <div className="mt-10 grid grid-cols-7 gap-3">
        {values.map((value, index) => {
          const intensity =
            value >= 80
              ? 'bg-[rgba(56,178,172,0.28)]'
              : value >= 50
                ? 'bg-[rgba(0,168,204,0.22)]'
                : value >= 20
                  ? 'bg-[rgba(244,121,32,0.18)]'
                  : 'bg-[var(--surface-soft)]';

          return (
            <div
              key={`${index}-${value}`}
              className={[
                'relative h-24 overflow-hidden rounded-3xl border border-[var(--border)] transition hover:scale-[1.02]',
                intensity,
              ].join(' ')}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent)]" />

              <div className="absolute bottom-4 left-4">
                <strong className="iso-stat-number text-xl font-black text-[var(--text)]">
                  {value}
                </strong>

                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  XP
                </p>
              </div>

              <span className="iso-icon-ghost text-5xl">▦</span>
            </div>
          );
        })}
      </div>
    </LiquidCard>
  );
}