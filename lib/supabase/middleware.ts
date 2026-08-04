import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Renova a sessão Supabase e protege as rotas da Biblioteca Digital Eleva+
// por papel (municipality/admin). Isolado do resto do app: só roda em /biblioteca/**
// (ver middleware.ts na raiz), sem interferir na autenticação por cookie do Acelera+.
export async function updateLibrarySession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith('/biblioteca/admin');
  const isAdminLogin = pathname === '/biblioteca/admin/login';
  const isMunicipalityLogin = pathname === '/biblioteca/login';

  // Área admin (exceto a própria tela de login do admin)
  if (isAdminArea && !isAdminLogin) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/biblioteca/admin/login';
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from('library_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/biblioteca/admin/login';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Área da biblioteca do município (tudo em /biblioteca exceto login e /admin)
  if (!isAdminArea && !isMunicipalityLogin) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/biblioteca/login';
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from('library_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    // Admin também pode navegar a área do município (modo preview).
    if (profile?.role !== 'municipality' && profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/biblioteca/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
