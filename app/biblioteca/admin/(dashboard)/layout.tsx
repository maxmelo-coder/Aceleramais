import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { libraryLogout } from '@/app/biblioteca/logout-action';
import { bibFontVariables } from '@/lib/library/fonts';
import { ADMIN_NAV } from '@/lib/library/admin-nav';
import { AdminShell } from '@/components/library/admin/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/biblioteca/admin/login');

  const { data: profile } = await supabase
    .from('library_profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') redirect('/biblioteca/admin/login');

  const logoutFromAdmin = libraryLogout.bind(null, '/biblioteca/admin/login');

  return (
    <div className={bibFontVariables}>
      <AdminShell navItems={ADMIN_NAV} userEmail={user.email ?? null} logoutAction={logoutFromAdmin}>
        {children}
      </AdminShell>
    </div>
  );
}
