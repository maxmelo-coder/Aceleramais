'use client';
import React from 'react';
import Badge, { statusBadge } from '@/components/Badge';
import { IconPlus, IconEdit, IconAction, IconAlert, IconCheck } from '@/components/Icons';
import { actionPlans } from '@/lib/mock-data';

const statusIcon = (status: string) => {
  if (status === 'concluido') return <IconCheck size={14} className="text-green-600" />;
  if (status === 'em_andamento') return <div className="w-3.5 h-3.5 rounded-full border-2 border-[#2E8C99] border-t-transparent animate-spin" />;
  if (status === 'cancelado') return <IconAlert size={14} className="text-red-500" />;
  return <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />;
};

export default function PlanoAcaoPage() {
  const pending = actionPlans.filter(a => a.status === 'pendente').length;
  const inProgress = actionPlans.filter(a => a.status === 'em_andamento').length;
  const done = actionPlans.filter(a => a.status === 'concluido').length;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Plano de Ação</h1>
          <p className="text-sm text-gray-500">Ações práticas derivadas da análise SWOT e Metas SMART</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
          <IconPlus size={16} />
          Nova ação
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pendentes', value: pending, color: 'text-amber-600' },
          { label: 'Em andamento', value: inProgress, color: 'text-[#2E8C99]' },
          { label: 'Concluídas', value: done, color: 'text-green-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {actionPlans.map(plan => {
          const sb = statusBadge(plan.status);
          return (
            <div key={plan.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="mt-1 flex-shrink-0">{statusIcon(plan.status)}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{plan.problem}</p>
                    {plan.schoolName && <p className="text-xs text-[#2E8C99] mt-0.5">{plan.schoolName}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge label={sb.label} variant={sb.variant} />
                  <button className="p-1.5 text-gray-400 hover:text-[#F48B1B] hover:bg-[#FEF3E2] rounded-lg transition-colors">
                    <IconEdit size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Causa provável</p>
                  <p className="text-gray-700">{plan.cause}</p>
                </div>
                <div className="bg-[#EBF6F7] rounded-xl p-3">
                  <p className="text-xs text-[#226E79] mb-1">Ação proposta</p>
                  <p className="text-[#2E8C99]">{plan.action}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                <span>👤 <strong>{plan.responsible}</strong></span>
                <span>📅 Prazo: <strong>{plan.deadline}</strong></span>
                <span>🎯 Indicador: <strong>{plan.successIndicator}</strong></span>
              </div>

              {plan.observations && (
                <p className="mt-3 text-xs text-gray-500 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">{plan.observations}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
