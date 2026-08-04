'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getOrCreateReadingSessionId } from '@/lib/library/session';
import { usePrefersReducedMotion } from '@/lib/library/use-prefers-reduced-motion';
import type { BookPage } from '@/lib/library/types';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false }) as any;

const SIGNED_URL_TTL_SECONDS = 600; // 10 min
const URL_REFRESH_THRESHOLD_MS = 4 * 60 * 1000; // renova se cache tiver mais de 4 min
const PRELOAD_AHEAD = 2;

interface CachedUrl {
  url: string;
  fetchedAt: number;
}

export function FlipbookViewer({
  bookId,
  title,
  totalPages,
  backHref,
}: {
  bookId: string;
  title: string;
  totalPages: number;
  /** Link de volta para a página de detalhes do livro. */
  backHref: string;
}) {
  const supabase = createClient();
  const reducedMotion = usePrefersReducedMotion();
  const [pages, setPages] = useState<BookPage[]>([]);
  const [urlCache, setUrlCache] = useState<Record<number, CachedUrl>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flipRef = useRef<any>(null);
  const fetchingRef = useRef<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Carrega o registro de páginas do livro (RLS já garante que só livros
  // publicados são visíveis) e registra 1 log de acesso por sessão de leitura.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { data } = await supabase
        .from('library_book_pages')
        .select('id, book_id, page_number, image_path')
        .eq('book_id', bookId)
        .order('page_number', { ascending: true });

      if (!cancelled) {
        setPages(data ?? []);
        setLoading(false);
      }

      const sessionId = getOrCreateReadingSessionId(bookId);
      await supabase
        .from('library_book_access_logs')
        .upsert(
          { book_id: bookId, municipality_id: (await supabase.auth.getUser()).data.user?.id, session_id: sessionId },
          { onConflict: 'book_id,session_id', ignoreDuplicates: true },
        );
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [bookId, supabase]);

  const ensureSignedUrl = useCallback(
    async (pageNumber: number) => {
      const page = pages.find(p => p.page_number === pageNumber);
      if (!page) return;

      const cached = urlCache[pageNumber];
      if (cached && Date.now() - cached.fetchedAt < URL_REFRESH_THRESHOLD_MS) return;
      if (fetchingRef.current.has(pageNumber)) return;

      fetchingRef.current.add(pageNumber);
      const { data } = await supabase.storage
        .from('library-book-pages')
        .createSignedUrl(page.image_path, SIGNED_URL_TTL_SECONDS);
      fetchingRef.current.delete(pageNumber);

      if (data?.signedUrl) {
        setUrlCache(prev => ({
          ...prev,
          [pageNumber]: { url: data.signedUrl, fetchedAt: Date.now() },
        }));
      }
    },
    [pages, urlCache, supabase],
  );

  // Pré-busca a página atual e as próximas (sob demanda, nunca todas de uma vez).
  useEffect(() => {
    if (pages.length === 0) return;
    for (let i = currentPage; i <= Math.min(currentPage + PRELOAD_AHEAD, totalPages - 1); i++) {
      ensureSignedUrl(i + 1);
    }
  }, [currentPage, pages, totalPages, ensureSignedUrl]);

  // Estado da página atual sobrevive a F5 via query param.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = parseInt(params.get('p') || '0', 10);
    if (!Number.isNaN(initial) && initial > 0 && initial < totalPages) {
      setCurrentPage(initial);
      // O flipbook inicia direto na página certa via prop startPage.
    }
  }, [totalPages]);

  function handleFlip(e: any) {
    const page = e.data as number;
    setCurrentPage(page);
    const url = new URL(window.location.href);
    url.searchParams.set('p', String(page));
    window.history.replaceState({}, '', url);
  }

  const goPrev = useCallback(() => {
    flipRef.current?.pageFlip?.()?.flipPrev();
  }, []);
  const goNext = useCallback(() => {
    flipRef.current?.pageFlip?.()?.flipNext();
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {
        // Tela cheia pode ser bloqueada pelo navegador (ex.: iOS Safari) — silenciosamente ignora.
      });
    }
  }, []);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Atalhos de teclado: setas para navegar entre páginas, F para tela cheia.
  // Ignorados quando o foco está em um campo de formulário (não há nenhum
  // nesta página hoje, mas é uma proteção barata para o futuro).
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) return;

      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, toggleFullscreen]);

  // Estado de carregamento — esqueleto no formato do livro, sem "pulos" de layout.
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-[#072441]">
        <div className="w-[240px] sm:w-[380px] aspect-[3/4] rounded-lg bg-white/10 animate-pulse" />
        <p className="text-white/40 text-xs">Carregando o livro…</p>
      </div>
    );
  }

  // Estado de erro claro — livro publicado mas sem páginas convertidas
  // disponíveis (ex.: falha de conversão). Não tenta renderizar um leitor vazio.
  if (pages.length === 0 || totalPages === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 text-center px-6 bg-[#072441]">
        <p className="text-white/70 text-sm font-medium">{title}</p>
        <p className="text-white/50 text-sm max-w-sm">
          Não foi possível carregar as páginas deste conteúdo agora. Tente novamente mais tarde ou avise o suporte.
        </p>
        <Link href={backHref} className="mt-2 text-xs font-medium text-white underline underline-offset-2">
          Voltar para os detalhes
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-[80vh] flex flex-col items-center justify-center bg-[#072441] py-6 select-none"
      onContextMenu={e => e.preventDefault()}
    >
      <div className="w-full max-w-3xl px-4 sm:px-6 flex items-center justify-between gap-3 mb-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span className="hidden sm:inline">Voltar</span>
        </Link>
        <h1 className="text-white/70 text-sm font-medium truncate text-center flex-1">{title}</h1>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded p-1"
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Ver em tela cheia'}
          title={isFullscreen ? 'Sair da tela cheia (F)' : 'Tela cheia (F)'}
        >
          {isFullscreen ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentPage <= 0}
          aria-label="Página anterior"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-0 disabled:pointer-events-none text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={currentPage >= totalPages - 1}
          aria-label="Próxima página"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-0 disabled:pointer-events-none text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>

        <HTMLFlipBook
          ref={flipRef}
          width={420}
          height={594}
          size="stretch"
          minWidth={280}
          maxWidth={720}
          minHeight={396}
          maxHeight={1018}
          showCover={true}
          startPage={currentPage}
          drawShadow
          flippingTime={reducedMotion ? 1 : 500}
          usePortrait
          startZIndex={0}
          autoSize
          maxShadowOpacity={0.5}
          mobileScrollSupport
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
          className="eleva-flipbook"
          style={{}}
          onFlip={handleFlip}
        >
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNumber = idx + 1;
            const cached = urlCache[pageNumber];
            return (
              <div
                key={pageNumber}
                className="relative bg-white flex items-center justify-center overflow-hidden"
              >
                {cached ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cached.url}
                    alt={`Página ${pageNumber}`}
                    draggable={false}
                    onDragStart={e => e.preventDefault()}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="text-gray-300 text-xs">Página {pageNumber}</div>
                )}
                {/* Marca d'água discreta — trocar pelo ícone Eleva+ oficial quando disponível */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="text-black/5 text-3xl font-black -rotate-45 select-none">
                    Eleva+
                  </span>
                </div>
              </div>
            );
          })}
        </HTMLFlipBook>
      </div>

      <p className="mt-4 text-white/40 text-xs" aria-live="polite">
        Página {currentPage + 1} de {totalPages}
      </p>
    </div>
  );
}
