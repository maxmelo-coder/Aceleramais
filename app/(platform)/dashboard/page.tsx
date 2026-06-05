'use client';
import React, { useState } from 'react';
import StatCard from '@/components/StatCard';
import { LineChart, Gauge } from '@/components/Charts';
import Badge from '@/components/Badge';
import {
  IconSchool, IconClasses, IconStudents, IconTeacher,
  IconEval, IconIndex, IconDownload, IconFilter, IconMapPin,
  IconTraining, IconReports, IconSMART, IconAction, IconAlert,
} from '@/components/Icons';
import { scoreByTrimester, municipiosData } from '@/lib/mock-data';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet } from '@/lib/storage';

const indexColors = {
  critico:      '#E30613',
  desenvolvimento: '#F48B1B',
  bom:          '#2E8C99',
  excelente:    '#059669',
};

export default function Dashboard() {
  const [filterTrim, setFilterTrim] = useState('2');
  const { selected, setSelected, all } = useMunicipio();
  const [escolas] = useState(() => storageGet<any[]>('acelera_escolas', selected.schools));
  const [turmas] = useState(() => storageGet<any[]>('acelera_turmas', []));
  const [avaliacoes] = useState(() => storageGet<any[]>('acelera_avaliacoes', []));
  const [formacoes] = useState(() => storageGet<any[]>('acelera_formacoes', []));
  const [metas] = useState(() => storageGet<any[]>('acelera_metas', []));
  const [planos] = useState(() => storageGet<any[]>('acelera_planos', []));
  const schoolCount = escolas.filter((s: any) => s.municipioId === selected.id).length || selected.schools.length;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Geral</h1>
          <p className="text-sm text-gray-500">
            Rede Municipal de Ensino · Ano letivo 2025
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selected.id}
            onChange={e => {
              const m = all.find(x => x.id === e.target.value);
              if (m) setSelected(m);
            }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]"
          >
            {all.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <select
            value={filterTrim}
            onChange={e => setFilterTrim(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]"
          >
            <option value="1">1º Trimestre</option>
            <option value="2">2º Trimestre (ativo)</option>
            <option value="3">3º Trimestre</option>
            <option value="4">4º Trimestre</option>
          </select>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 transition-colors">
            <IconFilter size={14} />
            <span>Filtros</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm bg-[#2E8C99] text-white rounded-lg px-3 py-2 hover:bg-[#226E79] transition-colors">
            <IconDownload size={14} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Índice Acelera+ */}
      <div className="bg-[#060606] rounded-2xl p-6 flex flex-wrap items-center gap-6">
        <div className="flex-shrink-0">
          <Gauge value={0} color={indexColors.critico} label="Índice Acelera+" size={120} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold text-2xl">—</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white/60">
              Aguardando dados
            </span>
          </div>
          <p className="text-white font-semibold">Índice Acelera+ — {selected.name}</p>
          <p className="text-white/50 text-sm mt-1">
            Calculado com base em participação, desempenho, uso do material, formações, evidências e metas SMART.
          </p>
          <div className="mt-3 flex flex-wrap gap-6">
            {[
              { label: 'Participação discente', value: '—' },
              { label: 'Média dos estudantes',  value: '—' },
              { label: 'Participação docente',  value: '—' },
              { label: 'Execução do projeto',   value: '—' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-white/40 text-xs">{item.label}</p>
                <p className="text-white/30 font-bold text-lg leading-none">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-auto">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Satisfação docente',    value: '—' },
              { label: 'Satisfação Secretaria', value: '—' },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3 bg-white/5">
                <p className="text-white/60 text-xs">{item.label}</p>
                <p className="font-bold text-xl text-white/30">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards — 12 itens */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard title="Municípios"          value={municipiosData.length}  subtitle="parceiros"               icon={<IconMapPin size={18} />}    color="blue" />
        <StatCard title="Escolas"             value={schoolCount}            subtitle={`em ${selected.name}`}  icon={<IconSchool size={18} />}    color="blue" />
        <StatCard title="Turmas"              value={turmas.filter((t: any) => !t.municipioId || t.municipioId === selected.id).length || 0} subtitle={turmas.length === 0 ? 'a cadastrar' : 'cadastradas'} icon={<IconClasses size={18} />}   color="blue" />
        <StatCard title="Estudantes avaliados" value={turmas.reduce((a: number, t: any) => a + (t.studentCount || 0), 0) || '—'} subtitle="total nas turmas" icon={<IconStudents size={18} />}  color="orange" />
        <StatCard title="Avaliações"          value={avaliacoes.length || 0} subtitle={avaliacoes.length === 0 ? 'a cadastrar' : 'diagnósticas'}  icon={<IconEval size={18} />}      color="green" />
        <StatCard title="Aval. Docentes"      value={storageGet<any[]>('acelera_forms_docente', []).length || 0} subtitle="formulários"  icon={<IconTeacher size={18} />}   color="purple" />
        <StatCard title="Formações"           value={formacoes.length || 0}  subtitle={formacoes.length === 0 ? 'a cadastrar' : 'realizadas'}      icon={<IconTraining size={18} />}  color="orange" />
        <StatCard title="% Presença Formações" value={formacoes.length > 0 ? Math.round(formacoes.reduce((a: number, f: any) => a + (f.presencaPct || 0), 0) / formacoes.length) + '%' : '—'} subtitle="média" icon={<IconTraining size={18} />}  color="green" />
        <StatCard title="% Desempenho Médio"  value="—"                      subtitle="estudantes"              icon={<IconIndex size={18} />}     color="orange" accent />
        <StatCard title="Metas SMART"         value={metas.length || 0}      subtitle={metas.length === 0 ? 'a cadastrar' : 'definidas'}           icon={<IconSMART size={18} />}     color="blue" />
        <StatCard title="Planos de Ação"      value={planos.length || 0}     subtitle={planos.length === 0 ? 'a cadastrar' : 'cadastrados'}         icon={<IconAction size={18} />}    color="gray" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Evolução por Trimestre</h3>
            <Badge label="2025" variant="blue" />
          </div>
          {scoreByTrimester.every(d => d.value === 0) ? (
            <div className="h-40 flex flex-col items-center justify-center text-center">
              <IconReports size={32} className="text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">Nenhum dado disponível ainda</p>
            </div>
          ) : (
            <LineChart data={scoreByTrimester} height={140} maxValue={10} />
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Desempenho por Escola</h3>
            <Badge label={selected.name} variant="orange" />
          </div>
          {selected.schools.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center">
              <IconSchool size={32} className="text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">Nenhuma escola cadastrada ainda</p>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-center">
              <IconSchool size={32} className="text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">Aguardando dados de desempenho</p>
            </div>
          )}
        </div>
      </div>

      {/* Alertas */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <IconAlert size={18} className="text-[#F48B1B]" />
          <h3 className="font-semibold text-gray-900">Alertas e Pendências</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
            <IconAlert size={22} className="text-green-400" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Nenhum alerta no momento</p>
          <p className="text-gray-400 text-xs mt-1">Os alertas aparecerão aqui quando houver planos atrasados, avaliações pendentes ou metas em risco.</p>
        </div>
      </div>

      {/* Empty state geral */}
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF3E2] flex items-center justify-center mx-auto mb-4">
          <IconSchool size={28} className="text-[#F48B1B]" />
        </div>
        <h3 className="font-semibold text-gray-900 text-lg">
          {selected.name} — {schoolCount} escola{schoolCount !== 1 ? 's' : ''} cadastrada{schoolCount !== 1 ? 's' : ''}
        </h3>
        <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
          Os dados deste município ainda não foram preenchidos. Acesse as seções de <strong>Escolas</strong>, <strong>Turmas</strong> e <strong>Avaliações</strong> para começar o cadastro.
        </p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <a href="/escolas" className="px-4 py-2 bg-[#F48B1B] text-white rounded-xl text-sm font-semibold hover:bg-[#D4720E] transition-colors">
            Cadastrar escolas
          </a>
          <a href="/turmas" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            Cadastrar turmas
          </a>
        </div>
      </div>
    </div>
  );
}
