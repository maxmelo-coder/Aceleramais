import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const REPO   = 'maxmelo-coder/acelera-dados';
const BRANCH = 'main';
const FILE   = 'data/estudantes.json';

export async function POST() {
  const token = process.env.GITHUB_STORAGE_TOKEN;
  if (!token) return NextResponse.json({ error: 'Token não configurado' }, { status: 500 });

  // Busca SHA atual
  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}?ref=${BRANCH}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    cache: 'no-store',
  });

  let sha = '';
  if (getRes.ok) {
    const file = await getRes.json();
    sha = file.sha;
  } else if (getRes.status !== 404) {
    return NextResponse.json({ error: `GitHub GET: ${getRes.status}` }, { status: 500 });
  }

  // Sobrescreve com array vazio
  const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: JSON.stringify({
      message: 'admin: limpa respostas de teste',
      content: Buffer.from('[]').toString('base64'),
      sha: sha || undefined,
      branch: BRANCH,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    return NextResponse.json({ error: `GitHub PUT: ${putRes.status}`, detail: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: 'Todas as respostas foram apagadas.' });
}
