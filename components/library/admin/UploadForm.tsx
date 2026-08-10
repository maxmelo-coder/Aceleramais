'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, Loader2, Link2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { createBookFromUpload } from '@/app/biblioteca/admin/(dashboard)/upload/actions';
import type { Program } from '@/lib/library/types';

const fieldClasses =
  'w-full px-4 py-2.5 rounded-bib-md text-sm bg-white border border-bib-border-light text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-blue/30 focus:border-transparent transition-shadow';

type Mode = 'pdf' | 'link';

export function UploadForm({ programs }: { programs: Program[] }) {
  const supabase = createClient();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [mode, setMode] = useState<Mode>('pdf');
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const programId = String(formData.get('program_id') || '');
    const title = String(formData.get('title') || '').trim();
    const author = String(formData.get('author') || '').trim();

    if (!programId || !title) {
      setError('Selecione o programa e informe o título.');
      return;
    }

    if (mode === 'link') {
      const externalUrl = String(formData.get('external_url') || '').trim();
      if (!externalUrl) {
        setError('Informe o link do flipbook.');
        return;
      }
      if (!/^https?:\/\//i.test(externalUrl)) {
        setError('O link precisa começar com http:// ou https://.');
        return;
      }

      setStage('saving');
      const actionData = new FormData();
      actionData.set('program_id', programId);
      actionData.set('title', title);
      actionData.set('author', author);
      actionData.set('external_url', externalUrl);

      const result = await createBookFromUpload({ error: null, bookId: null }, actionData);
      setStage('idle');

      if (result.error) {
        setError(result.error);
        return;
      }

      formEl.reset();
      startTransition(() => router.refresh());
      return;
    }

    const fileInput = formEl.elements.namedItem('pdf') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('Selecione um arquivo PDF.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('O arquivo precisa ser um PDF.');
      return;
    }

    setStage('uploading');
    const storagePath = `${crypto.randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('library-book-pdfs')
      .upload(storagePath, file, { contentType: 'application/pdf' });

    if (uploadError) {
      setError(`Falha ao enviar o PDF: ${uploadError.message}`);
      setStage('idle');
      return;
    }

    setStage('saving');
    const actionData = new FormData();
    actionData.set('program_id', programId);
    actionData.set('title', title);
    actionData.set('author', author);
    actionData.set('pdf_storage_path', storagePath);

    const result = await createBookFromUpload({ error: null, bookId: null }, actionData);
    setStage('idle');

    if (result.error) {
      setError(result.error);
      return;
    }

    formEl.reset();
    setFileName(null);
    startTransition(() => router.refresh());
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white rounded-bib-lg border border-bib-border-light p-6 space-y-4 max-w-xl"
    >
      <div>
        <label htmlFor="upload-program" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Programa
        </label>
        <select id="upload-program" name="program_id" required className={fieldClasses}>
          <option value="">Selecione...</option>
          {programs.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="upload-title" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Título
        </label>
        <input id="upload-title" name="title" required className={fieldClasses} />
      </div>

      <div>
        <label htmlFor="upload-author" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Autor (opcional)
        </label>
        <input id="upload-author" name="author" className={fieldClasses} />
      </div>

      <div>
        <span className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">Conteúdo do livro</span>
        <div className="inline-flex rounded-bib-md border border-bib-border-light bg-bib-gray-bg/60 p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('pdf');
              setError(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-bib-sm text-sm font-medium transition-colors ${
              mode === 'pdf' ? 'bg-white text-bib-text-light-primary shadow-sm' : 'text-bib-text-light-muted hover:text-bib-text-light-secondary'
            }`}
          >
            <UploadCloud size={15} />
            Enviar PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('link');
              setError(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-bib-sm text-sm font-medium transition-colors ${
              mode === 'link' ? 'bg-white text-bib-text-light-primary shadow-sm' : 'text-bib-text-light-muted hover:text-bib-text-light-secondary'
            }`}
          >
            <Link2 size={15} />
            Link do flipbook
          </button>
        </div>
      </div>

      {mode === 'pdf' ? (
        <div>
          <label className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">Arquivo PDF</label>
          <label
            htmlFor="pdf-input"
            className="flex items-center gap-3 px-4 py-4 rounded-bib-md border border-dashed border-bib-navy/15 bg-bib-gray-bg/60 cursor-pointer hover:border-bib-blue/50 hover:bg-bib-blue/5 transition-colors"
          >
            {fileName ? (
              <>
                <FileText size={18} className="text-bib-teal shrink-0" />
                <span className="text-sm text-bib-text-light-primary truncate">{fileName}</span>
              </>
            ) : (
              <>
                <UploadCloud size={18} className="text-bib-text-light-muted shrink-0" />
                <span className="text-sm text-bib-text-light-secondary">
                  Clique para selecionar um PDF, ou arraste aqui
                </span>
              </>
            )}
          </label>
          <input
            id="pdf-input"
            name="pdf"
            type="file"
            accept="application/pdf"
            required={mode === 'pdf'}
            className="sr-only"
            onChange={e => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </div>
      ) : (
        <div>
          <label htmlFor="upload-external-url" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
            Link do flipbook
          </label>
          <input
            id="upload-external-url"
            name="external_url"
            type="url"
            required={mode === 'link'}
            placeholder="https://... (ex.: heyzine.com/flip-book/...)"
            className={fieldClasses}
          />
          <p className="text-xs text-bib-text-light-muted mt-1.5">
            O livro é publicado imediatamente com este link — sem conversão de páginas. O município é redirecionado
            direto para ele ao abrir o livro.
          </p>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-bib-md text-sm text-red-700">{error}</div>
      )}

      <button
        type="submit"
        disabled={stage !== 'idle' || isPending}
        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-bib-md bg-bib-orange transition-colors text-sm disabled:opacity-60"
      >
        {stage !== 'idle' && <Loader2 size={16} className="animate-spin" />}
        {mode === 'pdf' && stage === 'uploading' && 'Enviando PDF...'}
        {mode === 'pdf' && stage === 'saving' && 'Iniciando conversão...'}
        {mode === 'pdf' && stage === 'idle' && 'Enviar e converter'}
        {mode === 'link' && stage === 'saving' && 'Publicando link...'}
        {mode === 'link' && stage === 'idle' && 'Publicar link'}
      </button>
    </form>
  );
}
