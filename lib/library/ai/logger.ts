import 'server-only';

interface LogEntry {
  municipality_id: string | undefined;
  mode: string;
  model?: string;
  input_tokens?: number;
  output_tokens?: number;
  was_blocked?: boolean;
  block_reason?: string;
}

// Simple console logger for now — extend to Supabase when needed
export async function logAIUsage(entry: LogEntry): Promise<void> {
  // Non-blocking — never throw
  try {
    console.log('[IA-USAGE]', JSON.stringify({
      ...entry,
      ts: new Date().toISOString(),
    }));
  } catch { /* ignore */ }
}
