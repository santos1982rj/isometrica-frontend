import { ArrowRight, BookOpen, ClipboardCheck, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    title: 'Trilha',
    description: 'Saiba o que estudar agora e o que vem depois.',
    icon: BookOpen,
  },
  {
    title: 'Prática',
    description: 'Resolva, anote e consolide o raciocínio.',
    icon: ClipboardCheck,
  },
  {
    title: 'Progresso',
    description: 'Retome com clareza e acompanhe sua evolução.',
    icon: LineChart,
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--text)]">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex min-h-20 w-full max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--iso-primary)] text-base font-black">
              I
            </span>
            <span className="text-sm font-black tracking-[0.08em]">ISOMÉTRICA</span>
          </Link>

          <Link className="iso-button-soft min-h-10 border-white/20 bg-black/30 px-4 text-sm text-white hover:bg-black/45" to="/login">
            Entrar
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1480px] px-4 pb-5 pt-4 sm:px-6 lg:px-8">
        <div className="relative isolate min-h-[clamp(40rem,100svh,56rem)] overflow-hidden rounded-xl border border-[var(--border)]">
          <img className="absolute inset-0 h-full w-full object-cover" src="/landing-hero-engineering-study.jpg" alt="" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,15,0.96)_0%,rgba(5,10,15,0.82)_42%,rgba(5,10,15,0.28)_76%,rgba(5,10,15,0.5)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,15,0.12)_0%,rgba(5,10,15,0.18)_60%,rgba(5,10,15,0.9)_100%)]" />

          <div className="relative flex min-h-[clamp(40rem,100svh,56rem)] items-center px-5 pb-16 pt-28 sm:px-8 lg:px-14">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-[var(--secondary-200)]">Estudo para engenharia</p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.04] text-white sm:text-6xl lg:text-7xl">
                Pare de estudar sem saber se está avançando.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-100 sm:text-lg">
                A ISOMÉTRICA organiza aulas, prática e progresso para quem precisa aprender engenharia com mais direção.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="iso-button-primary gap-2 px-6" to="/register">
                  Começar minha trilha
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className="iso-button-soft border-white/20 bg-black/30 px-6 text-white hover:bg-black/45" to="/courses">
                  Ver disciplinas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">O problema</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl">
            Engenharia não falta conteúdo. Falta continuidade.
          </h2>
        </div>
        <div className="max-w-2xl text-base leading-8 text-[var(--text-soft)] sm:text-lg">
          <p>
            Vídeo solto, lista aberta em outra aba e anotação perdida fazem o estudo parecer movimento sem progresso.
          </p>
          <p className="mt-5">
            A ISOMÉTRICA junta o estudo em uma trilha clara: você aprende, pratica e sabe onde retomar.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="border-y border-[var(--border)] py-10 sm:py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title}>
                  <Icon className="h-5 w-5 text-[var(--iso-primary)]" />
                  <h2 className="mt-5 text-2xl font-semibold text-[var(--text)]">{pillar.title}</h2>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--text-muted)]">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Por dentro</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl">
              Um ambiente para continuar, não recomeçar toda vez.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-soft)]">
              Dashboard, aulas, exercícios, notas e ferramentas técnicas foram pensados para reduzir a fricção entre entender uma ideia e praticá-la.
            </p>
            <Link className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--iso-primary)]" to="/login">
              Entrar na plataforma
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ProductFrame />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-10 text-center shadow-sm shadow-black/5 sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">ISOMÉTRICA</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
            Estude engenharia com um caminho mais claro.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--text-soft)]">
            Comece por uma disciplina e transforme tempo de estudo em progresso que você consegue retomar.
          </p>
          <Link className="iso-button-primary mx-auto mt-8 gap-2 px-6" to="/register">
            Começar agora
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function ProductFrame() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/20">
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--iso-primary)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--success-500)]" />
      </div>
      <div className="grid gap-3 p-4 sm:p-5">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Próxima aula</p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">Retome de onde parou.</h3>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface)]">
            <div className="h-full w-[68%] rounded-full bg-[var(--iso-primary)]" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_0.72fr]">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Ritmo semanal</p>
            <div className="mt-4 grid grid-cols-7 items-end gap-1.5">
              {[28, 52, 40, 76, 48, 84, 58].map((height, index) => (
                <span key={`${height}-${index}`} className="flex h-20 items-end rounded-sm bg-[var(--surface)] p-1">
                  <span className="w-full rounded-sm bg-[var(--iso-primary)]" style={{ height: `${height}%` }} />
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {['Notas', 'Exercícios', 'Progresso'].map((item) => (
              <div key={item} className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm font-semibold text-[var(--text-soft)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
