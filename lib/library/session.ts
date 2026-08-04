// Um session_id por abertura de livro nesta aba. Sobrevive a F5 (sessionStorage),
// some ao fechar a aba — assim um refresh não conta como "nova abertura" (o
// insert do log usa upsert com ignoreDuplicates + unique(book_id, session_id)
// no banco, então mesmo re-render/duplo-mount em dev não duplica o registro).
export function getOrCreateReadingSessionId(bookId: string): string {
  const key = `eleva-book-session-${bookId}`;
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(key, sessionId);
  return sessionId;
}
