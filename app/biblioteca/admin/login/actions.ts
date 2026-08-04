'use server';

import { createClient } from '@/lib/supabase/server';

// Estado próprio do login administrativo (não reaproveita o LoginFormState
// do município) para poder expor `success` e acionar a animação de saída no
// cliente antes de navegar — sem qualquer risco para app/biblioteca/login/actions.ts.
export interface AdminLoginState {
  error: string | null;
  success: boolean;
}

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Informe e-mail e senha.', success: false };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: 'E-mail ou senha incorretos.', success: false };
  }

  const { data: profile } = await supabase
    .from('library_profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profile?.role !== 'admin') {
    await supabase.auth.signOut();
    return { error: 'Este login não tem acesso ao painel administrativo.', success: false };
  }

  // A navegação para /biblioteca/admin acontece no cliente (ver page.tsx),
  // após a animação de saída, para preservar a UX solicitada. A sessão já
  // está gravada no cookie neste ponto, então o redirect client-side é seguro.
  return { error: null, success: true };
}
