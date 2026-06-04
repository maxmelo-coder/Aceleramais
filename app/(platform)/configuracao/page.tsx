'use client';
import React, { useState } from 'react';
import Badge, { statusBadge } from '@/components/Badge';
import { IconPlus, IconEdit, IconCalendar, IconCheck } from '@/components/Icons';
import { projectConfig, trimesters } from '@/lib/mock-data';

export default function ConfiguracaoPage() {
  const [activeTab, setActiveTab] = useState<'projeto' | 'ciclos' | 'avaliacoes' | 'indicadores'>('projeto');

  const tabs = [
    { key: 'projeto' as const, label: 'Projeto' },
    { key: 'ciclos' as const, label: 'Ciclos Trimestrais' },
    { key: 'avaliacoes' as const, label: 'Criar Avaliação' },
    { key: 'indicadores' as const, label: 'Indicadores' },
  ];

  const indicators = [
    { label: '% estudantes avaliados', active: true, value: '89%' },
    { label: 'Média geral por turma', active: true, value: '7,4' },
    { label: 'Participação professores', active: true, value: '78%' },
    { label: 'Frequência nas formações', active: true, value: '91%' },
    { label: 'Execução material didático', active: true, value: '88%' },
    { label: 'Engajamento estudantes', active: true, value: 'Alto' },
    { label: 'Satisfação docente', active: true, value: '4,3/5' },
    { label: 'Satisfação Secretaria', active: true, value: '4,0/5' },
    { label: 'Cumprimento metas SMART', active: true, value: '67%' },
    { label: 'Índice Eleva+ de Execução', active: true, value: '79%' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Configuração da Plataforma</h1>
        <p className="text-sm text-gray-500">Estruture o projeto, ciclos, avaliações e indicadores antes da aplicação</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all
              ${activeTab === tab.key
                ? 'border-[#F48B1B] text-[#F48B1B]'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projeto */}
      {activeTab === 'projeto' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Configuração do Projeto</h3>
            <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
              <IconEdit size={14} />
              Editar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Nome do projeto', value: projectConfig.projectName },
              { label: 'Rede/Município', value: projectConfig.networkName },
              { label: 'Ano letivo', value: String(projectConfig.year) },
              { label: 'Período de execução', value: projectConfig.executionPeriod },
              { label: 'Empresa responsável', value: projectConfig.company },
              { label: 'Coordenadora', value: projectConfig.coordinator },
              { label: 'Alunos estimados', value: String(projectConfig.estimatedStudents) },
              { label: 'Professores estimados', value: String(projectConfig.estimatedTeachers) },
            ].map(f => (
              <div key={f.label}>
                <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                <p className="text-sm font-medium text-gray-800">{f.value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Descrição</p>
            <p className="text-sm text-gray-700">{projectConfig.description}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Séries atendidas</p>
            <div className="flex flex-wrap gap-2">
              {projectConfig.series.map(s => (
                <Badge key={s} label={s} variant="blue" size="md" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ciclos */}
      {activeTab === 'ciclos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Gerencie os ciclos trimestrais de avaliação</p>
            <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-[#D4720E] transition-colors">
              <IconPlus size={14} />
              Novo ciclo
            </button>
          </div>
          {trimesters.map(t => {
            const sb = statusBadge(t.status);
            return (
              <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm
                      ${t.status === 'ativo' ? 'bg-[#F48B1B]' : t.status === 'encerrado' ? 'bg-gray-400' : 'bg-gray-200'}`}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t.name} — {t.year}</p>
                      <p className="text-xs text-gray-500">{t.startDate} até {t.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={sb.label} variant={sb.variant} />
                    <button className="p-1.5 text-gray-400 hover:text-[#F48B1B] hover:bg-[#FEF3E2] rounded-lg transition-colors">
                      <IconEdit size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Criar Avaliação */}
      {activeTab === 'avaliacoes' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-5">Criar nova avaliação diagnóstica</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Título da avaliação', type: 'text', placeholder: 'Ex.: Diagnóstica de Criatividade' },
              { label: 'Série/Ano', type: 'select', options: ['4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano'] },
              { label: 'Trimestre', type: 'select', options: ['1º Trimestre', '2º Trimestre', '3º Trimestre', '4º Trimestre'] },
              { label: 'Competência avaliada', type: 'text', placeholder: 'Ex.: Criatividade e Inovação' },
              { label: 'Habilidade avaliada', type: 'text', placeholder: 'Ex.: Geração de ideias' },
              { label: 'Pontuação total', type: 'number', placeholder: '100' },
              { label: 'Data de aplicação', type: 'date' },
              { label: 'Status', type: 'select', options: ['rascunho', 'publicada', 'aplicada'] },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                {f.type === 'select' ? (
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99] bg-white">
                    {f.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type} placeholder={f.placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]" />
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tipo de questão</label>
              <div className="flex flex-wrap gap-2">
                {['Objetiva', 'Discursiva', 'Múltipla escolha', 'Escala Likert', 'Autoavaliação', 'Estudo de caso'].map(t => (
                  <button key={t} className="px-3 py-1.5 text-xs rounded-full border border-gray-200 hover:border-[#2E8C99] hover:text-[#2E8C99] hover:bg-[#EBF6F7] transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button className="px-4 py-2 text-sm bg-[#F48B1B] text-white rounded-lg hover:bg-[#D4720E] font-medium">Criar avaliação</button>
          </div>
        </div>
      )}

      {/* Indicadores */}
      {activeTab === 'indicadores' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Indicadores da plataforma</h3>
            <p className="text-xs text-gray-400 mt-0.5">Ative, edite ou crie novos indicadores de acompanhamento</p>
          </div>
          <div className="divide-y divide-gray-50">
            {indicators.map(ind => (
              <div key={ind.label} className="px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-5 rounded-full flex-shrink-0 relative cursor-pointer transition-colors
                    ${ind.active ? 'bg-[#2E8C99]' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
                      ${ind.active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                  <p className="text-sm text-gray-800">{ind.label}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#2E8C99]">{ind.value}</span>
                  <button className="p-1.5 text-gray-400 hover:text-[#F48B1B] hover:bg-[#FEF3E2] rounded-lg transition-colors">
                    <IconEdit size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
