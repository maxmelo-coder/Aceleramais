import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    keyLength: process.env.ANTHROPIC_API_KEY?.length ?? 0,
    testVar: process.env.ELEVA_TEST_VAR ?? 'not-set',
    nodeEnv: process.env.NODE_ENV,
  });
}
