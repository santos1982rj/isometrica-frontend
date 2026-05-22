import { Link } from 'react-router-dom';

import type { ReactNode } from 'react';

export function LegalPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-8 text-[var(--text)] sm:px-6 sm:py-12">
      <article className="mx-auto max-w-4xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
        <Link className="text-sm font-semibold text-[var(--iso-primary)]" to="/">
          ISOMÉTRICA
        </Link>
        <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--text-soft)]">
          {subtitle}
        </p>
        <div className="legal-copy mt-8 space-y-6 text-[var(--text-soft)]">
          {children}
        </div>
      </article>
    </main>
  );
}
