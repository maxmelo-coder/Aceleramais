import { createClient } from '@/lib/supabase/server';
import { UploadForm } from '@/components/library/admin/UploadForm';
import { BookStatusList } from '@/components/library/admin/BookStatusList';

export default async function UploadPage() {
  const supabase = await createClient();

  const { data: programs } = await supabase
    .from('library_programs')
    .select('id, name, slug, description, accent_color, cover_image_url, sort_order, created_at')
    .order('sort_order', { ascending: true });

  const { data: books } = await supabase
    .from('library_books')
    .select('id, title, status, conversion_error, total_pages')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-bold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Upload de livro
        </h1>
        <p className="mt-1 text-sm text-bib-text-light-secondary">
          Envie o PDF original — a conversão para flipbook roda em segundo plano.
        </p>
      </div>

      <UploadForm programs={programs ?? []} />

      <div>
        <h2 className="text-sm font-semibold text-bib-text-light-secondary mb-3">Uploads recentes</h2>
        <BookStatusList initialBooks={books ?? []} />
      </div>
    </div>
  );
}
