import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BookCard } from '@/components/library/BookCard';
import { formatRelativeTime } from '@/lib/library/format';
import { BookOpen, ArrowRight } from 'lucide-react';

export default async function LibraryHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from('library_profiles').select('municipality_name').eq('id', user.id).single()
    : { data: null };

  const { data: programs } = await supabase
    .from('library_programs')
    .select('id, name, slug, description, accent_color')
    .order('sort_order', { ascending: true });

  const { data: books } = await supabase
    .from('library_books')
    .select('id, program_id, title, author, cover_image_url, published_at')
    .eq('status', 'published');

  const { data: accessLogs } = user
    ? await supabase
        .from('library_book_access_logs')
        .select('book_id, opened_at')
        .eq('municipality_id', user.id)
        .order('opened_at', { ascending: false })
        .limit(30)
    : { data: null };

  const programsById = new Map((programs ?? []).map(p => [p.id, p]));
  const booksById = new Map((books ?? []).map(b => [b.id, b]));

  const countsByProgram = new Map<string, number>();
  for (const book of books ?? []) {
    countsByProgram.set(book.program_id, (countsByProgram.get(book.program_id) ?? 0) + 1);
  }

  // "Continuar leitura" — só livros que este município de fato abriu, e que
  // ainda estão publicados. Sem progresso de página (não é rastreado), só a
  // indicação de quando foi aberto pela última vez.
  const seenBooks = new Set<string>();
  const continueReading: { book: NonNullable<typeof books>[number]; lastOpened: string }[] = [];
  for (const log of accessLogs ?? []) {
    if (seenBooks.has(log.book_id)) continue;
    const book = booksById.get(log.book_id);
    if (!book) continue;
    seenBooks.add(log.book_id);
    continueReading.push({ book, lastOpened: log.opened_at });
    if (continueReading.length >= 6) break;
  }

  // "Novidades" — livros publicados mais recentemente, entre os disponíveis.
  const newest = (books ?? [])
    .filter(b => b.published_at)
    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())
    .slice(0, 6);

  const greetingName = profile?.municipality_name || 'Administrador';
  const totalBooks = (books ?? []).length;
  const totalPrograms = (programs ?? []).length;

  return (
    <div className="space-y-12">
      {/* Boas-vindas — header compacto e editorial, sem hero navy oversized. */}
      <header className="pb-6 border-b border-bib-border-light">
        <p className="text-bib-micro font-semibold uppercase tracking-bib-wide text-bib-teal">
          Biblioteca Digital Acelera+
        </p>
        <h1
          className="mt-1.5 text-bib-display font-bold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Olá, {greetingName}
        </h1>
        <p className="mt-2 text-bib-body text-bib-text-light-secondary max-w-md">
          Bem-vindo ao acervo digital disponibilizado para a sua rede municipal de educação.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-bib-micro text-bib-text-light-muted">
          <span>{totalPrograms} {totalPrograms === 1 ? 'programa' : 'programas'}</span>
          <span>{totalBooks} {totalBooks === 1 ? 'livro disponível' : 'livros disponíveis'}</span>
        </div>
      </header>

      {/* Continuar leitura — só aparece com histórico real de leitura */}
      {continueReading.length > 0 && (
        <section>
          <h2
            className="text-bib-h2 font-bold text-bib-text-light-primary"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            Continuar leitura
          </h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
            {continueReading.map(({ book, lastOpened }) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                coverUrl={book.cover_image_url}
                accentColor={programsById.get(book.program_id)?.accent_color}
                meta={`Aberto ${formatRelativeTime(lastOpened)}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Novidades — só aparece se houver livros publicados */}
      {newest.length > 0 && (
        <section>
          <h2
            className="text-bib-h2 font-bold text-bib-text-light-primary"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            Novidades
          </h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
            {newest.map(book => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                coverUrl={book.cover_image_url}
                accentColor={programsById.get(book.program_id)?.accent_color}
                meta={programsById.get(book.program_id)?.name}
              />
            ))}
          </div>
        </section>
      )}

      {/* Explorar por programa */}
      <section>
        <h2
          className="text-bib-h2 font-bold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Explorar por programa
        </h2>
        <p className="mt-1 text-bib-caption text-bib-text-light-muted">
          Selecione uma prateleira para ver os livros disponíveis.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(programs ?? []).map(program => {
            const count = countsByProgram.get(program.id) ?? 0;
            const accent = program.accent_color || '#009CA4';
            return (
              <Link
                key={program.id}
                href={`/biblioteca/programa/${program.slug}`}
                className="group bg-white rounded-bib-md border border-bib-border-light p-6 shadow-sm hover:shadow-bib-glass hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bib-teal/50"
              >
                <div
                  className="w-12 h-12 rounded-bib-sm flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                >
                  <BookOpen size={20} />
                </div>
                <h3
                  className="mt-4 text-bib-h3 font-bold text-bib-text-light-primary group-hover:underline"
                  style={{ fontFamily: 'var(--font-bib-display)' }}
                >
                  {program.name}
                </h3>
                {program.description && (
                  <p className="mt-1 text-bib-caption text-bib-text-light-muted line-clamp-2">{program.description}</p>
                )}
                <p className="mt-4 flex items-center gap-1 text-bib-micro font-medium text-bib-text-light-muted">
                  {count} {count === 1 ? 'livro disponível' : 'livros disponíveis'}
                  <ArrowRight
                    size={12}
                    aria-hidden="true"
                    className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                  />
                </p>
              </Link>
            );
          })}
        </div>

        {(programs ?? []).length === 0 && (
          <p className="mt-8 text-sm text-bib-text-light-muted">Nenhum programa cadastrado ainda.</p>
        )}
      </section>
    </div>
  );
}
