import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/verify-token';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const token = process.env.GITHUB_STORAGE_TOKEN;
  const hasToken = !!token && token.length > 0;

  if (!hasToken) {
    return NextResponse.json({ ok: false, error: 'GITHUB_STORAGE_TOKEN não configurado', tokenLength: 0 });
  }

  // Testa leitura do GitHub
  try {
    const res = await fetch(
      'https://api.github.com/repos/maxmelo-coder/acelera-dados/contents/data/estudantes.json?ref=main',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        cache: 'no-store',
      }
    );

    if (res.status === 401) {
      return NextResponse.json({ ok: false, error: 'Token GitHub expirado ou inválido (401)', tokenLength: token.length });
    }
    if (res.status === 403) {
      return NextResponse.json({ ok: false, error: 'Token GitHub sem permissão (403)', tokenLength: token.length });
    }
    if (res.status === 404) {
      return NextResponse.json({ ok: true, info: 'Arquivo data/estudantes.json ainda não existe (normal se não há respostas)', tokenLength: token.length });
    }
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `GitHub retornou ${res.status}`, tokenLength: token.length });
    }

    const file = await res.json();
    const content = Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf-8');
    const data = JSON.parse(content);

    return NextResponse.json({
      ok: true,
      tokenLength: token.length,
      totalRespostas: Array.isArray(data) ? data.length : 'não é array',
      ultimaResposta: Array.isArray(data) && data.length > 0 ? data[data.length - 1]?.submittedAt : null,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e), tokenLength: token.length });
  }
}
