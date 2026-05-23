import { isAxiosError } from 'axios';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuthStore } from '../../core/store/authStore';

import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react';

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signUp = useAuthStore((state) => state.signUp);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [trackingConsent, setTrackingConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nextPath = searchParams.get('next');
  const destination = nextPath?.startsWith('/') ? nextPath : '/dashboard';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (senha !== confirmacaoSenha) {
      setError('As senhas informadas não coincidem.');
      return;
    }

    if (!acceptTerms || !acceptPrivacy) {
      setError('Aceite os termos e a política de privacidade para continuar.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await signUp({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        acceptTerms,
        acceptPrivacy,
        marketingConsent,
        trackingConsent,
      });

      navigate(destination);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setError('Este e-mail já está cadastrado. Entre com sua conta.');
        return;
      }

      if (isAxiosError(error) && error.response?.status === 400) {
        setError('Revise nome, e-mail e senha antes de continuar.');
        return;
      }

      if (isAxiosError(error) && !error.response) {
        setError('Não foi possível conectar com a API agora.');
        return;
      }

      setError('Não foi possível criar sua conta agora.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="liquid-card w-full max-w-lg rounded-3xl p-6 sm:p-8">
        <Link to="/" className="text-xs font-semibold uppercase text-cyan-300">
          ISOMÉTRICA
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-slate-50">
          Criar conta
        </h1>

        <p className="mt-3 leading-7 text-slate-300">
          Entre para acompanhar cursos, aulas e progresso.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <AuthField
            id="register-name"
            label="Nome"
            autoComplete="name"
            value={nome}
            onChange={setNome}
            placeholder="Seu nome"
            required
          />
          <AuthField
            id="register-email"
            label="E-mail"
            autoComplete="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthField
              id="register-password"
              label="Senha"
              autoComplete="new-password"
              minLength={6}
              type="password"
              value={senha}
              onChange={setSenha}
            placeholder="Mínimo 6 caracteres"
              required
            />
            <AuthField
              id="register-password-confirmation"
              label="Confirmar senha"
              autoComplete="new-password"
              minLength={6}
              type="password"
              value={confirmacaoSenha}
              onChange={setConfirmacaoSenha}
              placeholder="Repita a senha"
              required
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
            <ConsentField
              checked={acceptTerms}
              onChange={setAcceptTerms}
              required
            >
              Li e aceito os <Link className="font-semibold text-cyan-200" to="/terms">Termos de uso</Link>.
            </ConsentField>
            <ConsentField
              checked={acceptPrivacy}
              onChange={setAcceptPrivacy}
              required
            >
              Li e aceito a <Link className="font-semibold text-cyan-200" to="/privacy">Política de privacidade</Link>.
            </ConsentField>
            <ConsentField checked={marketingConsent} onChange={setMarketingConsent}>
              Quero receber comunicações e novidades da plataforma.
            </ConsentField>
            <ConsentField checked={trackingConsent} onChange={setTrackingConsent}>
              Permito medição opcional para melhorar campanhas e experiência.
            </ConsentField>
          </div>

          {error && (
            <p
              aria-live="polite"
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-cyan-400/90 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Criando conta...' : 'Criar conta e entrar'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Já tem conta?{' '}
          <Link className="font-semibold text-cyan-200 hover:text-cyan-100" to="/login">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}

function ConsentField({
  checked,
  onChange,
  required,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        required={required}
        type="checkbox"
        className="mt-1 h-4 w-4 accent-cyan-300"
      />
      <span>{children}</span>
    </label>
  );
}

type AuthFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'onChange' | 'type' | 'value'
> & {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function AuthField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  ...inputProps
}: AuthFieldProps) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
        {...inputProps}
      />
    </label>
  );
}
