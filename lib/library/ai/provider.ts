import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import type { AIRequest, AIResponse } from './types';
import { buildSystemPrompt } from './prompts';
import { checkGuardrails } from './guardrails';
import { redactSensitiveData } from './redactor';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.IA_ELEVA_MODEL ?? 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 2048;

export async function runAI(request: AIRequest): Promise<AIResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      content: '⚠️ A IA Eleva+ ainda não está configurada neste ambiente. O administrador precisa adicionar a variável de ambiente `ANTHROPIC_API_KEY` no Vercel.',
      wasBlocked: false,
    };
  }

  // Guardrails check
  const guard = checkGuardrails(request);
  if (guard.blocked) {
    return { content: guard.reason!, wasBlocked: true, blockReason: guard.reason };
  }

  // Redact sensitive data from the last user message
  const messages = request.messages.map((m, i) => {
    if (m.role === 'user' && i === request.messages.length - 1) {
      const { redacted } = redactSensitiveData(m.content);
      return { role: m.role as 'user', content: redacted };
    }
    return { role: m.role as 'user' | 'assistant', content: m.content };
  });

  const systemPrompt = buildSystemPrompt(request.mode);

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return { content };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[IA Eleva+] Anthropic error:', msg, error);
    throw new Error(`AI provider error: ${msg}`);
  }
}
