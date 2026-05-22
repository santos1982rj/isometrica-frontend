import { LegalPage } from './components/LegalPage';

export function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidade" subtitle="Como a plataforma usa dados de conta, estudo, compra e medição.">
      <section>
        <h2>Dados utilizados</h2>
        <p>A ISOMÉTRICA usa dados informados no cadastro, identificadores de conta, progresso acadêmico, compras e preferências salvas pelo aluno.</p>
      </section>
      <section>
        <h2>Finalidades</h2>
        <p>Esses dados sustentam autenticação, liberação de cursos, progresso, segurança, suporte e melhorias da experiência.</p>
      </section>
      <section>
        <h2>Rastreamento</h2>
        <p>Ferramentas de medição podem registrar visitas e eventos de conversão quando configuradas. A preferência de rastreamento fica na área Minha conta.</p>
      </section>
      <section>
        <h2>Preferências</h2>
        <p>O aluno pode ajustar consentimentos opcionais e trocar a senha no perfil. Aceites de termos e privacidade são registrados no cadastro.</p>
      </section>
    </LegalPage>
  );
}
