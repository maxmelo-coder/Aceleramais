import crypto from 'crypto';
import { NextRequest } from 'next/server';

const SESSION_SECRET =
  process.env.SESSION_SECRET || 'acelera-default-secret-mude-em-producao-2025';

/**
 * Verifica se um token gerado por /api/auth/login é válido.
 * Token formato: base64url(email:timestamp).HMAC-SHA256
 */
export function verifyToken(token: string): boolean {
  try {
    const dot = token.lastIndexOf('.');
    if (dot === -1) return false;
    const payload = token.slice(0, dot);
    const sig     = token.slice(dot + 1);
    if (!payload || !sig || sig.length !== 64) return false;

    const expected = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex');

    // Comparação em tempo constante — previne timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(sig.padEnd(64, '0'), 'hex'),
      Buffer.from(expected, 'hex'),
    );
  } catch {
    return false;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}

/** Retorna true se a request contém token válido. */
export function isAuthenticated(req: NextRequest): boolean {
  const token = getTokenFromRequest(req);
  return token !== null && verifyToken(token);
}
