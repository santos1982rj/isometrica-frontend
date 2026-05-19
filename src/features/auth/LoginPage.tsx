import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../core/store/authStore';

export function LoginPage() {
  const navigate = useNavigate();

  const signIn = useAuthStore((state) => state.signIn);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      await signIn({
        email,
        senha,
      });

      navigate('/dashboard');
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="liquid-card w-full max-w-md rounded-3xl p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          ISOMÉTRICA
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-50">
          Entrar na plataforma
        </h1>

        <p className="mt-3 leading-7 text-slate-300">
          Sistema acadêmico para estudantes de engenharia.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-slate-50 outline-none transition focus:border-cyan-300/40"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-slate-50 outline-none transition focus:border-cyan-300/40"
              placeholder="********"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-cyan-400/90 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}