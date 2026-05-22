import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { verifyEmail } from './auth.service';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Link de validação incompleto.');
      return;
    }

    verifyEmail(token)
      .then((result) => setMessage(result.message))
      .catch((error) =>
        setError(
          isAxiosError(error) && error.response?.status === 400
            ? 'O link expirou ou já foi usado.'
            : 'Não foi possível validar o e-mail agora.',
        ),
      );
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="liquid-card w-full max-w-md rounded-3xl p-6 sm:p-8">
        <Link to="/" className="text-xs font-semibold uppercase text-cyan-300">
          ISOMÉTRICA
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-slate-50">
          Validação de e-mail
        </h1>
        {message && (
          <p className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {message}
          </p>
        )}
        {!message && !error && (
          <p className="mt-5 text-slate-300">Validando seu link...</p>
        )}
        {error && (
          <p className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}
        <Link className="mt-6 inline-flex font-semibold text-cyan-200" to="/profile">
          Ir para Minha conta
        </Link>
      </section>
    </main>
  );
}
