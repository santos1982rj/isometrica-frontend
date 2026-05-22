import { BookOpen, Clock3, Flame, Trophy } from 'lucide-react';

import { RecentActivityCard } from '../components/RecentActivityCard';
import { StudyConsistencyCard } from '../components/StudyConsistencyCard';
import { WeeklyPerformanceCard } from '../components/WeeklyPerformanceCard';
import { CoursesInProgressCard } from '../components/CoursesInProgressCard';
import { useAnalytics } from '../useAnalytics';
import { useWeeklyAnalytics } from '../useWeeklyAnalytics';

const recentActivities = [
  {
    id: 'lesson-continuity',
    title: 'Continue seus estudos pelo dashboard',
    type: 'lesson' as const,
    time: 'Agora',
  },
];

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours}h ${rest}min` : `${hours}h`;
}

export function AnalyticsPage() {
  const { data: analytics } = useAnalytics();
  const { data: weekly = [] } = useWeeklyAnalytics();
  const weeklyXp = weekly.reduce((total, day) => total + day.xpGanho, 0);
  const weeklyExercises = weekly.reduce((total, day) => total + day.exercicios, 0);

  return (
    <section className="w-full space-y-4">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Analytics acadêmico</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Seu comportamento de estudo</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Leitura objetiva do ritmo, do tempo investido e da continuidade das trilhas em andamento.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'XP total', value: analytics?.xpTotal ?? 0, icon: <Trophy className="h-4 w-4" /> },
          { label: 'Sequencia', value: `${analytics?.streak ?? 0} dias`, icon: <Flame className="h-4 w-4" /> },
          { label: 'Aulas', value: analytics?.aulasConcluidas ?? 0, icon: <BookOpen className="h-4 w-4" /> },
          { label: 'Tempo', value: formatMinutes(analytics?.tempoTotalEstudo ?? 0), icon: <Clock3 className="h-4 w-4" /> },
        ].map((item) => (
          <article key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">{item.label}</span>
              <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--surface-soft)] text-[var(--iso-primary)]">{item.icon}</span>
            </div>
            <strong className="numeric mt-4 block text-2xl font-semibold text-[var(--text)]">{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <WeeklyPerformanceCard weeklyXp={weeklyXp} weeklyExercises={weeklyExercises} />
        <CoursesInProgressCard total={analytics?.cursosEmAndamento ?? 0} />
        <RecentActivityCard activities={recentActivities} />
        <StudyConsistencyCard />
      </section>
    </section>
  );
}
