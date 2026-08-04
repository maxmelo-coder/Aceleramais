import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { FlipbookViewer } from '@/components/library/FlipbookViewer';

export default async function BookReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS já garante que município só enxerga livros com status='published'.
  const { data: book } = await supabase
    .from('library_books')
    .select('id, title, author, total_pages, status, external_url')
    .eq('id', id)
    .single();

  if (!book || book.status !== 'published') notFound();

  // Livros "externos" não têm páginas convertidas localmente — não há leitor
  // interno para eles. Se alguém acessar /ler diretamente (link salvo, etc.),
  // manda de volta para a página de detalhes, que abre o conteúdo externo.
  if (book.external_url) {
    redirect(`/biblioteca/livro/${id}`);
  }

  return (
    // Cancela o padding responsivo do <main> do shell (px-4 sm:px-6 py-8) para
    // o leitor ocupar a largura/altura cheia disponível em qualquer tamanho de tela.
    <div className="-mx-4 sm:-mx-6 -my-8">
      <FlipbookViewer
        bookId={book.id}
        title={book.title}
        totalPages={book.total_pages}
        backHref={`/biblioteca/livro/${book.id}`}
      />
    </div>
  );
}
