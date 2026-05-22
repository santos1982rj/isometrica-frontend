import { isAxiosError } from 'axios';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { resetPassword } from './auth.service';

import type { FormEvent } from 'react';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setError('Link de redefinição incompleto.');
      return;
    }

    if (senha !== confirmacao) {
      setError('As senhas informadas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await resetPassword(token, senha);
      setMessage(result.message);
    } catch (error) {
      setError(
        isAxiosError(error) && error.response?.status === 400
          ? 'O link expirou ou já foi usado.'
          : 'Não foi possível redefinir a senha agora.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="liquid-card w-full max-w-md rounded-3xl p-6 sm:p-8">
        <Link to="/" className="text-xs font-semibold uppercase text-cyan-300">
          ISOMETRICA
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">Nova senha</h1>
        <p className="mt-3 leading-7 text-slate-300">
          Escolha uma nova senha para sua conta.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <PasswordField
            id="reset-password"
            label="Nova senha"
            value={senha}
            onChange={setSenha}
          />
          <PasswordField
            id="reset-password-confirmation"
            label="Confirmar senha"
            value={confirmacao}
            onChange={setConfirmacao}
          />

          {message && (
            <p aria-live="polite" className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              {message}{' '}
              <Link className="font-semibold underline" to="/login">
                Entrar
              </Link>
            </p>
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
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </section>
    </main>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        id={id}
        autoComplete="new-password"
        minLength={6}
        required
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-slate-50 outline-none transition focus:border-cyan-300/40"
      />
    </label>
  );
}
