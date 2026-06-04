'use client';
import React from 'react';
import Badge, { statusBadge } from '@/components/Badge';
import { IconPlus, IconEdit, IconSMART } from '@/components/Icons';
import { smartGoals } from '@/lib/mock-data';

export default function MetasSMARTPage() {
  const total = smartGoals.length;
  const concluded = smartGoals.filter(g => g.status === 'concluida').length;
  const inProgress = smartGoals.filter(g => g.status === 'em_andamento').length;
  const delayed = smartGoals.filter(g => g.status === 'atrasada').length;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Metas SMART</h1>
          <p className="text-sm text-gray-500">Monitoramento de metas específicas, mensuráveis e com prazo</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
          <IconPlus size={16} />
          Nova meta
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total de metas', value: total, color: 'text-gray-900' },
          { label: 'Concluídas', value: concluded, color: 'text-green-600' },
          { label: 'Em andamento', value: inProgress, color: 'text-[#2E8C99]' },
          { label: 'Atrasadas', value: delayed, color: 'text-red-500' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {smartGoals.map(goal => {
          const sb = statusBadge(goal.status);
          const progress = goal.targetValue > goal.initialValue
            ? Math.min(100, Math.round(((goal.currentValue - goal.initialValue) / (goal.targetValue - goal.initialValue)) * 100))
            : 100;
          const isNumeric = typeof goal.initialValue === 'number';

          return (
            <div key={goal.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF6F7] flex items-center justify-center flex-shrink-0">
                    <IconSMART size={18} className="text-[#2E8C99]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{goal.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{goal.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {goal.schoolName && <Badge label={goal.schoolName.replace('EMEF ', '')} variant="blue" />}
                      <Badge label={goal.indicator} variant="gray" />
                      <span className="text-xs text-gray-400">Prazo: {goal.deadline}</span>
                      <span className="text-xs text-gray-400">Resp.: {goal.responsible}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge label={sb.label} variant={sb.variant} />
                  <button className="p-1.5 text-gray-400 hover:text-[#F48B1B] hover:bg-[#FEF3E2] rounded-lg transition-colors">
                    <IconEdit size={15} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Progresso</span>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span>Inicial: <strong>{goal.initialValue}</strong></span>
                    <span>Atual: <strong className="text-[#2E8C99]">{goal.currentValue}</strong></span>
                    <span>Meta: <strong className="text-[#F48B1B]">{goal.targetValue}</strong></span>
                    <strong className={progress >= 100 ? 'text-green-600' : 'text-[#2E8C99]'}>{progress}%</strong>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: progress >= 100 ? '#059669' : progress >= 60 ? '#2E8C99' : '#F48B1B',
                    }}
                  />
                </div>
              </div>

              {goal.observations && (
                <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">{goal.observations}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
