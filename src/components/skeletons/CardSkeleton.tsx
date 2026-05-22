export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
      <div className="h-5 w-32 rounded-md bg-[var(--surface-soft)]" />
      <div className="mt-4 h-7 w-2/3 rounded-md bg-[var(--surface-soft)]" />
      <div className="mt-4 space-y-2">
        <div className="h-4 rounded-md bg-[var(--surface-soft)]" />
        <div className="h-4 w-5/6 rounded-md bg-[var(--surface-soft)]" />
        <div className="h-4 w-4/6 rounded-md bg-[var(--surface-soft)]" />
      </div>
    </div>
  );
}
