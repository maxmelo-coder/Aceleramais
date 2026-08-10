'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, X } from 'lucide-react';

export function AIFloatingButton() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  // Don't show on IA pages themselves
  if (pathname?.startsWith('/biblioteca/ia')) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div className="mb-2 bg-white rounded-bib-md border border-bib-border-light shadow-bib-glass p-3 w-56 space-y-1.5">
          <p className="text-xs font-semibold text-bib-text-light-secondary px-1 pb-1 border-b border-bib-border-light">
            IA Eleva+
          </p>
          {[
            { href: '/biblioteca/ia', label: 'Início da IA' },
            { href: '/biblioteca/ia/pei', label: 'Construir PEI' },
            { href: '/biblioteca/ia/planejamento', label: 'Planejar aula' },
            { href: '/biblioteca/ia/socioemocional', label: 'Consultoria SE' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setExpanded(false)}
              className="block px-3 py-2 rounded-bib-sm text-sm text-bib-text-light-primary hover:bg-bib-gray-bg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Fechar menu da IA Eleva+' : 'Abrir IA Eleva+'}
        className="w-14 h-14 rounded-full text-white bg-bib-teal shadow-bib-md flex items-center justify-center transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-bib-teal/50"
      >
        {expanded ? <X size={22} aria-hidden="true" /> : <Sparkles size={22} aria-hidden="true" />}
      </button>
    </div>
  );
}
