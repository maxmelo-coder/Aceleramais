import { type NextRequest } from 'next/server';
import { updateLibrarySession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateLibrarySession(request);
}

export const config = {
  // Só intercepta as rotas da Biblioteca Digital Eleva+ — o resto do app
  // (Acelera+) continua usando seu próprio fluxo de autenticação por cookie.
  matcher: ['/biblioteca/:path*'],
};
