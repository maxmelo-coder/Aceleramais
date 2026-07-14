/**
 * Storage persistente via GitHub Contents API.
 *
 * Os dados ficam em repositório PRIVADO (maxmelo-coder/acelera-dados),
 * acessível apenas com o GITHUB_STORAGE_TOKEN.
 * Cada arquivo é um array JSON de respostas.
 *
 * Vantagens sobre /tmp:
 * - Persiste entre deploys, cold starts e reinicializações do Lambda
 * - Versionado (cada escrita gera um commit)
 * - Gratuito, sem limite de plano Vercel
 */

const REPO   = 'maxmelo-coder/acelera-dados';
const BRANCH = 'main';
const BASE   = 'https://api.github.com';

function ghHeaders(): Record<string, string> {
  const token = process.env.GITHUB_STORAGE_TOKEN;
  if (!token) throw new Error('GITHUB_STORAGE_TOKEN não configurado');
  return {
    Authorization: `Bearer ${token}`,
    Accept:        'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

interface GhFile {
  sha: string;
  content: string; // base64
}

async function getFile(path: string): Promise<{ data: unknown[]; sha: string }> {
  const res = await fetch(`${BASE}/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers: ghHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 404) return { data: [], sha: '' };
    throw new Error(`GitHub GET ${path}: ${res.status}`);
  }
  const file = (await res.json()) as GhFile;
  const json = Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf-8');
  return { data: JSON.parse(json), sha: file.sha };
}

async function putFile(path: string, data: unknown[], sha: string): Promise<void> {
  const content = Buffer.from(JSON.stringify(data)).toString('base64');
  const body = JSON.stringify({
    message: `update: ${path} via API`,
    content,
    sha: sha || undefined,
    branch: BRANCH,
  });
  const res = await fetch(`${BASE}/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: ghHeaders(),
    body,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub PUT ${path}: ${res.status} ${JSON.stringify(err)}`);
  }
}

// ─── Interface pública ────────────────────────────────────────────────────────

export async function readAll(path: string): Promise<unknown[]> {
  const { data } = await getFile(path);
  return data;
}

/**
 * Adiciona uma entrada se o id ainda não existir (idempotente).
 * Retorna o total de entradas após a operação.
 */
export async function appendIfNew(
  path: string,
  entry: { id: string; [k: string]: unknown },
): Promise<{ added: boolean; total: number }> {
  const { data, sha } = await getFile(path);
  const arr = data as Array<{ id: string }>;

  if (arr.some(r => r.id === entry.id)) {
    return { added: false, total: arr.length };
  }

  const updated = [...arr, { ...entry, serverSavedAt: new Date().toISOString() }];
  await putFile(path, updated, sha);
  return { added: true, total: updated.length };
}

/**
 * Remove entrada pelo id.
 */
export async function removeById(path: string, id: string): Promise<void> {
  const { data, sha } = await getFile(path);
  const arr = data as Array<{ id: string }>;
  const updated = arr.filter(r => r.id !== id);
  await putFile(path, updated, sha);
}
