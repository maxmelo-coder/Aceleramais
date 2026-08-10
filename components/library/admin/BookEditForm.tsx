'use client';

import { useActionState, useState } from 'react';
import { Loader2, Trash2, ImageOff } from 'lucide-react';
import { updateAndPublishBook, deleteBook, type BookEditState } from '@/app/biblioteca/admin/(dashboard)/livros/[id]/actions';
import type { Book, Program } from '@/lib/library/types';

const initialState: BookEditState = { error: null, success: false };

const fieldClasses =
  'w-full px-4 py-2.5 rounded-bib-md text-sm bg-white border border-bib-border-light text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-blue/30 focus:border-transparent transition-shadow';

export function BookEditForm({ book, programs }: { book: Book; programs: Program[] }) {
  const boundAction = updateAndPublishBook.bind(null, book.id);
  const [state, formAction, pending] = useActionState(boundAction, initialState);
  const [pendingPublish, setPendingPublish] = useState(false);

  return (
    <form action={formAction} className="bg-white rounded-bib-lg border border-bib-border-light p-6 space-y-4 max-w-xl">
      <div>
        <label htmlFor="book-program" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Programa
        </label>
        <select id="book-program" name="program_id" defaultValue={book.program_id} required className={fieldClasses}>
          {programs.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="book-title" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Título
        </label>
        <input id="book-title" name="title" defaultValue={book.title} required className={fieldClasses} />
      </div>

      <div>
        <label htmlFor="book-author" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Autor
        </label>
        <input id="book-author" name="author" defaultValue={book.author ?? ''} className={fieldClasses} />
      </div>

      <div>
        <label htmlFor="book-cover" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Capa
        </label>
        {book.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL remota (Supabase Storage) sem domínio configurado em next.config
          <img
            src={book.cover_image_url}
            alt="Capa"
            className="w-24 h-32 object-cover rounded-bib-sm border border-bib-border-light mb-2 bg-bib-gray-bg"
          />
        ) : (
          <div
            className="w-24 h-32 flex items-center justify-center rounded-bib-sm border border-dashed border-bib-navy/15 mb-2 bg-bib-gray-bg text-bib-text-light-muted"
            aria-hidden="true"
          >
            <ImageOff size={20} />
          </div>
        )}
        <input
          id="book-cover"
          name="cover_image_url"
          defaultValue={book.cover_image_url ?? ''}
          placeholder="URL da imagem de capa (gerada automaticamente da 1ª página)"
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="book-external-url" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Link externo (opcional)
        </label>
        <input
          id="book-external-url"
          name="external_url"
          type="url"
          defaultValue={book.external_url ?? ''}
          placeholder="https://... (ex.: flipbook hospedado no Heyzine)"
          className={fieldClasses}
        />
        <p className="text-xs text-bib-text-light-muted mt-1">
          Se preenchido, o município é redirecionado direto para este link ao abrir o livro, em vez de ler as páginas convertidas aqui.
        </p>
      </div>

      <p className="text-xs text-bib-text-light-muted">
        {book.external_url ? 'Livro externo (sem páginas convertidas nesta plataforma).' : `${book.total_pages} páginas convertidas.`}
      </p>

      {state.error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-bib-md text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.success && !state.error && (
        <div className="px-4 py-3 bg-bib-teal/10 border border-bib-teal/30 rounded-bib-md text-sm text-bib-teal">
          Salvo com sucesso.
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          name="publish"
          value="false"
          disabled={pending}
          className="px-5 py-2.5 rounded-bib-md text-sm font-semibold border border-bib-border-light text-bib-text-light-secondary hover:bg-bib-gray-bg transition-colors disabled:opacity-60"
        >
          Salvar rascunho
        </button>
        <button
          type="submit"
          name="publish"
          value="true"
          disabled={pending || (book.total_pages === 0 && !book.external_url)}
          onClick={() => setPendingPublish(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-bib-md text-sm font-semibold text-white bg-bib-orange transition-colors disabled:opacity-60"
        >
          {pending && pendingPublish && <Loader2 size={14} className="animate-spin" />}
          {pending && pendingPublish ? 'Publicando...' : book.status === 'published' ? 'Republicar' : 'Publicar'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm('Excluir este livro permanentemente?')) deleteBook(book.id);
          }}
          className="ml-auto flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={14} />
          Excluir
        </button>
      </div>
    </form>
  );
}
