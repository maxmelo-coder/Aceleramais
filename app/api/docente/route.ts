import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FILE = path.join('/tmp', 'acelera_forms_docente.json');

function readAll(): any[] {
  try {
    if (fs.existsSync(FILE)) return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  } catch {}
  return [];
}

function writeAll(data: any[]) {
  fs.writeFileSync(FILE, JSON.stringify(data), 'utf-8');
}

export async function GET() {
  return NextResponse.json(readAll());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const all = readAll();
    const exists = all.some((r: any) => r.id === body.id);
    if (!exists) { all.push({ ...body, serverSavedAt: new Date().toISOString() }); writeAll(all); }
    return NextResponse.json({ ok: true, total: all.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    writeAll(readAll().filter((r: any) => r.id !== id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
