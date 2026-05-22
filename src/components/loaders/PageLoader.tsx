export function PageLoader() {
  return (
    <section className="w-full space-y-4" aria-label="Carregando pagina">
      <div className="animate-pulse overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <div className="h-6 w-32 rounded-md bg-[var(--surface-soft)]" />
        <div className="mt-4 h-9 max-w-3xl rounded-md bg-[var(--surface-soft)]" />
        <div className="mt-3 h-4 max-w-2xl rounded-md bg-[var(--surface-soft)]" />
        <div className="mt-2 h-4 max-w-xl rounded-md bg-[var(--surface-soft)]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5"
          >
            <div className="h-36 rounded-lg bg-[var(--surface-soft)]" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-24 rounded-md bg-[var(--surface-soft)]" />
              <div className="h-6 w-20 rounded-md bg-[var(--surface-soft)]" />
            </div>
            <div className="mt-4 h-6 w-4/5 rounded-md bg-[var(--surface-soft)]" />
            <div className="mt-3 h-4 rounded-md bg-[var(--surface-soft)]" />
            <div className="mt-2 h-4 w-5/6 rounded-md bg-[var(--surface-soft)]" />
          </div>
        ))}
      </div>
    </section>
  );
}
