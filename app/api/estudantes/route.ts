import { NextRequest, NextResponse } from 'next/server';
import { readAll, appendIfNew, removeById } from '@/lib/github-storage';
import { isAuthenticated } from '@/lib/verify-token';

const FILE = 'data/estudantes.json';
const MAX_PAYLOAD_BYTES = 64 * 1024;

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await readAll(FILE));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

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
    const result = await appendIfNew(FILE, body);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.id !== 'string') {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 });
    }
    await removeById(FILE, body.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
