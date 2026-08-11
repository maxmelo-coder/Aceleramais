'use client';

import { motion } from 'framer-motion';
import { BookOpen, MousePointerClick, Building2, type LucideIcon } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/library/use-prefers-reduced-motion';

const ICONS: Record<StatCardData['key'], LucideIcon> = {
  book: BookOpen,
  access: MousePointerClick,
  municipality: Building2,
};

export interface StatCardData {
  key: 'book' | 'access' | 'municipality';
  label: string;
  value: number;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

/** Cards de métricas do dashboard — superfícies sólidas, com entrada em stagger. */
export function AdminStatCards({ stats }: { stats: StatCardData[] }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={reducedMotion ? undefined : container}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {stats.map(stat => {
        const Icon = ICONS[stat.key];
        return (
          <motion.div
            key={stat.key}
            variants={reducedMotion ? undefined : item}
            transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-bib-lg border border-bib-border-light bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-bib-sm flex items-center justify-center shrink-0 bg-bib-teal/10 text-bib-teal">
                <Icon size={16} aria-hidden="true" />
              </span>
              <p className="text-xs font-medium text-bib-text-light-muted uppercase tracking-wide">{stat.label}</p>
            </div>
            <p
              className="mt-3 text-3xl font-bold text-bib-text-light-primary"
              style={{ fontFamily: 'var(--font-bib-display)' }}
            >
              {stat.value.toLocaleString('pt-BR')}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
