'use client';
import React, { useState } from 'react';
import { BarChart, LineChart } from '@/components/Charts';
import Badge from '@/components/Badge';
import { IconReports, IconDownload, IconEye } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { scoreByTrimester } from '@/lib/mock-data';
import type { ReportType } from '@/lib/types';

const tabLabels = ['Relatórios', 'Gráficos', 'Exportações'] as const;
type Tab = typeof tabLabels[number];

interface ReportCard {
  type: ReportType;
  title: string;
  description: string;
  icon: string;
}

const REPORTS: ReportCard[] = [
  { type: 'geral_municipio',     title: 'Relatório Geral do Município',  description: 'Visão completa do município com todos os indicadores.', icon: '🏙️' },
  { type: 'por_escola',          title: 'Por Escola',                    description: 'Desempenho e participação por unidade escolar.', icon: '🏫' },
  { type: 'por_turma',           title: 'Por Turma',                     description: 'Resultados detalhados por turma e série.', icon: '🧑‍🎓' },
  { type: 'desempenho_discente', title: 'Desempenho Discente',           description: 'Notas e evolução dos estudantes por trimestre.', icon: '📈' },
  { type: 'avaliacao_docente',   title: 'Avaliação Docente',             description: 'Participação e médias das avaliações dos professores.', icon: '👩‍🏫' },
  { type: 'formacao_docente',    title: 'Formação Docente',              description: 'Carga horária, presença e cobertura das formações.', icon: '📚' },
  { type: 'feedback_secretaria', title: 'Feedback da Secretaria',        description: 'Consolidado dos feedbacks recebidos por município.', icon: '💬' },
  { type: 'execucao_projeto',    title: 'Execução do Projeto',           description: 'Nível de execução e cumprimento das metas gerais.', icon: '🎯' },
  { type: 'prestacao_contas',    title: 'Prestação de Contas',           description: 'Relatório para prestação de contas e evidências.', icon: '📋' },
];

export default function RelatoriosPage() {
  const { selected, all } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Relatórios');
  const [filterMunicipio, setFilterMunicipio] = useState(selected.id);
  const [filterPeriodo, setFilterPeriodo] = useState('2');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Gráficos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Geração e exportação de relatórios analíticos</p>
        </div>
      </div>

      {/* Global Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white rounded-2xl border border-gray-100 p-4">
        <span className="text-sm font-medium text-gray-600">Filtros:</span>
        <select value={filterMunicipio} onChange={e => setFilterMunicipio(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os municípios</option>
          {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterPeriodo} onChange={e => setFilterPeriodo(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="1">1º Trimestre 2025</option>
          <option value="2">2º Trimestre 2025</option>
          <option value="3">3º Trimestre 2025</option>
          <option value="4">4º Trimestre 2025</option>
          <option value="anual">Anual 2025</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabLabels.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Relatórios' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORTS.map(r => (
            <div key={r.type} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">{r.title}</h3>
              </div>
              <p className="text-xs text-gray-500">{r.description}</p>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-[#F48B1B]/10 text-[#D4720E] hover:bg-[#F48B1B]/20 py-2 rounded-lg font-medium transition-colors">
                  <IconEye size={13} /> Gerar relatório
                </button>
                <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition-colors">
                  <IconDownload size={13} /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Gráficos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Evolução por Trimestre</h3>
              <Badge label="2025" variant="blue" />
            </div>
            {scoreByTrimester.every(d => d.value === 0) ? (
              <div className="h-40 flex flex-col items-center justify-center text-center">
                <IconReports size={32} className="text-gray-200 mb-2" />
                <p className="text-gray-400 text-sm">Nenhum dado disponível</p>
              </div>
            ) : (
              <LineChart data={scoreByTrimester} height={140} />
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Desempenho por Escola</h3>
              <Badge label={selected.name} variant="orange" />
            </div>
            <div className="h-40 flex flex-col items-center justify-center text-center">
              <IconReports size={32} className="text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">Aguardando dados de desempenho</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Participação nas Avaliações</h3>
              <Badge label="por escola" variant="blue" />
            </div>
            <div className="h-40 flex flex-col items-center justify-center text-center">
              <IconReports size={32} className="text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">Aguardando dados de participação</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Presença nas Formações</h3>
              <Badge label="% por formação" variant="green" />
            </div>
            <div className="h-40 flex flex-col items-center justify-center text-center">
              <IconReports size={32} className="text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">Aguardando dados de formações</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'Exportações' && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
          <IconDownload size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma exportação gerada</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">Acesse a aba "Relatórios" e clique em "Exportar PDF" para gerar exportações.</p>
        </div>
      )}
    </div>
  );
}
