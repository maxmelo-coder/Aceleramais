import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BookEditForm } from '@/components/library/admin/BookEditForm';

export default async function BookEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: book } = await supabase
    .from('library_books')
    .select('id, program_id, title, author, cover_image_url, total_pages, status, conversion_error, created_at, published_at, external_url')
    .eq('id', id)
    .single();

  if (!book) notFound();

  const { data: programs } = await supabase
    .from('library_programs')
    .select('id, name, slug, description, accent_color, cover_image_url, sort_order, created_at')
    .order('sort_order', { ascending: true });

  return (
    <div>
      <Link
        href="/biblioteca/admin/upload"
        className="inline-flex items-center gap-1.5 text-sm text-bib-text-light-muted hover:text-bib-text-light-primary transition-colors"
      >
        <ArrowLeft size={14} />
        Voltar
      </Link>
      <h1
        className="mt-2 text-2xl font-bold text-bib-text-light-primary"
        style={{ fontFamily: 'var(--font-bib-display)' }}
      >
        Revisar livro
      </h1>
      {book.conversion_error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-bib-md text-sm text-red-700 max-w-xl">
          Erro na conversão: {book.conversion_error}. Exclua e reenvie o PDF.
        </div>
      )}
      <div className="mt-6">
        <BookEditForm book={book} programs={programs ?? []} />
      </div>
    </div>
  );
}
