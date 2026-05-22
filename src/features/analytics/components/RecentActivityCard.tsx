import { ArrowRight, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react';

type Activity = {
  id: string;
  title: string;
  type: 'lesson' | 'exercise' | 'course';
  time: string;
};

type RecentActivityCardProps = {
  activities: Activity[];
};

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'lesson':
        return <PlayCircle className="h-4 w-4" />;
      case 'exercise':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Historico recente</p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">Atividade acadêmica</h3>
        </div>
        <span className="rounded-md bg-[var(--iso-primary-soft)] px-2 py-1 text-xs font-semibold text-[var(--iso-primary)]">agora</span>
      </div>
      <div className="mt-3 space-y-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[var(--surface)] text-[var(--iso-primary)]">
              {getIcon(activity.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--text)]">{activity.title}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase text-[var(--text-muted)]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
