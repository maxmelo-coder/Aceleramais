'use client';
import React, { useState } from 'react';
import { BarChart, LineChart, DonutChart, HBarChart } from '@/components/Charts';
import { Gauge } from '@/components/Charts';
import Badge from '@/components/Badge';
import {
  IconDownload, IconFilter, IconReports, IconSchool,
  IconEval, IconTeacher,
} from '@/components/Icons';
import {
  scoreBySchool, participationBySchool, scoreByTrimester,
  materialUsageData, competenciasData, dashboardStats, schools,
} from '@/lib/mock-data';

type ReportType = 'rede' | 'escola' | 'trimestre' | 'docente' | 'executivo';

export default function RelatoriosPage() {
  const [reportType, setReportType] = useState<ReportType>('rede');

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatórios e Gráficos</h1>
          <p className="text-sm text-gray-500">Análise completa por escola, turma e trimestre</p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#2E8C99] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#226E79] transition-colors shadow-sm">
          <IconDownload size={16} />
          Exportar PDF
        </button>
      </div>

      {/* Report type tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: 'rede', label: 'Relatório Geral da Rede' },
          { key: 'escola', label: 'Por Escola' },
          { key: 'trimestre', label: 'Por Trimestre' },
          { key: 'docente', label: 'Docente' },
          { key: 'executivo', label: 'Executivo' },
        ] as { key: ReportType; label: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setReportType(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${reportType === tab.key
                ? 'bg-[#060606] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report content */}
      {reportType === 'rede' && (
        <div className="space-y-6">
          {/* KPI Summary */}
          <div className="bg-[#060606] rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">Relatório Geral — Rede Municipal de Ensino</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Índice Eleva+', value: `${dashboardStats.elevaIndex}%`, color: '#F48B1B' },
                { label: 'Média estudantes', value: dashboardStats.avgStudentScore.toFixed(1), color: '#2E8C99' },
                { label: 'Participação', value: `${dashboardStats.evaluationResponseRate}%`, color: '#4BAAB6' },
                { label: 'Satisfação docente', value: `${dashboardStats.teacherSatisfaction}/5`, color: '#059669' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-white/50 text-xs mb-1">{item.label}</p>
                  <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Desempenho por Escola</h3>
              <BarChart data={scoreBySchool} height={180} maxValue={10} />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Participação por Escola</h3>
              <HBarChart data={participationBySchool} unit="%" />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Evolução Trimestral</h3>
              <LineChart data={scoreByTrimester} height={160} maxValue={10} />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Uso do Material Didático</h3>
              <DonutChart data={materialUsageData} centerLabel="professores" centerValue="47" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Competências Empreendedoras — Desempenho Médio</h3>
            <BarChart data={competenciasData} height={180} maxValue={100} unit="%" />
          </div>
        </div>
      )}

      {reportType === 'escola' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Comparativo entre escolas</h3>
          {schools.map(s => (
            <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{s.name}</h4>
                  <p className="text-xs text-gray-500">{s.classCount} turmas · {s.studentCount} alunos</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Média</p>
                    <p className="text-xl font-bold text-[#2E8C99]">{s.avgScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Participação</p>
                    <p className="text-xl font-bold text-[#F48B1B]">{s.participationRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Índice</p>
                    <p className="text-xl font-bold" style={{ color: s.elevaIndex >= 80 ? '#059669' : s.elevaIndex >= 60 ? '#2E8C99' : '#F48B1B' }}>{s.elevaIndex}%</p>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full rounded-full transition-all" style={{ width: `${s.elevaIndex}%`, backgroundColor: s.elevaIndex >= 80 ? '#059669' : s.elevaIndex >= 60 ? '#2E8C99' : '#F48B1B' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {reportType === 'trimestre' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Evolução de Desempenho por Trimestre</h3>
            <LineChart data={scoreByTrimester} height={200} maxValue={10} />
          </div>
          <div className="bg-[#EBF6F7] rounded-2xl p-5 border border-[#2E8C99]/20">
            <h3 className="font-semibold text-[#226E79] mb-3">Recomendações pedagógicas — 2º Trimestre</h3>
            <ul className="space-y-2 text-sm text-[#2E8C99]">
              <li>• Intensificar o suporte à EMEF Dep. José Freitas com tutoria pedagógica focada em competências de comunicação</li>
              <li>• Ampliar o uso de atividades práticas de resolução de problemas nas turmas de 7º e 8º anos</li>
              <li>• Reforçar a formação docente em educação financeira antes da aplicação do 3º trimestre</li>
              <li>• Incentivar registro de evidências em escolas com menos de 2 registros no trimestre</li>
            </ul>
          </div>
        </div>
      )}

      {(reportType === 'docente' || reportType === 'executivo') && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <IconReports size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Relatório em geração…</p>
          <p className="text-sm text-gray-400 mt-1">Selecione os filtros e clique em Exportar PDF para gerar o relatório completo.</p>
          <button className="mt-4 flex items-center gap-2 mx-auto bg-[#2E8C99] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-[#226E79] transition-colors">
            <IconDownload size={16} />
            Gerar e baixar PDF
          </button>
        </div>
      )}
    </div>
  );
}
