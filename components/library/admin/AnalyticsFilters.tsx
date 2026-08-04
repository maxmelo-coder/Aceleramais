'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import type { Program, LibraryProfile } from '@/lib/library/types';

export function AnalyticsFilters({
  programs,
  municipalities,
}: {
  programs: Program[];
  municipalities: LibraryProfile[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/biblioteca/admin?${params.toString()}`);
  }

  const selectClasses =
    'px-3 py-2 rounded-bib-md text-sm bg-white border border-bib-border-light text-bib-text-light-primary focus:outline-none focus:ring-2 focus:ring-bib-blue/30 focus:border-transparent transition-shadow';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-xs font-medium text-bib-text-light-muted">
        <Filter size={13} aria-hidden="true" />
        Filtrar por
      </span>

      <select
        aria-label="Filtrar por programa"
        defaultValue={searchParams.get('program') ?? ''}
        onChange={e => updateParam('program', e.target.value)}
        className={selectClasses}
      >
        <option value="">Todos os programas</option>
        {programs.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por município"
        defaultValue={searchParams.get('municipality') ?? ''}
        onChange={e => updateParam('municipality', e.target.value)}
        className={selectClasses}
      >
        <option value="">Todos os municípios</option>
        {municipalities.map(m => (
          <option key={m.id} value={m.id}>
            {m.municipality_name}
          </option>
        ))}
      </select>
    </div>
  );
}
