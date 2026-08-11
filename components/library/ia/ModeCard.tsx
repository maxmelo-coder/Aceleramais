import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Tom semântico fechado — não um "color" livre. A cor num card comunica
 * uma coisa só: se a ação é uma rotina pedagógica comum (teal, a maioria)
 * ou algo sensível/urgente que pede atenção (warning). Fechar o conjunto
 * evita o "salada de blocos coloridos" (uma cor por card só para
 * diferenciar visualmente, sem significado).
 */
type ModeTone = 'default' | 'warning';

const TONE_ICON = {
  default: 'bg-bib-teal/10 text-bib-teal',
  warning: 'bg-bib-orange/12 text-bib-orange',
} as const;

const TONE_BAR = {
  default: 'bg-bib-teal',
  warning: 'bg-bib-orange',
} as const;

const TONE_BADGE = {
  default: 'bg-bib-teal/10 text-bib-teal',
  warning: 'bg-bib-orange text-white',
} as const;

interface ModeCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: ModeTone;
  badge?: string;
  /**
   * "featured" — para a ação mais relevante/urgente do momento (destaque
   * maior, faixa de cor lateral, seta de affordance). "standard" — usada nos
   * grupos de capacidade da IA Eleva+ (peso visual igual entre si dentro do
   * grupo, mas menor que um card featured).
   */
  variant?: 'featured' | 'standard';
}

export function ModeCard({
  href,
  icon,
  title,
  description,
  tone = 'default',
  badge,
  variant = 'standard',
}: ModeCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        href={href}
        className="group relative flex items-start gap-4 bg-white rounded-bib-lg border border-bib-border-light p-6 shadow-sm hover:shadow-bib-glass hover:border-bib-border-strong transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bib-teal/50 overflow-hidden"
      >
        <span aria-hidden="true" className={`absolute left-0 top-0 bottom-0 w-1 ${TONE_BAR[tone]}`} />
        <div className={`w-11 h-11 rounded-bib-sm flex items-center justify-center shrink-0 ${TONE_ICON[tone]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="text-bib-h2 font-bold text-bib-text-light-primary"
              style={{ fontFamily: 'var(--font-bib-display)' }}
            >
              {title}
            </h3>
            {badge && (
              <span
                className={`text-[10px] font-semibold uppercase tracking-bib-wide px-2 py-0.5 rounded-full shrink-0 ${TONE_BADGE[tone]}`}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-bib-body text-bib-text-light-secondary leading-relaxed">{description}</p>
        </div>
        <ArrowRight
          size={18}
          aria-hidden="true"
          className="mt-1 text-bib-text-light-muted opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0"
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group relative bg-white rounded-bib-md border border-bib-border-light p-5 shadow-sm hover:shadow-bib-md hover:border-bib-border-strong hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bib-teal/50 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-bib-sm flex items-center justify-center shrink-0 bg-bib-gray-bg text-bib-text-light-secondary group-hover:bg-bib-teal/10 group-hover:text-bib-teal transition-colors">
          {icon}
        </div>
        {badge && (
          <span className="mt-0.5 text-bib-micro font-semibold uppercase tracking-bib-wide text-bib-text-light-muted shrink-0">
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3
          className="text-bib-h3 font-semibold text-bib-text-light-primary group-hover:text-bib-teal transition-colors"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          {title}
        </h3>
        <p className="mt-1 text-bib-caption text-bib-text-light-muted leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
