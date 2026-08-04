import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BookDetailCover } from '@/components/library/BookDetailCover';
import { formatDate } from '@/lib/library/format';

/**
 * Página de detalhes do livro (pré-leitura) — mostra capa, título, autor,
 * programa/coleção e metadados reais antes de abrir o leitor. Só usa dados
 * de fato armazenados (sem descrição/editora fictícias, campos que não
 * existem em library_books). O leitor em si vive em /livro/[id]/ler.
 */
export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS já garante que município só enxerga livros com status='published'.
  const { data: book } = await supabase
    .from('library_books')
    .select('id, title, author, cover_image_url, total_pages, status, external_url, published_at, program_id')
    .eq('id', id)
    .single();

  if (!book || book.status !== 'published') notFound();

  const { data: program } = await supabase
    .from('library_programs')
    .select('name, slug, accent_color')
    .eq('id', book.program_id)
    .single();

  const accent = program?.accent_color || '#009CA4';
  const isExternal = Boolean(book.external_url);

  return (
    <div>
      <Link
        href={program ? `/biblioteca/programa/${program.slug}` : '/biblioteca'}
        className="inline-flex items-center gap-1.5 text-sm text-bib-text-light-muted hover:text-bib-text-light-primary transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Voltar {program ? `para ${program.name}` : 'para a biblioteca'}
      </Link>

      <div className="mt-6 grid md:grid-cols-[260px_1fr] gap-8 md:gap-10 items-start">
        <BookDetailCover title={book.title} coverUrl={book.cover_image_url} accentColor={accent} />

        <div className="text-center md:text-left">
          {program && (
            <Link
              href={`/biblioteca/programa/${program.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
              style={{ backgroundColor: `${accent}1A`, color: accent }}
            >
              {program.name}
            </Link>
          )}

          <h1
            className="mt-3 text-2xl sm:text-3xl font-bold text-bib-text-light-primary"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            {book.title}
          </h1>
          {book.author && <p className="mt-1.5 text-base text-bib-text-light-muted">{book.author}</p>}

          <dl className="mt-5 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-bib-text-light-muted">
            {book.total_pages > 0 && !isExternal && (
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} aria-hidden="true" />
                <span>
                  {book.total_pages} {book.total_pages === 1 ? 'página' : 'páginas'}
                </span>
              </div>
            )}
            {book.published_at && <span>Publicado em {formatDate(book.published_at)}</span>}
            {isExternal && <span>Conteúdo externo</span>}
          </dl>

          <div className="mt-7">
            {isExternal ? (
              <a
                href={book.external_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-bib-md text-sm font-semibold text-white shadow-sm hover:shadow-bib-glass transition-shadow"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)` }}
              >
                Abrir conteúdo
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            ) : (
              <Link
                href={`/biblioteca/livro/${book.id}/ler`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-bib-md text-sm font-semibold text-white shadow-sm hover:shadow-bib-glass transition-shadow"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)` }}
              >
                Ler agora
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
