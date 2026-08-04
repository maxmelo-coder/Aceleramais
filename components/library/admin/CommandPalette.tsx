'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, UploadCloud, Building2, ExternalLink, Search, CornerDownLeft } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/library/use-prefers-reduced-motion';
import type { AdminNavItem } from '@/lib/library/admin-nav';

const ICONS = {
  dashboard: LayoutDashboard,
  upload: UploadCloud,
  municipios: Building2,
} as const;

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: AdminNavItem[];
}

/** Command palette (⌘K) — navegação rápida entre as áreas do painel. */
export function CommandPalette({ open, onOpenChange, navItems }: CommandPaletteProps) {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const commands = useMemo(
    () => [
      ...navItems.map(item => ({
        id: item.href,
        label: item.label,
        description: item.description,
        icon: ICONS[item.icon],
        run: () => router.push(item.href),
      })),
      {
        id: 'preview',
        label: 'Ver biblioteca (preview)',
        description: 'Abrir a experiência do município em nova aba',
        icon: ExternalLink,
        run: () => window.open('/biblioteca', '_blank', 'noopener,noreferrer'),
      },
    ],
    [navItems, router],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      c => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Registro global do atalho ⌘K / Ctrl+K, independente de onde o foco está.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      setQuery('');
      setActiveIndex(0);
      const timeout = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timeout);
    }
    // Devolve o foco para quem abriu a palette (botão "Buscar" ou atalho),
    // essencial para navegação por teclado/leitor de tela.
    lastFocusedRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) {
        onOpenChange(false);
        cmd.run();
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-bib-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Busca rápida do painel"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-bib-lg border border-bib-border-dark shadow-bib-glass overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #0F2A47, #071426)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-bib-border-dark">
              <Search size={16} className="text-bib-text-dark-muted shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                role="combobox"
                aria-label="Buscar uma página ou comando"
                aria-expanded={open}
                aria-controls="admin-command-list"
                aria-activedescendant={filtered[activeIndex] ? `admin-command-${filtered[activeIndex].id}` : undefined}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar uma página ou comando..."
                className="w-full bg-transparent text-sm text-bib-text-dark-primary placeholder:text-bib-text-dark-muted focus:outline-none"
              />
              <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded border border-bib-border-dark text-bib-text-dark-muted">
                esc
              </kbd>
            </div>

            <div id="admin-command-list" role="listbox" aria-label="Resultados" className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-bib-text-dark-muted">
                  Nenhum resultado para &ldquo;{query}&rdquo;.
                </p>
              ) : (
                filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  const active = i === activeIndex;
                  return (
                    <button
                      key={cmd.id}
                      id={`admin-command-${cmd.id}`}
                      role="option"
                      aria-selected={active}
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => {
                        onOpenChange(false);
                        cmd.run();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-bib-md text-left transition-colors"
                      style={{ background: active ? 'rgb(255 255 255 / 8%)' : 'transparent' }}
                    >
                      <span className="w-8 h-8 rounded-bib-sm flex items-center justify-center bg-bib-glass-dark border border-bib-border-dark text-bib-text-dark-secondary shrink-0">
                        <Icon size={15} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-bib-text-dark-primary truncate">{cmd.label}</span>
                        <span className="block text-xs text-bib-text-dark-muted truncate">{cmd.description}</span>
                      </span>
                      {active && <CornerDownLeft size={14} className="text-bib-text-dark-muted shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
