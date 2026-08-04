import Link from 'next/link';

interface ModeCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  badge?: string;
}

export function ModeCard({ href, icon, title, description, color = '#009CA4', badge }: ModeCardProps) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-bib-md border border-bib-border-light p-5 shadow-sm hover:shadow-bib-glass hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bib-teal/50 flex flex-col gap-3"
    >
      {badge && (
        <span
          className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${color}20`, color }}
        >
          {badge}
        </span>
      )}
      <div
        className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white shrink-0"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
      >
        {icon}
      </div>
      <div>
        <h3
          className="font-semibold text-bib-text-light-primary text-sm group-hover:text-bib-teal transition-colors"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          {title}
        </h3>
        <p className="mt-1 text-xs text-bib-text-light-muted leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
