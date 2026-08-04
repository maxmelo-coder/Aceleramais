'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useTiltEffect } from '@/lib/library/use-tilt';

export interface BookCardProps {
  id: string;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  accentColor?: string | null;
  /** Texto pequeno opcional acima do título (ex.: nome do programa, "Aberto há 2 dias"). */
  meta?: string | null;
}

/**
 * Card de livro reutilizável — usado na home (continuar leitura, novidades) e
 * nas páginas de biblioteca/programa. Aplica uma leve inclinação 3D que segue
 * o cursor (efeito "prateleira premium"), desativada em telas sem hover fino
 * (touch/mobile) e quando o usuário prefere menos movimento.
 */
export function BookCard({ id, title, author, coverUrl, accentColor, meta }: BookCardProps) {
  const { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTiltEffect();
  const accent = accentColor || '#009CA4';

  return (
    <Link
      href={`/biblioteca/livro/${id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-bib-teal/50 rounded-bib-md"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        className="aspect-[3/4] rounded-bib-md bg-white border border-bib-border-light shadow-sm overflow-hidden group-hover:shadow-bib-glass transition-shadow duration-300"
      >
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-white text-sm font-medium text-center p-3"
            style={{ background: `linear-gradient(160deg, ${accent}, ${accent}CC)` }}
          >
            <BookOpen size={20} aria-hidden="true" className="opacity-80" />
            {title}
          </div>
        )}
      </motion.div>
      <div className="mt-2.5">
        {meta && <p className="text-xs font-medium text-bib-teal truncate">{meta}</p>}
        <p className="text-sm font-medium text-bib-text-light-primary line-clamp-2 group-hover:underline">
          {title}
        </p>
        {author && <p className="text-xs text-bib-text-light-muted truncate">{author}</p>}
      </div>
    </Link>
  );
}
