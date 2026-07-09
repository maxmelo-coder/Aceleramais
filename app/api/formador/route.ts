import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Persiste em /tmp — gravável no Vercel Lambda, compartilhado na mesma instância.
// Ideal para volume baixo / demos. Para produção em escala usar Vercel KV.
const FILE = path.join('/tmp', 'acelera_forms_formador.json');

function readAll(): any[] {
  try {
    if (fs.existsSync(FILE)) {
      return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
    }
  } catch {/* file corrupted - restart clean */}
  return [];
}

function writeAll(data: any[]) {
  fs.writeFileSync(FILE, JSON.stringify(data), 'utf-8');
}

export async function GET() {
  const data = readAll();
  return NextResponse.json(data, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    const all = readAll();
    // Evita duplicatas pelo id
    const exists = all.some((r: any) => r.id === body.id);
    if (!exists) {
      all.push({ ...body, serverSavedAt: new Date().toISOString() });
      writeAll(all);
    }
    return NextResponse.json({ ok: true, total: all.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const all = readAll().filter((r: any) => r.id !== id);
    writeAll(all);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
