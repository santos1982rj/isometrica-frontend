import { Calculator, Hammer, Ruler } from 'lucide-react';

const tools = [
  {
    title: 'Validador de calculo',
    description: 'Confira unidades, hipoteses e consistencia numerica.',
    icon: Calculator,
  },
  {
    title: 'Dimensionamento estrutural',
    description: 'Base futura para vigas, lajes, sapatas e pilares.',
    icon: Hammer,
  },
  {
    title: 'Conversor técnico',
    description: 'Conversoes e verificacoes rapidas para engenharia.',
    icon: Ruler,
  },
];

export function ToolsPage() {
  return (
    <section className="w-full space-y-4">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Ferramentas técnicas</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Laboratorio de engenharia</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Utilitarios planejados para validar contas, converter grandezas e apoiar decisoes de estudo.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <article key={tool.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--surface-soft)] text-[var(--iso-primary)]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-[var(--text)]">{tool.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{tool.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
