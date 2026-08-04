import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function BookAnalyticsPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const supabase = await createClient();

  const { data: book } = await supabase
    .from('library_books')
    .select('id, title')
    .eq('id', bookId)
    .single();
  if (!book) notFound();

  const { data: logs } = await supabase
    .from('library_book_access_logs')
    .select('municipality_id, opened_at')
    .eq('book_id', bookId)
    .order('opened_at', { ascending: true });

  const { data: municipalities } = await supabase
    .from('library_profiles')
    .select('id, municipality_name')
    .eq('role', 'municipality');
  const municipalityById = new Map((municipalities ?? []).map(m => [m.id, m.municipality_name]));

  const accessesByMunicipality = new Map<string, number>();
  const accessesByDay = new Map<string, number>();
  for (const log of logs ?? []) {
    accessesByMunicipality.set(log.municipality_id, (accessesByMunicipality.get(log.municipality_id) ?? 0) + 1);
    const day = log.opened_at.slice(0, 10);
    accessesByDay.set(day, (accessesByDay.get(day) ?? 0) + 1);
  }

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  const maxDayCount = Math.max(1, ...last30Days.map(d => accessesByDay.get(d) ?? 0));

  return (
    <div>
      <Link
        href="/biblioteca/admin"
        className="inline-flex items-center gap-1.5 text-sm text-bib-text-light-muted hover:text-bib-text-light-primary transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Voltar ao dashboard
      </Link>
      <h1
        className="mt-2 text-2xl font-bold text-bib-text-light-primary"
        style={{ fontFamily: 'var(--font-bib-display)' }}
      >
        {book.title}
      </h1>
      <p className="text-sm text-bib-text-light-secondary">{(logs ?? []).length} acessos no total</p>

      <div className="mt-8 rounded-bib-lg border border-bib-border-light bg-white p-6">
        <h2 className="text-sm font-semibold text-bib-text-light-secondary mb-4">Evolução — últimos 30 dias</h2>
        <div className="flex items-end gap-1 h-32">
          {last30Days.map(day => {
            const count = accessesByDay.get(day) ?? 0;
            const heightPct = (count / maxDayCount) * 100;
            return (
              <div
                key={day}
                title={`${day}: ${count} acesso(s)`}
                className="flex-1 rounded-t transition-colors"
                style={{
                  height: `${Math.max(heightPct, count > 0 ? 4 : 1)}%`,
                  background: count > 0 ? 'linear-gradient(180deg, #13A4CC, #009CA4)' : '#E5E7EB',
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-bib-lg border border-bib-border-light bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bib-gray-bg text-bib-text-light-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Município</th>
                <th className="text-right px-5 py-3 font-medium">Acessos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bib-border-light">
              {Array.from(accessesByMunicipality.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([municipalityId, count]) => (
                  <tr key={municipalityId} className="hover:bg-bib-gray-bg/60 transition-colors">
                    <td className="px-5 py-3 text-bib-text-light-primary font-medium">
                      {municipalityById.get(municipalityId) ?? 'Admin (preview)'}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-bib-text-light-primary">{count}</td>
                  </tr>
                ))}
              {accessesByMunicipality.size === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-8 text-center text-bib-text-light-muted">
                    Nenhum acesso registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
