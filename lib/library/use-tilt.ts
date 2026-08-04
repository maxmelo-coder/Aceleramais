'use client';

import { useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/library/use-prefers-reduced-motion';

/**
 * Inclinação 3D sutil que segue o cursor, compartilhada entre os cards de
 * livro (grade) e a capa em destaque na página de detalhes. Desativada
 * automaticamente com prefers-reduced-motion (em touch/mobile o mousemove
 * simplesmente não dispara, então já não tem efeito prático).
 */
export function useTiltEffect(range: number = 8) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [range, -range]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-range, range]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return {
    ref,
    rotateX: reducedMotion ? 0 : rotateX,
    rotateY: reducedMotion ? 0 : rotateY,
    handleMouseMove,
    handleMouseLeave,
  };
}
