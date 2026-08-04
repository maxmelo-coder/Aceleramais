import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cliente com a service_role key — IGNORA RLS e privilégios de coluna.
// Nunca importar este arquivo em Client Components. Uso restrito a:
//  - criar/resetar login de município (auth.admin.createUser)
//  - ler/gravar original_pdf_path e as imagens de página durante a conversão do PDF
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY não configurada. Adicione-a em .env.local (ver instruções no arquivo).',
    );
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
