'use client';
import React from 'react';
import { HBarChart, BarChart } from '@/components/Charts';
import Badge, { statusBadge } from '@/components/Badge';
import { IconStar, IconTeacher, IconDownload } from '@/components/Icons';
import { teacherEvaluations } from '@/lib/mock-data';

const ratingLabel = (v: number) =>
  v === 5 ? 'Excelente' : v === 4 ? 'Bom' : v === 3 ? 'Regular' : v === 2 ? 'Ruim' : 'Crítico';

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= value ? '#F48B1B' : '#E5E7EB'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{value}/5</span>
    </div>
  );
}

export default function AvaliacaoDocentePage() {
  const completed = teacherEvaluations.length;
  const total = 47;
  const rate = Math.round((completed / total) * 100);

  const avgData = [
    { label: 'Uso do material', value: Math.round(teacherEvaluations.reduce((a, e) => a + e.materialUse, 0) / completed * 20) },
    { label: 'Clareza das atividades', value: Math.round(teacherEvaluations.reduce((a, e) => a + e.activityClarity, 0) / completed * 20) },
    { label: 'Engajamento alunos', value: Math.round(teacherEvaluations.reduce((a, e) => a + e.studentEngagement, 0) / completed * 20) },
    { label: 'Qualidade formações', value: Math.round(teacherEvaluations.reduce((a, e) => a + e.trainingQuality, 0) / completed * 20) },
    { label: 'Suporte recebido', value: Math.round(teacherEvaluations.reduce((a, e) => a + e.supportReceived, 0) / completed * 20) },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Avaliação Docente</h1>
          <p className="text-sm text-gray-500">{completed} de {total} professores responderam ({rate}%)</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors">
          <IconDownload size={14} />
          Exportar respostas
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Respostas recebidas', value: `${completed}/${total}`, color: 'text-[#2E8C99]' },
          { label: 'Taxa de resposta', value: `${rate}%`, color: 'text-[#F48B1B]' },
          { label: 'Satisfação geral', value: '4,3/5', color: 'text-green-600' },
          { label: 'Uso do material', value: '88%', color: 'text-purple-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Indicadores médios de satisfação docente</h3>
        <HBarChart data={avgData} unit="%" />
      </div>

      {/* Individual responses */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Respostas individuais</h3>
        {teacherEvaluations.map(te => (
          <div key={te.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF6F7] flex items-center justify-center text-[#2E8C99] font-bold">
                  {te.teacherName.split(' ').pop()?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{te.teacherName}</p>
                  <p className="text-xs text-gray-500">{te.schoolName} · {te.trimesterName}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{te.submittedAt}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Material', value: te.materialUse },
                { label: 'Clareza', value: te.activityClarity },
                { label: 'Engajamento', value: te.studentEngagement },
                { label: 'Formação', value: te.trainingQuality },
                { label: 'Suporte', value: te.supportReceived },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-xl font-bold text-gray-900">{item.value}</p>
                  <Stars value={item.value} />
                </div>
              ))}
            </div>

            {(te.difficulties || te.suggestions) && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {te.difficulties && (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Dificuldades</p>
                    <p className="text-xs text-amber-800">{te.difficulties}</p>
                  </div>
                )}
                {te.suggestions && (
                  <div className="bg-[#EBF6F7] rounded-xl p-3">
                    <p className="text-xs font-semibold text-[#226E79] mb-1">Sugestões</p>
                    <p className="text-xs text-[#2E8C99]">{te.suggestions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
