'use client';
import React, { useState, useRef, useEffect } from 'react';
import { IconMenu, IconBell, IconSearch, IconChevron } from './Icons';
import type { User } from '@/lib/types';
import { useMunicipio } from '@/lib/municipio-context';

const roleLabels: Record<string, string> = {
  super_admin: 'Super Administrador',
  admin_eleva: 'Admin Acelera+',
  secretaria: 'Secretaria de Educação',
  gestor_escolar: 'Gestor Escolar',
  professor: 'Professor',
  visualizador: 'Visualizador',
};

interface TopbarProps {
  user: User;
  onMenuClick: () => void;
  title?: string;
}

export default function Topbar({ user, onMenuClick, title }: TopbarProps) {
  const { selected, setSelected, all } = useMunicipio();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <IconMenu size={20} />
      </button>

      {/* Seletor de Município */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-[#F7F8FA] hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-[#F48B1B] flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-800 max-w-[160px] truncate">{selected.name}</span>
          <span className="text-xs text-gray-400 font-medium">{selected.uf}</span>
          <IconChevron size={13} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : 'rotate-90'}`} />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">Municípios do projeto</p>
            {all.map((m, i) => (
              <button
                key={m.id}
                onClick={() => { setSelected(m); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors
                  ${selected.id === m.id ? 'bg-[#FEF3E2]' : ''}`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0
                  ${selected.id === m.id ? 'bg-[#F48B1B]' : 'bg-gray-300'}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <p className={`text-sm font-medium ${selected.id === m.id ? 'text-[#F48B1B]' : 'text-gray-800'}`}>{m.name}</p>
                  <p className="text-[11px] text-gray-400">{m.state} · {m.schools.length} escolas</p>
                </div>
                {selected.id === m.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F48B1B]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {title && (
        <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">{title}</h1>
      )}

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-400 w-56">
        <IconSearch size={15} />
        <span>Buscar…</span>
      </div>

      {/* Notifications */}
      <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
        <IconBell size={19} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F48B1B] rounded-full" />
      </button>

      {/* User */}
      <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
        <div className="w-8 h-8 rounded-full bg-[#2E8C99] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="hidden sm:block min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-none truncate max-w-[140px]">{user.name.split(' ')[0]}</p>
          <p className="text-[11px] text-gray-400 leading-none mt-0.5">{roleLabels[user.role] ?? user.role}</p>
        </div>
        <IconChevron size={14} className="text-gray-300 hidden sm:block rotate-90" />
      </div>
    </header>
  );
}
