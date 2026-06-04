'use client';
import React, { useState } from 'react';
import Badge, { statusBadge } from '@/components/Badge';
import { BarChart } from '@/components/Charts';
import { IconPlus, IconSearch, IconEye, IconEdit, IconEval, IconDownload } from '@/components/Icons';
import { evaluations, competenciasData } from '@/lib/mock-data';

export default function AvaliacoesPage() {
  const [search, setSearch] = useState('');

  const filtered = evaluations.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.competencia.toLowerCase().includes(search.toLowerCase())
  );

  const totalRespondents = evaluations.reduce((a, e) => a + e.respondents, 0);
  const totalStudents = evaluations.reduce((a, e) => a + e.totalStudents, 0);
  const overallRate = totalStudents > 0 ? Math.round((totalRespondents / totalStudents) * 100) : 0;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Avaliações Diagnósticas</h1>
          <p className="text-sm text-gray-500">{evaluations.length} avaliações criadas · {overallRate}% de resposta geral</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
          <IconPlus size={16} />
          Nova avaliação
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avaliações criadas', value: evaluations.length, color: 'text-[#2E8C99]' },
          { label: 'Aplicadas', value: evaluations.filter(e => e.status === 'aplicada').length, color: 'text-green-600' },
          { label: 'Respondentes', value: totalRespondents, color: 'text-[#F48B1B]' },
          { label: 'Taxa de resposta', value: `${overallRate}%`, color: 'text-purple-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Desempenho por Competência Empreendedora</h3>
        <BarChart data={competenciasData} height={180} maxValue={100} unit="%" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <IconSearch size={15} className="text-gray-400" />
            <input type="text" placeholder="Buscar avaliação…" value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400" />
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map(ev => {
            const sb = statusBadge(ev.status);
            const rate = ev.totalStudents > 0 ? Math.round((ev.respondents / ev.totalStudents) * 100) : 0;
            return (
              <div key={ev.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF6F7] flex items-center justify-center flex-shrink-0">
                      <IconEval size={18} className="text-[#2E8C99]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{ev.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{ev.serie}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-500">{ev.trimesterName}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs font-medium text-[#2E8C99]">{ev.competencia}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge label={sb.label} variant={sb.variant} />
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Respondentes</p>
                      <p className="text-sm font-bold text-gray-700">{ev.respondents}/{ev.totalStudents} <span className="text-[#2E8C99]">({rate}%)</span></p>
                    </div>
                    {ev.avgScore > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Média</p>
                        <p className="text-lg font-bold text-gray-900">{ev.avgScore}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-[#2E8C99] hover:bg-[#EBF6F7] rounded-lg transition-colors"><IconEye size={15} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-[#F48B1B] hover:bg-[#FEF3E2] rounded-lg transition-colors"><IconEdit size={15} /></button>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full bg-[#2E8C99] rounded-full transition-all" style={{ width: `${rate}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
