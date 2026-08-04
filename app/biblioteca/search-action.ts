'use server';

import { createClient } from '@/lib/supabase/server';

export interface BookSearchResult {
  id: string;
  title: string;
  author: string | null;
  cover_image_url: string | null;
}

// Busca global do cabeçalho municipal — pesquisa por título ou autor entre os
// livros publicados. Usa o mesmo client Supabase (com RLS) das demais páginas
// da biblioteca, então só retorna o que o município autenticado já pode ver;
// nenhuma regra de acesso é contornada ou duplicada aqui.
export async function searchLibraryBooks(query: string): Promise<BookSearchResult[]> {
  const trimmed = query.trim().replace(/[%,]/g, '');
  if (trimmed.length < 2) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('library_books')
    .select('id, title, author, cover_image_url')
    .eq('status', 'published')
    .or(`title.ilike.%${trimmed}%,author.ilike.%${trimmed}%`)
    .order('title', { ascending: true })
    .limit(8);

  return data ?? [];
}
