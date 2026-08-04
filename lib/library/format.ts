/**
 * Formata uma data ISO em texto relativo curto, em português — usado para
 * "Aberto há 2 dias" na seção "Continuar leitura". Implementação simples e
 * sem dependência nova (o projeto não tem date-fns/dayjs instalado e o caso
 * de uso não justifica adicionar uma).
 */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return 'agora há pouco';
  if (minutes < 60) return `há ${minutes} min`;
  if (hours < 24) return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (days === 1) return 'ontem';
  if (days < 7) return `há ${days} dias`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(days / 365);
  return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

/**
 * Formata uma data ISO como data absoluta por extenso em pt-BR (ex.: "12 de
 * março de 2025") — usado na página de detalhes do livro ("Publicado em ...").
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}
