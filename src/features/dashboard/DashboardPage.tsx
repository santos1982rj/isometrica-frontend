import {
  BookOpen,
  Calculator,
  CheckCircle2,
  Flame,
  Gauge,
  Target,
} from 'lucide-react';

const subjects = [
  'Cálculo Diferencial',
  'Resistência dos Materiais',
  'Fenômenos de Transporte',
];

import { useAuthStore } from '../../core/store/authStore';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm text-slate-400">
          Sistema web feito para estudantes, mas com rigor técnico de engenharia.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <article className="liquid-card rounded-3xl p-6 lg:col-span-2 lg:row-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Progresso geral
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-50">
                Semana de estudo
              </h2>
            </div>

            <Gauge className="h-8 w-8 text-cyan-300" />
          </div>

          <div className="numeric text-6xl font-bold text-slate-50">
            Nível {user?.nivel ?? 1}
          </div>

          <p className="mt-4 max-w-xl leading-7 text-slate-300">
            Você avançou bem, mas ainda precisa revisar conceitos-base antes de
            seguir para exercícios mais pesados.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-sm font-medium text-slate-100">{subject}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Revisão recomendada
                </p>
              </div>
            ))}
          </div>

          <div className="isometric-icon-layer text-8xl">∑</div>
        </article>

        <article className="liquid-card rounded-3xl p-6">
          <Flame className="mb-6 h-7 w-7 text-orange-400" />
          <p className="text-sm text-slate-400">Streak atual</p>
          <strong className="numeric mt-2 block text-4xl text-slate-50">
            {user?.streak ?? 0} dias
          </strong>
        </article>

        <article className="liquid-card rounded-3xl p-6">
          <Target className="mb-6 h-7 w-7 text-cyan-300" />
          <p className="text-sm text-slate-400">Meta semanal</p>
          <strong className="numeric mt-2 block text-4xl text-slate-50">
            7/10
          </strong>
        </article>

        <article className="liquid-card rounded-3xl p-6 lg:col-span-2">
          <Calculator className="mb-6 h-7 w-7 text-cyan-300" />
          <h3 className="text-xl font-semibold text-slate-50">
            Validador de cálculo
          </h3>
          <p className="mt-3 leading-7 text-slate-300">
            Confira unidades, hipóteses, fórmulas e resultados antes de confiar
            no seu dimensionamento.
          </p>
        </article>

        <article className="liquid-card rounded-3xl p-6 lg:col-span-2">
          <BookOpen className="mb-6 h-7 w-7 text-emerald-300" />
          <h3 className="text-xl font-semibold text-slate-50">
            Próxima revisão
          </h3>
          <p className="mt-3 leading-7 text-slate-300">
            Resistência dos Materiais: tensão normal, cisalhamento e diagrama de
            momento fletor.
          </p>
        </article>

        <article className="liquid-card rounded-3xl p-6 lg:col-span-4">
          <CheckCircle2 className="mb-6 h-7 w-7 text-emerald-300" />
          <h3 className="text-xl font-semibold text-slate-50">
            Princípio da ISOMÉTRICA
          </h3>
          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            A plataforma não existe para entregar respostas prontas. Ela existe
            para ajudar o estudante a entender conceitos, validar raciocínios,
            corrigir erros e desenvolver maturidade técnica durante a graduação.
          </p>
        </article>
      </div>
    </section>
  );
}