'use server';

import { createClient } from '@/lib/supabase/server';

// `success` foi adicionado (mantendo `error` com o mesmo contrato) para que a
// navegação para /biblioteca aconteça no cliente, após uma transição de saída
// curta — mesmo padrão usado em app/biblioteca/admin/login/actions.ts. A
// sessão já está gravada no cookie neste ponto, então o redirect client-side
// é seguro. Nenhuma regra de validação de e-mail/senha/role foi alterada.
export interface LoginFormState {
  error: string | null;
  success: boolean;
}

export async function municipalityLogin(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Informe usuário e senha.', success: false };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: 'Usuário ou senha incorretos.', success: false };
  }

  const { data: profile } = await supabase
    .from('library_profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profile?.role !== 'municipality' && profile?.role !== 'admin') {
    await supabase.auth.signOut();
    return { error: 'Este login não tem acesso à biblioteca do município.', success: false };
  }

  return { error: null, success: true };
}
