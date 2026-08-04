import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { libraryLogout } from '@/app/biblioteca/logout-action';
import { bibFontVariables } from '@/lib/library/fonts';
import { AppHeader } from '@/components/library/AppHeader';
import { AIFloatingButton } from '@/components/library/ia/AIFloatingButton';

export default async function LibraryAppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/biblioteca/login');

  const { data: profile } = await supabase
    .from('library_profiles')
    .select('role, municipality_name')
    .eq('id', user.id)
    .single();

  // Programas reais cadastrados alimentam a navegação principal (fazem as
  // vezes de "coleções") — nada de itens de menu fictícios ou sem destino.
  const { data: programs } = await supabase
    .from('library_programs')
    .select('id, name, slug, accent_color')
    .order('sort_order', { ascending: true });

  const logoutForMunicipality = libraryLogout.bind(null, '/biblioteca/login');

  return (
    <div className={bibFontVariables} style={{ fontFamily: 'var(--font-bib-sans)' }}>
      <div className="min-h-screen bg-bib-gray-bg">
        <AppHeader
          programs={programs ?? []}
          municipalityName={profile?.municipality_name ?? null}
          isAdmin={profile?.role === 'admin'}
          logoutAction={logoutForMunicipality}
        />
        <main id="library-main-content" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <AIFloatingButton />
      </div>
    </div>
  );
}
