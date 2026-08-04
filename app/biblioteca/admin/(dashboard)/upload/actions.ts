'use server';

import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { convertBookPdf } from '@/lib/library/pdf-conversion';

export interface CreateBookState {
  error: string | null;
  bookId: string | null;
}

// O PDF em si já foi enviado direto do navegador para o Storage (bucket
// library-book-pdfs) usando o client do navegador — isso evita o limite de
// tamanho de payload das funções serverless da Vercel. Aqui só tratamos metadados.
export async function createBookFromUpload(
  _prevState: CreateBookState,
  formData: FormData,
): Promise<CreateBookState> {
  const programId = String(formData.get('program_id') || '');
  const title = String(formData.get('title') || '').trim();
  const author = String(formData.get('author') || '').trim() || null;
  const pdfStoragePath = String(formData.get('pdf_storage_path') || '').trim();
  const externalUrl = String(formData.get('external_url') || '').trim();

  if (!programId || !title) {
    return { error: 'Selecione o programa e informe o título.', bookId: null };
  }
  if (!pdfStoragePath && !externalUrl) {
    return { error: 'Envie um PDF ou informe o link do flipbook.', bookId: null };
  }

  const supabase = await createClient();

  // Livro por link externo (ex.: flipbook já hospedado no Heyzine) — não há
  // conversão a fazer, então o livro já entra publicado, igual ao fluxo usado
  // manualmente para o primeiro livro cadastrado.
  if (externalUrl) {
    const { data: book, error } = await supabase
      .from('library_books')
      .insert({
        program_id: programId,
        title,
        author,
        external_url: externalUrl,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error || !book) {
      return { error: `Falha ao criar o livro: ${error?.message ?? 'erro desconhecido'}`, bookId: null };
    }

    return { error: null, bookId: book.id };
  }

  const { data: book, error } = await supabase
    .from('library_books')
    .insert({
      program_id: programId,
      title,
      author,
      original_pdf_path: pdfStoragePath,
      status: 'processing',
    })
    .select('id')
    .single();

  if (error || !book) {
    return { error: `Falha ao criar o livro: ${error?.message ?? 'erro desconhecido'}`, bookId: null };
  }

  // Roda após a resposta ser enviada — não trava a requisição com PDFs grandes/lentos.
  after(() => convertBookPdf(book.id));

  return { error: null, bookId: book.id };
}
