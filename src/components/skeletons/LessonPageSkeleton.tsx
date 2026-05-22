import { CardSkeleton } from './CardSkeleton';

export function LessonPageSkeleton() {
  return (
    <section className="w-full space-y-4" aria-label="Carregando aula">
      <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
        <div className="h-6 w-36 rounded-md bg-[var(--surface-soft)]" />
        <div className="mt-4 h-9 w-2/3 rounded-md bg-[var(--surface-soft)]" />
        <div className="mt-3 h-4 w-5/6 rounded-md bg-[var(--surface-soft)]" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-4">
          <div className="aspect-video animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]" />
          <CardSkeleton />
        </div>
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </section>
  );
}
