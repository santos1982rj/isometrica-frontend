import { useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Camera,
  ExternalLink,
  LockKeyhole,
  MapPin,
  Save,
  SlidersHorizontal,
  Sparkles,
  Upload,
} from 'lucide-react';

import { IsoButton } from '../../components/ui/IsoButton';
import { LiquidCard } from '../../components/ui/LiquidCard';
import { useAuthStore } from '../../core/store/authStore';
import { resolveAssetUrl } from '../../core/utils/assetUrl';
import { StudyStreakCard } from '../analytics/components/StudyStreakCard';
import { XpProgressCard } from '../analytics/components/XpProgressCard';
import { useAnalytics } from '../analytics/useAnalytics';
import {
  changePassword,
  listMyPurchases,
  refreshMyPurchase,
  requestEmailVerification,
  updatePreferences,
  updateProfile,
  uploadAvatar,
} from './profile.service';

function getInitials(name?: string) {
  if (!name) {
    return 'IS';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function splitList(value?: string | null) {
  return value
    ?.split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: analytics } = useAnalytics();
  const user = useAuthStore((state) => state.user);
  const loadUser = useAuthStore((state) => state.loadUser);

  const [nome, setNome] = useState(user?.nome ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [headline, setHeadline] = useState(user?.headline ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [experience, setExperience] = useState(user?.experience ?? '');
  const [education, setEducation] = useState(user?.education ?? '');
  const [skills, setSkills] = useState(user?.skills ?? '');
  const [interests, setInterests] = useState(user?.interests ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl ?? '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl ?? '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl ?? '');
  const [instagramUrl, setInstagramUrl] = useState(user?.instagramUrl ?? '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(
    user?.marketingConsent ?? false,
  );
  const [trackingConsent, setTrackingConsent] = useState(
    user?.trackingConsent ?? false,
  );
  const { data: purchases = [] } = useQuery({
    queryKey: ['student', 'purchases'],
    queryFn: listMyPurchases,
  });

  const displayAvatar = avatarPreview || resolveAssetUrl(avatar);
  const skillsList = useMemo(() => splitList(skills), [skills]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      loadUser();
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (updatedUser) => {
      setAvatar(updatedUser.avatar ?? '');
      setAvatarPreview('');
      loadUser();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      loadUser();
    },
  });
  const emailVerificationMutation = useMutation({
    mutationFn: requestEmailVerification,
  });
  const refreshPurchaseMutation = useMutation({
    mutationFn: refreshMyPurchase,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['student', 'purchases'] }),
        queryClient.invalidateQueries({ queryKey: ['my-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
      ]);
    },
  });

  return (
    <section className="w-full space-y-4">
      <LiquidCard className="overflow-hidden rounded-xl p-0">
        <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] p-4 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-end">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)]">
                {displayAvatar ? (
                  <img className="h-full w-full object-cover" src={displayAvatar} alt={nome} />
                ) : (
                  <div className="grid h-full w-full place-items-center text-3xl font-semibold text-[var(--accent)]">
                    {getInitials(nome)}
                  </div>
                )}
                <label className="absolute bottom-2 right-2 grid h-9 w-9 cursor-pointer place-items-center rounded-md bg-[var(--surface)] text-[var(--text)] shadow-sm transition hover:brightness-105">
                  <Camera className="h-4 w-4" />
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }
                      setAvatarPreview(URL.createObjectURL(file));
                      uploadAvatarMutation.mutate(file);
                    }}
                  />
                </label>
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-medium text-[var(--iso-primary)]">
                  <Sparkles className="h-4 w-4" />
                  Perfil profissional do aluno
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-[var(--text-h)] sm:text-3xl">
                  {nome || 'Seu nome'}
                </h1>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {headline || 'Conte quem você é, onde quer chegar e quais áreas da engenharia quer dominar.'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--text-muted)]">
                  {location && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </span>
                  )}
                  <span className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
                    Nível {user?.nivel ?? 1} | {analytics?.xpTotal ?? 0} XP
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Prévia de currículo
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
                Este perfil prepara a base para certificados, portfólio e uma página pública compartilhável.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {skillsList.slice(0, 5).map((skill) => (
                  <span key={skill} className="rounded-md bg-[var(--iso-primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--iso-primary)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <ProfileTextField label="Nome" value={nome} onChange={setNome} />
              <ProfileTextField label="Título profissional" value={headline} onChange={setHeadline} placeholder="Ex: Estudante de engenharia civil" />
              <ProfileTextField label="Cidade/estado" value={location} onChange={setLocation} placeholder="Rio de Janeiro, RJ" />
              <ProfileTextField label="WhatsApp/suporte profissional" value={whatsapp} onChange={setWhatsapp} placeholder="(21) 99999-9999" />
            </div>

            <ProfileTextArea label="Bio" value={bio} onChange={setBio} placeholder="Escreva uma apresentação curta sobre você, seus interesses e objetivos." />
            <ProfileTextArea label="Experiência" value={experience} onChange={setExperience} placeholder="Projetos, estágios, atividades acadêmicas, monitorias ou vivências técnicas." />
            <ProfileTextArea label="Formação" value={education} onChange={setEducation} placeholder="Curso, instituição, período, formações complementares." />
            <ProfileTextArea label="Habilidades técnicas" value={skills} onChange={setSkills} placeholder="AutoCAD, Excel, Revit, cálculo estrutural, hidráulica..." />
            <ProfileTextArea label="Áreas de interesse" value={interests} onChange={setInterests} placeholder="Estruturas, geotecnia, saneamento, transportes..." />
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">Imagem do perfil</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Envie uma foto ou cole uma URL. O upload já salva automaticamente.
              </p>
              <label className="mt-4 block">
                <span className="mb-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Upload className="h-4 w-4" />
                  URL alternativa do avatar
                </span>
                <input
                  className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--text)] outline-none transition focus:border-[var(--accent-border)]"
                  value={avatar}
                  onChange={(event) => setAvatar(event.target.value)}
                  placeholder="https://..."
                />
              </label>
              {uploadAvatarMutation.isPending && (
                <p className="mt-3 text-sm text-[var(--text-muted)]">Enviando imagem...</p>
              )}
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">Links profissionais</p>
              <div className="mt-3 grid gap-3">
                <ProfileTextField icon={<ExternalLink className="h-4 w-4" />} label="LinkedIn" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/..." />
                <ProfileTextField icon={<ExternalLink className="h-4 w-4" />} label="GitHub" value={githubUrl} onChange={setGithubUrl} placeholder="https://github.com/..." />
                <ProfileTextField icon={<ExternalLink className="h-4 w-4" />} label="Portfólio/site" value={portfolioUrl} onChange={setPortfolioUrl} placeholder="https://..." />
                <ProfileTextField icon={<Camera className="h-4 w-4" />} label="Instagram" value={instagramUrl} onChange={setInstagramUrl} placeholder="https://instagram.com/..." />
              </div>
            </div>

            <IsoButton
              className="w-full"
              disabled={updateProfileMutation.isPending}
              onClick={() =>
                updateProfileMutation.mutate({
                  nome,
                  avatar,
                  headline: headline || null,
                  location: location || null,
                  bio: bio || null,
                  experience: experience || null,
                  education: education || null,
                  skills: skills || null,
                  interests: interests || null,
                  linkedinUrl: linkedinUrl || null,
                  githubUrl: githubUrl || null,
                  portfolioUrl: portfolioUrl || null,
                  instagramUrl: instagramUrl || null,
                  whatsapp: whatsapp || null,
                })
              }
            >
              <Save className="h-4 w-4" />
              {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar perfil profissional'}
            </IsoButton>

            {updateProfileMutation.isSuccess && (
              <p className="text-sm text-[var(--success-500)]">Perfil atualizado com sucesso.</p>
            )}
            {updateProfileMutation.isError && (
              <p className="text-sm text-red-300">Não foi possível atualizar o perfil.</p>
            )}
          </aside>
        </div>
      </LiquidCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <StudyStreakCard
          streak={analytics?.streak ?? 0}
        />

        <XpProgressCard
          xp={analytics?.xpTotal ?? 0}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <LiquidCard className="rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 text-[var(--iso-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--text-h)]">
              Senha
            </h2>
          </div>
          <div className="mt-4 grid gap-3">
            <AccountPasswordField
              label="Senha atual"
              autoComplete="current-password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <AccountPasswordField
              label="Nova senha"
              autoComplete="new-password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <AccountPasswordField
              label="Confirmar nova senha"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            {passwordError && <p className="text-sm text-red-300">{passwordError}</p>}
            {changePasswordMutation.isSuccess && (
              <p className="text-sm text-[var(--success-500)]">
                Senha atualizada.
              </p>
            )}
            {changePasswordMutation.isError && (
              <p className="text-sm text-red-300">
                Não foi possível atualizar. Confira a senha atual.
              </p>
            )}
            <IsoButton
              disabled={changePasswordMutation.isPending}
              onClick={() => {
                if (newPassword !== confirmPassword) {
                  setPasswordError('As novas senhas não coincidem.');
                  return;
                }
                setPasswordError('');
                changePasswordMutation.mutate({
                  currentPassword,
                  newPassword,
                });
              }}
            >
              {changePasswordMutation.isPending ? 'Salvando...' : 'Trocar senha'}
            </IsoButton>
          </div>
        </LiquidCard>

        <LiquidCard className="rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-5 w-5 text-[var(--iso-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--text-h)]">
              Minha conta
            </h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Aceite de termos e privacidade ficam registrados no cadastro. Ajuste
            aqui as preferências opcionais.
          </p>
          <div className="mt-4 space-y-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-soft)]">
            <PreferenceToggle
              checked={marketingConsent}
              onChange={setMarketingConsent}
              label="Comunicações e novidades"
            />
            <PreferenceToggle
              checked={trackingConsent}
              onChange={setTrackingConsent}
              label="Medição opcional de campanhas"
            />
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Termos: {user?.termsAcceptedAt ? 'aceitos' : 'pendente'} | Privacidade:{' '}
            {user?.privacyAcceptedAt ? 'aceita' : 'pendente'}
          </p>
          <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-soft)]">
            <p>
              E-mail: {user?.emailVerifiedAt ? 'validado' : 'pendente de validação'}
            </p>
            {!user?.emailVerifiedAt && (
              <button
                className="mt-3 font-semibold text-[var(--iso-primary)]"
                onClick={() => emailVerificationMutation.mutate()}
                type="button"
              >
                Preparar link de validação
              </button>
            )}
            {emailVerificationMutation.data?.message && (
              <p className="mt-2 text-xs">{emailVerificationMutation.data.message}</p>
            )}
            {emailVerificationMutation.data?.verificationUrl && (
              <a
                className="mt-2 block text-xs font-semibold text-[var(--iso-primary)]"
                href={emailVerificationMutation.data.verificationUrl}
              >
                Abrir link de desenvolvimento
              </a>
            )}
          </div>
          {updatePreferencesMutation.isSuccess && (
            <p className="mt-3 text-sm text-[var(--success-500)]">
              Preferências salvas.
            </p>
          )}
          <IsoButton
            className="mt-4 w-full"
            disabled={updatePreferencesMutation.isPending}
            onClick={() =>
              updatePreferencesMutation.mutate({
                marketingConsent,
                trackingConsent,
              })
            }
          >
            {updatePreferencesMutation.isPending ? 'Salvando...' : 'Salvar preferências'}
          </IsoButton>
        </LiquidCard>
      </div>

      <LiquidCard className="rounded-xl p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-[var(--text-h)]">
          Histórico de compras
        </h2>

        <div className="mt-4 grid gap-3">
          {purchases.length === 0 ? (
            <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm text-[var(--text-muted)]">
              Você ainda não possui compras registradas.
            </p>
          ) : (
            purchases.slice(0, 12).map((purchase) => (
              <div
                key={purchase.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {purchase.curso?.titulo ?? purchase.referenciaCompra}
                  </p>

                  <span
                    className={[
                      'rounded-md border px-2.5 py-1 text-[11px] font-bold',
                      purchase.status === 'APROVADO'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : purchase.status === 'PENDENTE'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                          : 'border-red-500/30 bg-red-500/10 text-red-300',
                    ].join(' ')}
                  >
                    {purchase.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Pagamento: {purchase.metodoPagamento}
                  {purchase.installments ? ` · ${purchase.installments}x` : ''}
                  {' · '}ID MP: {purchase.mpPaymentId}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {new Date(purchase.approvedAt ?? purchase.createdAt).toLocaleString('pt-BR')}
                  {purchase.statusDetail ? ` · ${purchase.statusDetail}` : ''}
                </p>
                <p className="mt-1 text-sm text-[var(--text)]">
                  R$ {purchase.valorTotal.toFixed(2)}
                </p>
                {purchase.status === 'PENDENTE' && (
                  <div className="mt-3 flex flex-col gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-amber-100">
                      Acesso aguardando confirmação do pagamento. Pix e boleto podem permanecer pendentes até o Mercado Pago confirmar.
                    </p>
                    <button
                      className="iso-button-soft shrink-0 px-3 text-xs"
                      disabled={refreshPurchaseMutation.isPending}
                      onClick={() => refreshPurchaseMutation.mutate(purchase.id)}
                      type="button"
                    >
                      {refreshPurchaseMutation.isPending ? 'Atualizando...' : 'Atualizar status'}
                    </button>
                  </div>
                )}
                {purchase.status === 'APROVADO' && purchase.curso && (
                  <a
                    className="iso-button-soft mt-3 w-fit px-3 text-xs"
                    href={`/courses/${purchase.curso.slug}`}
                  >
                    Abrir curso
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </LiquidCard>
    </section>
  );
}

function AccountPasswordField({
  label,
  autoComplete,
  value,
  onChange,
}: {
  label: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-[var(--text-muted)]">{label}</span>
      <input
        autoComplete={autoComplete}
        minLength={6}
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-[var(--text)] outline-none transition focus:border-[var(--accent-border)]"
      />
    </label>
  );
}

function ProfileTextField({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        {icon}
        {label}
      </span>
      <input
        className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function ProfileTextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-[var(--text-muted)]">{label}</span>
      <textarea
        className="min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-3 leading-6 text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-border)]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function PreferenceToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
        className="h-5 w-5 accent-[var(--iso-primary)]"
      />
    </label>
  );
}
