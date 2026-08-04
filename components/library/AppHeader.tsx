'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, LogOut, BookOpen } from 'lucide-react';
import { ElevaWordmark } from '@/components/library/ElevaWordmark';
import { usePrefersReducedMotion } from '@/lib/library/use-prefers-reduced-motion';
import { useFocusTrap } from '@/lib/library/use-focus-trap';
import { searchLibraryBooks, type BookSearchResult } from '@/app/biblioteca/search-action';

interface NavProgram {
  id: string;
  name: string;
  slug: string;
  accent_color: string | null;
}

interface AppHeaderProps {
  programs: NavProgram[];
  municipalityName: string | null;
  isAdmin: boolean;
  logoutAction: () => Promise<void>;
}

/**
 * Cabeçalho + navegação da área autenticada do município. Os itens de
 * navegação são gerados a partir dos programas reais cadastrados (não há
 * "Coleções"/"Categorias" fictícias) e a busca consulta diretamente os
 * livros publicados via `searchLibraryBooks`, respeitando o RLS existente.
 */
export function AppHeader({ programs, municipalityName, isAdmin, logoutAction }: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);

  // Prende o foco de teclado dentro do painel aberto (drawer mobile ou busca
  // em tela cheia) — Tab não escapa para o conteúdo por trás.
  useFocusTrap(mobileNavOpen, drawerRef);
  useFocusTrap(searchOpen, searchOverlayRef);

  useEffect(() => {
    setMobileNavOpen(false);
    setSearchOpen(false);
    setQuery('');
    setResults(null);
  }, [pathname]);

  // Ao abrir o menu mobile, move o foco para o botão de fechar (primeiro
  // elemento focável do painel), como em qualquer diálogo modal acessível.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const timeout = setTimeout(() => drawerCloseRef.current?.focus(), reducedMotion ? 0 : 240);
    return () => clearTimeout(timeout);
  }, [mobileNavOpen, reducedMotion]);

  useEffect(() => {
    if (!mobileNavOpen && !searchOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileNavOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileNavOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      const timeout = setTimeout(() => searchInputRef.current?.focus(), reducedMotion ? 0 : 120);
      return () => clearTimeout(timeout);
    }
    setQuery('');
    setResults(null);
  }, [searchOpen, reducedMotion]);

  // Fecha o dropdown de resultados ao clicar fora (versão desktop, inline).
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setResults(null);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(async () => {
      const found = await searchLibraryBooks(trimmed);
      setResults(found);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  function goToBook(id: string) {
    setSearchOpen(false);
    setResults(null);
    setQuery('');
    router.push(`/biblioteca/livro/${id}`);
  }

  const initial = (municipalityName || 'M').charAt(0).toUpperCase();

  const navLinks = [
    { href: '/biblioteca', label: 'Início' },
    ...programs.map(p => ({ href: `/biblioteca/programa/${p.slug}`, label: p.name })),
    { href: '/biblioteca/ia', label: '✦ IA Eleva+' },
    { href: '/biblioteca/educar-para-cuidar', label: 'Educar para Cuidar' },
    { href: '/biblioteca/autismo', label: 'Autismo' },
  ];

  const searchResultsPanel = (
    <>
      {searching && <p className="px-4 py-6 text-center text-sm text-bib-text-light-muted">Buscando…</p>}
      {!searching && results && results.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-bib-text-light-muted">
          Nenhum livro encontrado para &ldquo;{query}&rdquo;.
        </p>
      )}
      {!searching && results && results.length > 0 && (
        <ul role="listbox" aria-label="Resultados da busca">
          {results.map(book => (
            <li key={book.id}>
              <button
                type="button"
                onClick={() => goToBook(book.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-bib-gray-bg transition-colors"
              >
                <span className="w-9 h-11 rounded-bib-sm overflow-hidden shrink-0 bg-bib-gray-bg border border-bib-border-light">
                  {book.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.cover_image_url}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full text-bib-text-light-muted">
                      <BookOpen size={14} aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-bib-text-light-primary truncate">
                    {book.title}
                  </span>
                  {book.author && (
                    <span className="block text-xs text-bib-text-light-muted truncate">{book.author}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <>
      <a
        href="#library-main-content"
        className="fixed left-4 top-4 z-50 -translate-y-20 focus:translate-y-0 px-4 py-2 rounded-bib-md bg-white text-bib-text-light-primary text-sm font-medium shadow-bib-glass transition-transform"
      >
        Pular para o conteúdo
      </a>

      <header className="sticky top-0 z-30 border-b border-bib-border-light backdrop-blur-bib-md bg-bib-glass-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden text-bib-text-light-secondary hover:text-bib-text-light-primary"
              aria-label="Abrir menu de navegação"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <Link href="/biblioteca" className="flex items-center gap-2 shrink-0">
              <ElevaWordmark size="sm" />
              <span className="text-sm text-bib-text-light-muted hidden lg:inline">Biblioteca Digital</span>
            </Link>
          </div>

          {/* Busca — desktop, inline com dropdown de resultados */}
          <div ref={searchBoxRef} className="hidden md:block relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-bib-text-light-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar livros por título ou autor…"
              aria-label="Buscar livros por título ou autor"
              className="w-full pl-9 pr-3 py-2 rounded-bib-md text-sm bg-white border border-bib-border-light text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-teal/40 focus:border-bib-teal/40 transition-shadow"
            />
            {(query.trim().length >= 2) && (
              <div className="absolute z-40 mt-2 left-0 right-0 rounded-bib-md border border-bib-border-light bg-white shadow-bib-glass overflow-hidden max-h-80 overflow-y-auto">
                {searchResultsPanel}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="md:hidden text-bib-text-light-secondary hover:text-bib-text-light-primary"
              aria-label="Buscar livros"
            >
              <Search size={19} aria-hidden="true" />
            </button>

            {isAdmin && (
              <span
                className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#FE650920', color: '#FE6509' }}
              >
                Modo preview (admin)
              </span>
            )}

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-bib-border-light">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
                aria-hidden="true"
              >
                {initial}
              </span>
              <span className="text-sm text-bib-text-light-secondary max-w-[160px] truncate">
                {municipalityName || 'Administrador'}
              </span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-sm font-medium text-bib-text-light-muted hover:text-bib-text-light-primary transition-colors"
              >
                <LogOut size={15} aria-hidden="true" className="hidden sm:block" />
                <span className="sr-only sm:not-sr-only">Sair</span>
              </button>
            </form>
          </div>
        </div>

        {/* Navegação — desktop, faixa de programas reais (funcionam como "coleções") */}
        {navLinks.length > 1 && (
          <nav
            aria-label="Navegação principal"
            className="hidden md:block border-t border-bib-border-light"
          >
            <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
              {navLinks.map(link => {
                const isActive = link.href === '/biblioteca' ? pathname === link.href : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className="relative px-3 py-2.5 text-sm whitespace-nowrap transition-colors"
                    style={{ color: isActive ? '#072441' : 'rgb(7 36 65 / 56%)' }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="library-nav-active"
                        aria-hidden="true"
                        className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full"
                        style={{ background: 'linear-gradient(90deg, #009CA4, #13A4CC)' }}
                        transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Menu mobile — drawer com navegação, identidade do município e logout */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              initial={reducedMotion ? { opacity: 0 } : { x: -280 }}
              animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { x: -280 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 w-72 flex flex-col bg-white"
            >
              <div className="flex items-center justify-between p-5 border-b border-bib-border-light">
                <ElevaWordmark size="sm" />
                <button
                  ref={drawerCloseRef}
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-bib-text-light-muted hover:text-bib-text-light-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-bib-teal/50 rounded"
                  aria-label="Fechar menu"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-bib-border-light">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
                  aria-hidden="true"
                >
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-bib-text-light-primary truncate">
                    {municipalityName || 'Administrador'}
                  </p>
                  {isAdmin && (
                    <span
                      className="inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#FE650920', color: '#FE6509' }}
                    >
                      Modo preview (admin)
                    </span>
                  )}
                </div>
              </div>
              <nav aria-label="Navegação principal" className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                {navLinks.map(link => {
                  const isActive = link.href === '/biblioteca' ? pathname === link.href : pathname?.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className="block px-3 py-2.5 rounded-bib-md text-sm transition-colors"
                      style={{
                        color: isActive ? '#072441' : 'rgb(7 36 65 / 64%)',
                        background: isActive ? '#EBF6F7' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-bib-border-light">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-bib-md text-sm text-bib-text-light-muted hover:bg-bib-gray-bg hover:text-bib-text-light-primary transition-colors"
                  >
                    <LogOut size={16} className="shrink-0" aria-hidden="true" />
                    Sair
                  </button>
                </form>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Busca — overlay mobile em tela cheia */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            ref={searchOverlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar livros"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="md:hidden fixed inset-0 z-50 bg-white flex flex-col"
          >
            <div className="flex items-center gap-3 p-4 border-b border-bib-border-light">
              <Search size={17} className="text-bib-text-light-muted shrink-0" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar livros por título ou autor…"
                aria-label="Buscar livros por título ou autor"
                className="flex-1 bg-transparent text-sm text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-bib-text-light-muted hover:text-bib-text-light-primary shrink-0"
                aria-label="Fechar busca"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {query.trim().length < 2 ? (
                <p className="px-4 py-8 text-center text-sm text-bib-text-light-muted">
                  Digite ao menos 2 letras para buscar.
                </p>
              ) : (
                searchResultsPanel
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
