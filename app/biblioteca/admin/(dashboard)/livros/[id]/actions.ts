'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface BookEditState {
  error: string | null;
  success: boolean;
}

export async function updateAndPublishBook(
  bookId: string,
  _prevState: BookEditState,
  formData: FormData,
): Promise<BookEditState> {
  const supabase = await createClient();

  const title = String(formData.get('title') || '').trim();
  const author = String(formData.get('author') || '').trim() || null;
  const programId = String(formData.get('program_id') || '');
  const coverImageUrl = String(formData.get('cover_image_url') || '').trim() || null;
  const externalUrl = String(formData.get('external_url') || '').trim() || null;
  const publish = formData.get('publish') === 'true';

  if (!title || !programId) {
    return { error: 'Título e programa são obrigatórios.', success: false };
  }

  if (publish) {
    // Validação explícita de título duplicado dentro do mesmo programa antes de publicar
    // (o índice único no banco é o backstop, esta checagem é só para uma mensagem amigável).
    const { data: duplicate } = await supabase
      .from('library_books')
      .select('id')
      .eq('program_id', programId)
      .eq('status', 'published')
      .neq('id', bookId)
      .ilike('title', title)
      .maybeSingle();

    if (duplicate) {
      return {
        error: 'Já existe um livro publicado com este título neste programa. Escolha outro título.',
        success: false,
      };
    }
  }

  const update: Record<string, unknown> = {
    title,
    author,
    program_id: programId,
    cover_image_url: coverImageUrl,
    external_url: externalUrl,
  };
  if (publish) {
    update.status = 'published';
    update.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from('library_books').update(update).eq('id', bookId);
  if (error) {
    return { error: `Falha ao salvar: ${error.message}`, success: false };
  }

  revalidatePath('/biblioteca/admin/upload');
  revalidatePath(`/biblioteca/admin/livros/${bookId}`);
  return { error: null, success: true };
}

export async function deleteBook(bookId: string) {
  const supabase = await createClient();
  await supabase.from('library_books').delete().eq('id', bookId);
  revalidatePath('/biblioteca/admin/upload');
  redirect('/biblioteca/admin/upload');
}
