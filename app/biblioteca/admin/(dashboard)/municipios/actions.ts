'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface MunicipalityActionState {
  error: string | null;
  success: boolean;
}

async function assertIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado.');

  const { data: profile } = await supabase.from('library_profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Apenas administradores podem gerenciar municípios.');
}

export async function createMunicipalityLogin(
  _prevState: MunicipalityActionState,
  formData: FormData,
): Promise<MunicipalityActionState> {
  try {
    await assertIsAdmin();
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  const municipalityName = String(formData.get('municipality_name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!municipalityName || !email) {
    return { error: 'Nome do município e e-mail são obrigatórios.', success: false };
  }
  if (password.length < 8) {
    return { error: 'A senha precisa ter pelo menos 8 caracteres.', success: false };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'municipality', municipality_name: municipalityName },
  });

  if (error) {
    return { error: `Falha ao criar login: ${error.message}`, success: false };
  }

  revalidatePath('/biblioteca/admin/municipios');
  return { error: null, success: true };
}

export async function resetMunicipalityPassword(
  userId: string,
  _prevState: MunicipalityActionState,
  formData: FormData,
): Promise<MunicipalityActionState> {
  try {
    await assertIsAdmin();
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  const password = String(formData.get('password') || '');
  if (password.length < 8) {
    return { error: 'A senha precisa ter pelo menos 8 caracteres.', success: false };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, { password });
  if (error) {
    return { error: `Falha ao resetar senha: ${error.message}`, success: false };
  }

  revalidatePath('/biblioteca/admin/municipios');
  return { error: null, success: true };
}
