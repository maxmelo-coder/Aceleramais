'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconDashboard, IconSchool, IconClasses, IconStudents, IconEval,
  IconTeacher, IconFeedback, IconTraining, IconEvidence, IconReports,
  IconSWOT, IconSMART, IconAction, IconUsers, IconSetup, IconConfig,
  IconChevron, IconLogout, IconX,
} from './Icons';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <IconDashboard size={18} /> },
  { label: 'Escolas', href: '/escolas', icon: <IconSchool size={18} /> },
  { label: 'Turmas', href: '/turmas', icon: <IconClasses size={18} /> },
  { label: 'Estudantes', href: '/estudantes', icon: <IconStudents size={18} /> },
  { label: 'Avaliações Diagnósticas', href: '/avaliacoes', icon: <IconEval size={18} /> },
  { label: 'Avaliação Docente', href: '/avaliacao-docente', icon: <IconTeacher size={18} /> },
  { label: 'Feedback da Secretaria', href: '/feedback-secretaria', icon: <IconFeedback size={18} /> },
  { label: 'Formações Docentes', href: '/formacoes', icon: <IconTraining size={18} /> },
  { label: 'Evidências Pedagógicas', href: '/evidencias', icon: <IconEvidence size={18} /> },
  { label: 'Relatórios e Gráficos', href: '/relatorios', icon: <IconReports size={18} /> },
  { label: 'Análise SWOT', href: '/swot', icon: <IconSWOT size={18} /> },
  { label: 'Metas SMART', href: '/metas-smart', icon: <IconSMART size={18} /> },
  { label: 'Plano de Ação', href: '/plano-acao', icon: <IconAction size={18} /> },
  { label: 'Usuários e Permissões', href: '/usuarios', icon: <IconUsers size={18} /> },
  { label: 'Configuração da Plataforma', href: '/configuracao', icon: <IconSetup size={18} /> },
  { label: 'Configurações Gerais', href: '/configuracoes', icon: <IconConfig size={18} /> },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50 lg:static lg:z-auto
        w-64 bg-[#060606] text-white flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center">
            <img src="/logo.png" alt="Acelera+" className="h-10 w-auto brightness-0 invert" />
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1">
            <IconX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin">
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${active
                    ? 'bg-[#F48B1B] text-white'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'}
                `}
              >
                <span className={`flex-shrink-0 ${active ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                <span className="truncate leading-tight">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#F48B1B] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { localStorage.removeItem('eleva_user'); window.location.href = '/login'; }}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors w-full"
          >
            <IconLogout size={16} />
            <span>Sair da plataforma</span>
          </button>
        </div>
      </aside>
    </>
  );
}
