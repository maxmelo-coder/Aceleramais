import type { AIRequest } from './types';

const BLOCKED_PATTERNS = [
  /diagnos[ti]/i,
  /laudo m[eé]dic/i,
  /cid[-\s]?\d/i,
  /dsm[-\s]?\d/i,
  /prescrever|prescri[çc][aã]o/i,
  /medica[çc][aã]o|rem[eé]dio|f[aá]rmaco/i,
  /receita m[eé]dic/i,
];

const SENSITIVE_KEYWORDS = [
  /nome completo/i,
  /cpf/i,
  /data de nascimento/i,
  /endere[çc]o resid/i,
];

export function checkGuardrails(request: AIRequest): { blocked: boolean; reason?: string } {
  const lastMessage = request.messages[request.messages.length - 1]?.content ?? '';

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(lastMessage)) {
      return {
        blocked: true,
        reason: 'Solicitação fora do escopo pedagógico da IA Eleva+. Esta IA não realiza diagnósticos, não prescreve medicamentos e não emite laudos.',
      };
    }
  }
  return { blocked: false };
}

export function detectSensitiveData(text: string): boolean {
  return SENSITIVE_KEYWORDS.some(p => p.test(text));
}
