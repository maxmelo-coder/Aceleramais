'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { BookCard } from '@/components/library/BookCard';

interface ProgramBook {
  id: string;
  title: string;
  author: string | null;
  cover_image_url: string | null;
}

interface ProgramBookGridProps {
  books: ProgramBook[];
  accentColor: string;
}

/**
 * Grade de livros de um programa, com filtro local por título/autor. O
 * filtro é só client-side sobre os livros já carregados (mesma consulta com
 * RLS de sempre) — não substitui nem contorna a busca global do cabeçalho.
 */
export function ProgramBookGrid({ books, accentColor }: ProgramBookGridProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      b => b.title.toLowerCase().includes(q) || (b.author ?? '').toLowerCase().includes(q),
    );
  }, [books, query]);

  if (books.length === 0) {
    return <p className="mt-8 text-sm text-bib-text-light-muted">Nenhum livro publicado neste programa ainda.</p>;
  }

  return (
    <div>
      {books.length > 6 && (
        <div className="mt-6 relative max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-bib-text-light-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filtrar por título ou autor…"
            aria-label="Filtrar livros deste programa por título ou autor"
            className="w-full pl-9 pr-8 py-2 rounded-bib-md text-sm bg-white border border-bib-border-light text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-teal/40 focus:border-bib-teal/40 transition-shadow"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-bib-text-light-muted hover:text-bib-text-light-primary"
              aria-label="Limpar filtro"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-bib-text-light-muted">
          Nenhum livro encontrado para &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map(book => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              coverUrl={book.cover_image_url}
              accentColor={accentColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
