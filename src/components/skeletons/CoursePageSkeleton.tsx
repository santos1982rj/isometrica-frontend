import { CardSkeleton } from './CardSkeleton';

export function CoursePageSkeleton() {
  return (
    <section className="w-full space-y-4" aria-label="Carregando curso">
      <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <div className="h-6 w-36 rounded-md bg-[var(--surface-soft)]" />
        <div className="mt-4 h-9 w-3/4 rounded-md bg-[var(--surface-soft)]" />
        <div className="mt-3 h-4 rounded-md bg-[var(--surface-soft)]" />
        <div className="mt-2 h-4 w-5/6 rounded-md bg-[var(--surface-soft)]" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </section>
  );
}
