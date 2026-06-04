'use client';
import React from 'react';
import Badge, { statusBadge } from '@/components/Badge';
import { IconPlus, IconTraining, IconCalendar, IconTeacher } from '@/components/Icons';
import { trainings } from '@/lib/mock-data';

function Stars({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-gray-400">Aguardando avaliação</span>;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(value) ? '#F48B1B' : '#E5E7EB'}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-600 font-medium">{value}</span>
    </div>
  );
}

export default function FormacoesPage() {
  const totalTeachers = trainings.reduce((a, t) => a + t.teacherCount, 0);
  const totalHours = trainings.reduce((a, t) => a + t.hours, 0);
  const avgRating = trainings.filter(t => t.rating > 0).reduce((a, t) => a + t.rating, 0) / trainings.filter(t => t.rating > 0).length;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Formações Docentes</h1>
          <p className="text-sm text-gray-500">{trainings.length} formações realizadas ou agendadas</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
          <IconPlus size={16} />
          Nova formação
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total de formações', value: trainings.length, color: 'text-[#2E8C99]' },
          { label: 'Participações docentes', value: totalTeachers, color: 'text-[#F48B1B]' },
          { label: 'Carga horária total', value: `${totalHours}h`, color: 'text-green-600' },
          { label: 'Avaliação média', value: avgRating.toFixed(1), color: 'text-purple-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {trainings.map(tr => (
          <div key={tr.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${tr.rating === 0 ? 'bg-gray-100' : 'bg-[#EBF6F7]'}`}>
                  <IconTraining size={18} className={tr.rating === 0 ? 'text-gray-400' : 'text-[#2E8C99]'} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{tr.title}</p>
                    {tr.rating === 0 && <Badge label="Agendada" variant="yellow" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{tr.topic}</p>
                </div>
              </div>
              <Stars value={tr.rating} />
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <IconCalendar size={14} className="text-gray-400" />
                <span>{tr.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[9px] font-bold text-gray-500">h</span>
                <span>{tr.hours}h de formação</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <IconTeacher size={14} className="text-gray-400" />
                <span>{tr.teacherCount} professores</span>
              </div>
              <div className="text-gray-600">
                <span className="text-gray-400">Formador: </span>
                <span className="font-medium">{tr.trainer}</span>
              </div>
            </div>

            {tr.observations && (
              <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">{tr.observations}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
