import { AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CreateMunicipalityForm } from '@/components/library/admin/CreateMunicipalityForm';
import { ResetPasswordButton } from '@/components/library/admin/ResetPasswordButton';

export default async function MunicipiosPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from('library_profiles')
    .select('id, municipality_name, created_at')
    .eq('role', 'municipality')
    .order('municipality_name');

  let emailById = new Map<string, string>();
  let serviceRoleMissing = false;
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers({ perPage: 200 });
    emailById = new Map((data?.users ?? []).map(u => [u.id, u.email ?? '—']));
  } catch {
    serviceRoleMissing = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Municípios
        </h1>
        <p className="mt-1 text-sm text-bib-text-light-secondary">
          Criação e gestão das credenciais compartilhadas de cada município.
        </p>
      </div>

      {serviceRoleMissing && (
        <div className="flex items-start gap-3 px-4 py-3 bg-bib-orange/10 border border-bib-orange/30 rounded-bib-md text-sm text-bib-orange max-w-xl">
          <AlertTriangle size={16} aria-hidden="true" className="shrink-0 mt-0.5" />
          <p>
            A chave <code>SUPABASE_SERVICE_ROLE_KEY</code> não está configurada em <code>.env.local</code>. Criação e
            reset de senha de municípios ficam indisponíveis até que ela seja adicionada (copie em Supabase → Project
            Settings → API e cole apenas localmente, nunca no chat).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {!serviceRoleMissing && <CreateMunicipalityForm />}
        </div>

        <div className="rounded-bib-lg border border-bib-border-light bg-white overflow-hidden h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bib-gray-bg text-bib-text-light-muted text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Município</th>
                  <th className="text-left px-5 py-3 font-medium">E-mail</th>
                  <th className="text-right px-5 py-3 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bib-border-light">
                {(profiles ?? []).map(profile => (
                  <tr key={profile.id} className="hover:bg-bib-gray-bg/60 transition-colors">
                    <td className="px-5 py-3 text-bib-text-light-primary font-medium">
                      {profile.municipality_name ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-bib-text-light-secondary">{emailById.get(profile.id) ?? '—'}</td>
                    <td className="px-5 py-3 text-right">
                      {!serviceRoleMissing && <ResetPasswordButton userId={profile.id} />}
                    </td>
                  </tr>
                ))}
                {(profiles ?? []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-bib-text-light-muted">
                      Nenhum município cadastrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
