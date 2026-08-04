'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle2, FileEdit, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Row {
  id: string;
  title: string;
  status: 'processing' | 'published' | 'draft';
  conversion_error: string | null;
  total_pages: number;
}

const STATUS_LABEL: Record<Row['status'], string> = {
  processing: 'Convertendo...',
  draft: 'Rascunho',
  published: 'Publicado',
};

const STATUS_CLASSES: Record<Row['status'], string> = {
  published: 'bg-bib-teal/10 text-bib-teal',
  draft: 'bg-bib-navy/5 text-bib-text-light-secondary',
  processing: 'bg-bib-orange/10 text-bib-orange',
};

const STATUS_ICON: Record<Row['status'], typeof CheckCircle2> = {
  published: CheckCircle2,
  draft: FileEdit,
  processing: Loader2,
};

function StatusBadge({ status }: { status: Row['status'] }) {
  const Icon = STATUS_ICON[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CLASSES[status]}`}
    >
      <Icon size={12} aria-hidden="true" className={status === 'processing' ? 'animate-spin' : ''} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function BookStatusList({ initialBooks }: { initialBooks: Row[] }) {
  const [books, setBooks] = useState(initialBooks);
  const supabase = createClient();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const hasProcessing = books.some(b => b.status === 'processing');
    if (!hasProcessing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(async () => {
      const { data } = await supabase
        .from('library_books')
        .select('id, title, status, conversion_error, total_pages')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setBooks(data as Row[]);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [books, supabase]);

  return (
    <div className="rounded-bib-lg border border-bib-border-light bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bib-gray-bg text-bib-text-light-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Título</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Páginas</th>
              <th className="text-right px-5 py-3 font-medium">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bib-border-light">
            {books.map(book => (
              <tr key={book.id} className="group hover:bg-bib-gray-bg/60 transition-colors">
                <td className="px-5 py-3 text-bib-text-light-primary font-medium">{book.title}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={book.status} />
                  {book.conversion_error && (
                    <p className="text-xs text-red-500 mt-1 max-w-xs">{book.conversion_error}</p>
                  )}
                </td>
                <td className="px-5 py-3 text-bib-text-light-secondary">{book.total_pages || '—'}</td>
                <td className="px-5 py-3 text-right">
                  {book.status !== 'processing' && (
                    <Link
                      href={`/biblioteca/admin/livros/${book.id}`}
                      className="inline-flex items-center gap-1 text-bib-teal hover:text-bib-blue font-medium transition-colors"
                    >
                      {book.status === 'published' ? 'Editar' : 'Revisar e publicar'}
                      <ArrowUpRight size={13} aria-hidden="true" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-bib-text-light-muted">
                  Nenhum livro enviado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
