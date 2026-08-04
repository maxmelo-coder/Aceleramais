// Itens de navegação do painel administrativo da Biblioteca Digital.
// Fica isolado num módulo "data-only" (sem 'use client') para poder ser
// importado tanto pelo layout do servidor (app/biblioteca/admin/(dashboard)/layout.tsx,
// que faz a checagem de auth) quanto pelo AdminShell no cliente (sidebar,
// header e command palette), sem duplicar a lista em dois lugares.
export type AdminNavIcon = 'dashboard' | 'upload' | 'municipios';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: AdminNavIcon;
  description: string;
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: '/biblioteca/admin',
    label: 'Dashboard',
    icon: 'dashboard',
    description: 'Visão geral e métricas da biblioteca',
  },
  {
    href: '/biblioteca/admin/upload',
    label: 'Upload de livro',
    icon: 'upload',
    description: 'Adicionar um novo título ao acervo',
  },
  {
    href: '/biblioteca/admin/municipios',
    label: 'Municípios',
    icon: 'municipios',
    description: 'Gerenciar acessos por município',
  },
];
