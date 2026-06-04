import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'blue' | 'orange' | 'green' | 'red' | 'yellow' | 'gray' | 'purple';
  size?: 'sm' | 'md';
}

const variants = {
  blue: 'bg-[#EBF6F7] text-[#226E79] border border-[#2E8C99]/20',
  orange: 'bg-[#FEF3E2] text-[#D4720E] border border-[#F48B1B]/20',
  green: 'bg-green-50 text-green-700 border border-green-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  gray: 'bg-gray-100 text-gray-600 border border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
};

export default function Badge({ label, variant = 'gray', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      {label}
    </span>
  );
}

// Convenience maps
export const roleBadge = (role: string) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    super_admin: { label: 'Super Admin', variant: 'purple' },
    admin_eleva: { label: 'Admin Eleva+', variant: 'orange' },
    secretaria: { label: 'Secretaria', variant: 'blue' },
    gestor_escolar: { label: 'Gestor Escolar', variant: 'green' },
    professor: { label: 'Professor', variant: 'gray' },
    visualizador: { label: 'Visualizador', variant: 'yellow' },
  };
  return map[role] ?? { label: role, variant: 'gray' as const };
};

export const statusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    ativo: { label: 'Ativo', variant: 'green' },
    inativo: { label: 'Inativo', variant: 'red' },
    suspenso: { label: 'Suspenso', variant: 'yellow' },
    planejado: { label: 'Planejado', variant: 'gray' },
    encerrado: { label: 'Encerrado', variant: 'gray' },
    rascunho: { label: 'Rascunho', variant: 'yellow' },
    publicada: { label: 'Publicada', variant: 'blue' },
    aplicada: { label: 'Aplicada', variant: 'green' },
    encerrada: { label: 'Encerrada', variant: 'gray' },
    planejada: { label: 'Planejada', variant: 'gray' },
    em_andamento: { label: 'Em andamento', variant: 'blue' },
    concluida: { label: 'Concluída', variant: 'green' },
    atrasada: { label: 'Atrasada', variant: 'red' },
    pendente: { label: 'Pendente', variant: 'yellow' },
    concluido: { label: 'Concluído', variant: 'green' },
    cancelado: { label: 'Cancelado', variant: 'red' },
    alta: { label: 'Alta', variant: 'green' },
    media: { label: 'Média', variant: 'yellow' },
    baixa: { label: 'Baixa', variant: 'red' },
  };
  return map[status] ?? { label: status, variant: 'gray' as const };
};
