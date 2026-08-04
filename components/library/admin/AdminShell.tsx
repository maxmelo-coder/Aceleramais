'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UploadCloud,
  Building2,
  ExternalLink,
  LogOut,
  Command,
  Menu,
  X,
} from 'lucide-react';
import { ElevaWordmark } from '@/components/library/ElevaWordmark';
import { CommandPalette } from '@/components/library/admin/CommandPalette';
import { usePrefersReducedMotion } from '@/lib/library/use-prefers-reduced-motion';
import type { AdminNavItem } from '@/lib/library/admin-nav';

const ICONS = {
  dashboard: LayoutDashboard,
  upload: UploadCloud,
  municipios: Building2,
} as const;

interface AdminShellProps {
  navItems: AdminNavItem[];
  userEmail: string | null;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}

/** Casca do painel administrativo: sidebar + header + command palette (⌘K). */
export function AdminShell({ navItems, userEmail, logoutAction, children }: AdminShellProps) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Fecha o menu mobile automaticamente ao trocar de rota.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  // Fecha o menu mobile com Esc — mesmo padrão de teclado da command palette.
  useEffect(() => {
    if (!mobileNavOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileNavOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileNavOpen]);

  const activeItem = navItems.find(item =>
    item.href === '/biblioteca/admin' ? pathname === item.href : pathname?.startsWith(item.href),
  );

  const sidebarContent = (
    <>
      <div className="p-6">
        <ElevaWordmark variant="dark" size="sm" />
        <p className="text-xs text-bib-text-dark-muted mt-1">Painel Administrativo</p>
      </div>
      <nav aria-label="Navegação principal" className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const Icon = ICONS[item.icon];
          const isActive =
            item.href === '/biblioteca/admin' ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-bib-md text-sm transition-colors"
              style={{
                color: isActive ? '#F5F8FA' : 'rgb(245 248 250 / 64%)',
                background: isActive ? 'rgb(255 255 255 / 8%)' : 'transparent',
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-nav-active"
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                  style={{ background: 'linear-gradient(180deg, #009CA4, #13A4CC)' }}
                  transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <Icon size={16} className="shrink-0" aria-hidden="true" />
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="p-3 border-t border-bib-border-dark space-y-1">
        <a
          href="/biblioteca"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-bib-md text-sm text-bib-text-dark-muted hover:bg-white/10 hover:text-bib-text-dark-primary transition-colors"
        >
          <ExternalLink size={16} className="shrink-0" aria-hidden="true" />
          Ver biblioteca (preview)
        </a>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-bib-md text-sm text-bib-text-dark-muted hover:bg-white/10 hover:text-bib-text-dark-primary transition-colors"
          >
            <LogOut size={16} className="shrink-0" aria-hidden="true" />
            Sair
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-bib-gray-bg" style={{ fontFamily: 'var(--font-bib-sans)' }}>
      <a
        href="#admin-main-content"
        className="fixed left-4 top-4 z-50 -translate-y-20 focus:translate-y-0 px-4 py-2 rounded-bib-md bg-white text-bib-text-light-primary text-sm font-medium shadow-bib-glass transition-transform"
      >
        Pular para o conteúdo
      </a>

      {/* Sidebar — desktop */}
      <aside
        className="hidden md:flex w-60 shrink-0 flex-col"
        style={{ background: 'linear-gradient(180deg, #072441, #051a30)' }}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar — mobile (drawer) */}
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
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              initial={reducedMotion ? { opacity: 0 } : { x: -280 }}
              animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { x: -280 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 w-64 flex flex-col"
              style={{ background: 'linear-gradient(180deg, #072441, #051a30)' }}
            >
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-8 h-16 border-b border-bib-border-light backdrop-blur-bib-md bg-bib-glass-light">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden text-bib-text-light-secondary hover:text-bib-text-light-primary"
              aria-label="Abrir menu"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <h2 className="text-sm font-semibold text-bib-text-light-primary truncate" style={{ fontFamily: 'var(--font-bib-display)' }}>
              {activeItem?.label ?? 'Painel Administrativo'}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-bib-md text-xs text-bib-text-light-secondary border border-bib-border-light bg-white hover:border-bib-blue/40 transition-colors"
            >
              <Command size={13} aria-hidden="true" />
              Buscar
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-bib-gray-bg text-[10px] text-bib-text-light-muted">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="sm:hidden text-bib-text-light-secondary"
              aria-label="Buscar"
            >
              <Command size={18} aria-hidden="true" />
            </button>
            {userEmail && (
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-bib-border-light">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
                >
                  {userEmail.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs text-bib-text-light-secondary max-w-[160px] truncate">{userEmail}</span>
              </div>
            )}
          </div>
        </header>

        <main id="admin-main-content" className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} navItems={navItems} />
    </div>
  );
}
