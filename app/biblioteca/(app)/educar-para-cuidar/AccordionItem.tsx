'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  content: string;
}

export function AccordionItem({ id, icon, title, content }: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-bib-md border border-bib-border-light shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={`acc-${id}`}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-bib-gray-bg/50 transition-colors"
      >
        <span
          className="w-8 h-8 rounded-bib-sm flex items-center justify-center text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span
          className="flex-1 text-sm font-semibold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          {title}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-bib-text-light-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          id={`acc-${id}`}
          className="px-5 pb-5 text-sm text-bib-text-light-secondary leading-relaxed whitespace-pre-line border-t border-bib-border-light pt-4"
        >
          {content.split('\n\n').map((para, i) => {
            if (para.startsWith('**') && para.includes(':**')) {
              // Section header
              return (
                <p key={i} className="mt-4 first:mt-0">
                  <strong className="text-bib-text-light-primary">{para.replace(/\*\*/g, '')}</strong>
                </p>
              );
            }
            if (para.startsWith('- ')) {
              // List
              const items = para.split('\n').filter(l => l.startsWith('- '));
              return (
                <ul key={i} className="mt-2 space-y-1 list-none pl-0">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bib-teal shrink-0" aria-hidden="true" />
                      <span dangerouslySetInnerHTML={{ __html: item.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </li>
                  ))}
                </ul>
              );
            }
            if (para.match(/^\d+\./)) {
              // Numbered list
              const items = para.split('\n').filter(l => l.match(/^\d+\./));
              return (
                <ol key={i} className="mt-2 space-y-1 list-none pl-0">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="shrink-0 text-bib-teal font-semibold text-xs mt-0.5">{j + 1}.</span>
                      <span dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={i} className="mt-3 first:mt-0" dangerouslySetInnerHTML={{
                __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }} />
            );
          })}
        </div>
      )}
    </div>
  );
}
