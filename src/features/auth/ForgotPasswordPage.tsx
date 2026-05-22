import { isAxiosError } from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { requestPasswordReset } from './auth.service';

import type { FormEvent, ReactNode } from 'react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      const result = await requestPasswordReset(email.trim());
      setMessage(result.message);
      setResetUrl(result.resetUrl ?? '');
    } catch (error) {
      setError(
        isAxiosError(error) && !error.response
          ? 'Não foi possível conectar com a API agora.'
          : 'Não foi possível solicitar a redefinição agora.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      title="Recuperar senha"
      description="Informe seu e-mail para preparar a redefinição da senha."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block" htmlFor="forgot-email">
          <span className="mb-2 block text-sm text-slate-300">E-mail</span>
          <input
            id="forgot-email"
            autoComplete="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-slate-50 outline-none transition focus:border-cyan-300/40"
            placeholder="seu@email.com"
          />
        </label>

        {message && (
          <p aria-live="polite" className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {message}
          </p>
        )}
        {resetUrl && (
          <Link
            className="block rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm font-semibold text-cyan-100"
            to={resetUrl.replace(/^https?:\/\/[^/]+/, '')}
          >
            Abrir link de redefinição em desenvolvimento
          </Link>
        )}
        {error && (
          <p aria-live="polite" className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-cyan-400/90 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          {loading ? 'Preparando...' : 'Redefinir senha'}
        </button>
      </form>
    </AuthFrame>
  );
}

function AuthFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="liquid-card w-full max-w-md rounded-3xl p-6 sm:p-8">
        <Link to="/" className="text-xs font-semibold uppercase text-cyan-300">
          ISOMETRICA
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">{title}</h1>
        <p className="mt-3 leading-7 text-slate-300">{description}</p>
        <div className="mt-7">{children}</div>
        <p className="mt-6 text-sm text-slate-300">
          Lembrou a senha?{' '}
          <Link className="font-semibold text-cyan-200" to="/login">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
