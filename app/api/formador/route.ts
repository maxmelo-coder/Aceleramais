import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAuthenticated } from '@/lib/verify-token';

// Persiste em /tmp — gravável no Vercel Lambda, compartilhado na mesma instância.
// Para produção em escala usar Vercel KV ou banco de dados externo.
const FILE = path.join('/tmp', 'acelera_forms_formador.json');
const MAX_PAYLOAD_BYTES = 64 * 1024; // 64 KB por submissão

function readAll(): unknown[] {
  try {
    if (fs.existsSync(FILE)) {
      return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
    }
  } catch { /* arquivo corrompido — reinicia limpo */ }
  return [];
}

function writeAll(data: unknown[]) {
  fs.writeFileSync(FILE, JSON.stringify(data), 'utf-8');
}

// GET — requer autenticação (só a plataforma lê respostas)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  return NextResponse.json(readAll());
}

// POST — público (formulário de campo não exige login)
export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload muito grande' }, { status: 413 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
    }

    if (typeof body.id !== 'string' || body.id.length === 0 || body.id.length > 100) {
      return NextResponse.json({ error: 'Campo id inválido' }, { status: 400 });
    }

    const all = readAll();
    const exists = (all as Array<{ id: string }>).some(r => r.id === body.id);
    if (!exists) {
      (all as unknown[]).push({ ...body, serverSavedAt: new Date().toISOString() });
      writeAll(all);
    }
    return NextResponse.json({ ok: true, total: all.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE — requer autenticação
export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.id !== 'string') {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 });
    }
    writeAll((readAll() as Array<{ id: string }>).filter(r => r.id !== body.id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
