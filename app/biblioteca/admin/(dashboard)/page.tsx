import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AnalyticsFilters } from '@/components/library/admin/AnalyticsFilters';
import { AdminStatCards, type StatCardData } from '@/components/library/admin/AdminStatCards';
import type { BookStatus } from '@/lib/library/types';

const STATUS_LABEL: Record<BookStatus, string> = {
  published: 'Publicado',
  draft: 'Rascunho',
  processing: 'Processando',
};

const STATUS_CLASSES: Record<BookStatus, string> = {
  published: 'bg-bib-teal/10 text-bib-teal',
  draft: 'bg-bib-navy/5 text-bib-text-light-secondary',
  processing: 'bg-bib-orange/10 text-bib-orange',
};

function StatusBadge({ status }: { status: BookStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; municipality?: string }>;
}) {
  const { program: programFilter, municipality: municipalityFilter } = await searchParams;
  const supabase = await createClient();

  const [{ data: programs }, { data: municipalities }] = await Promise.all([
    supabase.from('library_programs').select('id, name, slug, description, accent_color, cover_image_url, sort_order, created_at').order('sort_order'),
    supabase.from('library_profiles').select('id, role, municipality_name, created_at').eq('role', 'municipality').order('municipality_name'),
  ]);

  let booksQuery = supabase
    .from('library_books')
    .select('id, title, program_id, status, published_at')
    .order('title');
  if (programFilter) booksQuery = booksQuery.eq('program_id', programFilter);
  const { data: books } = await booksQuery;

  const bookIds = (books ?? []).map(b => b.id);

  let logs: { book_id: string; municipality_id: string; opened_at: string }[] = [];
  if (bookIds.length > 0) {
    let logsQuery = supabase
      .from('library_book_access_logs')
      .select('book_id, municipality_id, opened_at')
      .in('book_id', bookIds);
    if (municipalityFilter) logsQuery = logsQuery.eq('municipality_id', municipalityFilter);
    const { data } = await logsQuery;
    logs = data ?? [];
  }

  const programById = new Map((programs ?? []).map(p => [p.id, p]));

  const statsByBook = new Map<
    string,
    { total: number; municipalitySet: Set<string>; lastAccess: string | null }
  >();
  for (const log of logs) {
    const stat = statsByBook.get(log.book_id) ?? { total: 0, municipalitySet: new Set<string>(), lastAccess: null };
    stat.total += 1;
    stat.municipalitySet.add(log.municipality_id);
    if (!stat.lastAccess || log.opened_at > stat.lastAccess) stat.lastAccess = log.opened_at;
    statsByBook.set(log.book_id, stat);
  }

  const rows = (books ?? [])
    .map(book => {
      const stat = statsByBook.get(book.id);
      return {
        ...book,
        programName: programById.get(book.program_id)?.name ?? '—',
        totalAccesses: stat?.total ?? 0,
        municipalityCount: stat?.municipalitySet.size ?? 0,
        lastAccess: stat?.lastAccess ?? null,
      };
    })
    .sort((a, b) => b.totalAccesses - a.totalAccesses);

  const totalAccesses = logs.length;
  const distinctMunicipalitiesActive = new Set(logs.map(l => l.municipality_id)).size;
  const publishedCount = (books ?? []).filter(b => b.status === 'published').length;

  const stats: StatCardData[] = [
    { key: 'book', label: 'Livros publicados', value: publishedCount },
    { key: 'access', label: 'Total de acessos', value: totalAccesses },
    { key: 'municipality', label: 'Municípios ativos', value: distinctMunicipalitiesActive },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-bib-h1 font-bold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Dashboard de Analytics
        </h1>
        <p className="mt-1 text-bib-caption text-bib-text-light-secondary">Acessos por livro e por município.</p>
      </div>

      <AdminStatCards stats={stats} />

      <AnalyticsFilters programs={programs ?? []} municipalities={municipalities ?? []} />

      <div className="rounded-bib-lg border border-bib-border-light bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-bib-gray-bg text-bib-text-light-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Livro</th>
                <th className="text-left px-5 py-3 font-medium">Programa</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Acessos</th>
                <th className="text-right px-5 py-3 font-medium">Municípios</th>
                <th className="text-right px-5 py-3 font-medium">Último acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bib-border-light">
              {rows.map(row => (
                <tr key={row.id} className="group hover:bg-bib-gray-bg/60 transition-colors">
                  <td className="px-5 py-3 text-bib-text-light-primary font-medium">
                    <Link
                      href={`/biblioteca/admin/analytics/${row.id}`}
                      className="inline-flex items-center gap-1 hover:text-bib-blue transition-colors"
                    >
                      {row.title}
                      <ArrowUpRight
                        size={13}
                        aria-hidden="true"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-bib-text-light-secondary">{row.programName}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-bib-text-light-primary">
                    {row.totalAccesses}
                  </td>
                  <td className="px-5 py-3 text-right text-bib-text-light-secondary">{row.municipalityCount}</td>
                  <td className="px-5 py-3 text-right text-bib-text-light-muted text-xs">
                    {row.lastAccess ? new Date(row.lastAccess).toLocaleDateString('pt-BR') : '—'}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-bib-text-light-muted">
                    Nenhum dado para os filtros selecionados.
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
