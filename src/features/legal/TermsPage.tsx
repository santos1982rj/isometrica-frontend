import { Link } from 'react-router-dom';

import { LegalPage } from './components/LegalPage';

export function TermsPage() {
  return (
    <LegalPage title="Termos de uso" subtitle="Regras básicas para acesso à ISOMÉTRICA.">
      <section>
        <h2>Conta e acesso</h2>
        <p>Sua conta é pessoal. Mantenha a senha protegida e informe dados corretos para cadastro, compra e suporte.</p>
      </section>
      <section>
        <h2>Conteúdo e estudo</h2>
        <p>A plataforma organiza aulas, exercícios e ferramentas educacionais. O conteúdo não substitui normas técnicas ou responsabilidade profissional.</p>
      </section>
      <section>
        <h2>Compras</h2>
        <p>Cursos pagos liberam acesso conforme a confirmação do pagamento e as condições exibidas no checkout.</p>
      </section>
      <section>
        <h2>Privacidade</h2>
        <p>O tratamento de dados é descrito na <Link to="/privacy">Política de privacidade</Link>.</p>
      </section>
    </LegalPage>
  );
}
