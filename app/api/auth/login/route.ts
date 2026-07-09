import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_SECRET =
  process.env.SESSION_SECRET || 'acelera-default-secret-mude-em-producao-2025';

// Credenciais lidas de variáveis de ambiente — nunca expostas ao cliente.
// Para adicionar usuários, configure as env vars correspondentes no Vercel.
const USERS = [
  {
    email:    process.env.ADMIN_EMAIL    || 'admin@eleva.com.br',
    password: process.env.ADMIN_PASSWORD || 'Eleva@2025',
    name:     'Administrador Acelera+',
    role:     'Super Administrador',
  },
  {
    email:    process.env.SEC_EMAIL    || 'secretaria@limoeiro.al.gov.br',
    password: process.env.SEC_PASSWORD || 'Sec@2025',
    name:     'Sec. Francisco das Chagas',
    role:     'Secretaria Municipal',
  },
  {
    email:    process.env.GESTOR_EMAIL    || 'gestor@escola.edu.br',
    password: process.env.GESTOR_PASSWORD || 'Gestor@2025',
    name:     'Gestor Escolar',
    role:     'Gestor Escolar',
  },
];

export function buildToken(email: string): string {
  const payload = Buffer.from(`${email}:${Date.now()}`).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const { email, password } = body;

    if (email.length > 200 || password.length > 200) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const user = USERS.find(
      u =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    );

    // Delay constante — impede timing attacks
    await new Promise(r => setTimeout(r, 300 + Math.random() * 150));

    if (!user) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 });
    }

    const token = buildToken(user.email);
    const { password: _pwd, ...safeUser } = user;

    return NextResponse.json({ token, user: safeUser });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
