import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runAI, logAIUsage } from '@/lib/library/ai';
import type { AIRequest } from '@/lib/library/ai';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let body: AIRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  if (!body.mode || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: 'Campos obrigatórios: mode, messages' }, { status: 400 });
  }

  // Limit message history to prevent abuse
  if (body.messages.length > 40) {
    body.messages = body.messages.slice(-40);
  }

  try {
    const result = await runAI({ ...body, municipalityId: user.id });

    await logAIUsage({
      municipality_id: user.id,
      mode: body.mode,
      was_blocked: result.wasBlocked,
      block_reason: result.blockReason,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
