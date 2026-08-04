'use client';

import { useEffect, useState } from 'react';

/**
 * Hook compartilhado — respeita a preferência do usuário por menos animação
 * (system setting `prefers-reduced-motion`). Usado em todos os componentes
 * animados da área administrativa da Biblioteca Digital (login, sidebar,
 * command palette, stat cards) para evitar duplicar a mesma lógica em cada
 * client component.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);
  return reduced;
}
