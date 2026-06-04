'use client';
import React from 'react';
import Link from 'next/link';
import { IconMenu, IconBell, IconSearch, IconUser, IconChevron } from './Icons';
import type { User } from '@/lib/types';

const roleLabels: Record<string, string> = {
  super_admin: 'Super Administrador',
  admin_eleva: 'Admin Eleva+',
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
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <IconMenu size={20} />
      </button>

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
