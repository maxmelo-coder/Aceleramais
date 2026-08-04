'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useTiltEffect } from '@/lib/library/use-tilt';

/**
 * Capa em destaque da página de detalhes do livro. Mesma inclinação 3D sutil
 * dos cards de grade (useTiltEffect), em tamanho maior. Puramente decorativa
 * aqui (não é um link — o link de leitura é o botão "Ler agora" ao lado).
 */
export function BookDetailCover({
  title,
  coverUrl,
  accentColor,
}: {
  title: string;
  coverUrl: string | null;
  accentColor: string;
}) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTiltEffect(6);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="aspect-[3/4] w-full max-w-[260px] rounded-bib-lg bg-white border border-bib-border-light shadow-bib-glass overflow-hidden mx-auto md:mx-0"
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3 text-white text-base font-semibold text-center p-6"
          style={{ background: `linear-gradient(160deg, ${accentColor}, ${accentColor}CC)` }}
        >
          <BookOpen size={28} aria-hidden="true" className="opacity-80" />
          {title}
        </div>
      )}
    </motion.div>
  );
}
