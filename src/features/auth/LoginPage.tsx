import { useState } from 'react';
import { isAxiosError } from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuthStore } from '../../core/store/authStore';

import type { FormEvent } from 'react';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const signIn = useAuthStore((state) => state.signIn);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nextPath = searchParams.get('next');
  const destination = nextPath?.startsWith('/') ? nextPath : '/dashboard';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      await signIn({
        email: email.trim(),
        senha: senha.trim(),
      });

      navigate(destination);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setError('E-mail ou senha inválidos.');
        return;
      }

      if (isAxiosError(error) && !error.response) {
        setError(
          'Não foi possível conectar com a API. Verifique se o backend está rodando na porta 3333.',
        );
        return;
      }

      setError('Não foi possível entrar agora. Tente novamente em instantes.');
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
            <label htmlFor="login-email" className="mb-2 block text-sm text-slate-300">
              E-mail
            </label>

            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-slate-50 outline-none transition focus:border-cyan-300/40"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm text-slate-300">
              Senha
            </label>

            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
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
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-cyan-400/90 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <Link
          className="mt-4 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100"
          to="/forgot-password"
        >
          Esqueci minha senha
        </Link>

        <p className="mt-6 text-sm text-slate-300">
          Ainda não tem conta?{' '}
          <Link
            className="font-semibold text-cyan-200 hover:text-cyan-100"
            to={
              destination !== '/dashboard'
                ? `/register?next=${encodeURIComponent(destination)}`
                : '/register'
            }
          >
            Criar conta
          </Link>
        </p>
      </section>
    </main>
  );
}
