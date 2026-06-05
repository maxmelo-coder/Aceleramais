'use client';
import React, { useState } from 'react';
import StatCard from '@/components/StatCard';
import { BarChart, HBarChart, DonutChart, LineChart, Gauge } from '@/components/Charts';
import Badge from '@/components/Badge';
import {
  IconSchool, IconClasses, IconStudents, IconTeacher,
  IconEval, IconIndex, IconAlert, IconTrend, IconDownload,
  IconFilter,
} from '@/components/Icons';
import {
  dashboardStats, scoreBySchool, participationBySchool,
  scoreByTrimester, materialUsageData, competenciasData, schools,
} from '@/lib/mock-data';

const indexColors = {
  critico: '#E30613',
  desenvolvimento: '#F48B1B',
  bom: '#2E8C99',
  excelente: '#059669',
};
const indexLabels = {
  critico: 'Atenção Crítica',
  desenvolvimento: 'Em Desenvolvimento',
  bom: 'Bom Andamento',
  excelente: 'Excelente Execução',
};

export default function Dashboard() {
  const [filterTrim, setFilterTrim] = useState('2');
  const stats = dashboardStats;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Geral</h1>
          <p className="text-sm text-gray-500">Rede Municipal de Ensino — Limoeiro de Anadia, AL · Ano letivo 2025</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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

      {/* Índice Acelera+ em destaque */}
      <div className="bg-[#060606] rounded-2xl p-6 flex flex-wrap items-center gap-6">
        <div className="flex-shrink-0">
          <Gauge
            value={stats.elevaIndex}
            color={indexColors[stats.elevaIndexLevel]}
            label="Índice Acelera+"
            size={120}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold text-2xl">{stats.elevaIndex}%</span>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: indexColors[stats.elevaIndexLevel] + '33', color: indexColors[stats.elevaIndexLevel] }}
            >
              {indexLabels[stats.elevaIndexLevel]}
            </span>
          </div>
          <p className="text-white font-semibold">Índice Acelera+ de Execução do Projeto</p>
          <p className="text-white/50 text-sm mt-1">
            Calculado com base em participação, desempenho, uso do material, formações, evidências e metas SMART.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            {[
              { label: 'Participação discente', value: `${stats.evaluationResponseRate}%` },
              { label: 'Média dos estudantes', value: `${stats.avgStudentScore}` },
              { label: 'Participação docente', value: `${stats.teacherTrainingParticipation}%` },
              { label: 'Execução do projeto', value: `${stats.projectExecutionLevel}%` },
            ].map(item => (
              <div key={item.label}>
                <p className="text-white/40 text-xs">{item.label}</p>
                <p className="text-white font-bold text-lg leading-none">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-auto">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Satisfação docente', value: `${stats.teacherSatisfaction}/5`, ok: stats.teacherSatisfaction >= 4 },
              { label: 'Satisfação Secretaria', value: `${stats.secretarySatisfaction}/5`, ok: stats.secretarySatisfaction >= 4 },
            ].map(item => (
              <div key={item.label} className={`rounded-xl p-3 ${item.ok ? 'bg-[#2E8C99]/20' : 'bg-[#F48B1B]/20'}`}>
                <p className="text-white/60 text-xs">{item.label}</p>
                <p className={`font-bold text-xl ${item.ok ? 'text-[#4BAAB6]' : 'text-[#FFA94D]'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Escolas" value={stats.totalSchools} subtitle="Todas ativas" icon={<IconSchool size={18} />} color="blue" />
        <StatCard title="Turmas" value={stats.totalClasses} subtitle="Em 5 escolas" icon={<IconClasses size={18} />} color="blue" />
        <StatCard title="Estudantes" value={stats.totalStudents.toLocaleString('pt-BR')} subtitle="Matriculados" icon={<IconStudents size={18} />} color="orange" />
        <StatCard title="Professores" value={stats.totalTeachers} subtitle="Vinculados" icon={<IconTeacher size={18} />} color="blue" />
        <StatCard title="Resp. Avaliações" value={`${stats.evaluationResponseRate}%`} subtitle="Do total esperado" icon={<IconEval size={18} />} color="green" trend={{ value: 8, label: 'vs 1º Trim.' }} />
        <StatCard title="Média Geral" value={stats.avgStudentScore.toFixed(1)} subtitle="Estudantes" icon={<IconIndex size={18} />} color="orange" trend={{ value: 5, label: 'vs 1º Trim.' }} accent />
      </div>

      {/* Alertas */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <IconAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Alertas de atenção</p>
          <ul className="mt-1 space-y-0.5">
            <li className="text-xs text-amber-700">• <strong>EMEF Dep. José Freitas</strong> — Participação abaixo de 75% no 2º trimestre (72%)</li>
            <li className="text-xs text-amber-700">• <strong>4 professores</strong> ainda não responderam o formulário docente do 2º trimestre</li>
            <li className="text-xs text-amber-700">• <strong>Avaliação de Ed. Financeira (9º ano)</strong> — Aplicação pendente</li>
          </ul>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score by school */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Desempenho por Escola</h3>
            <Badge label="2º Trimestre" variant="blue" />
          </div>
          <BarChart data={scoreBySchool} height={180} maxValue={10} unit="" />
        </div>

        {/* Participation by school */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Participação por Escola</h3>
            <Badge label="2º Trimestre" variant="blue" />
          </div>
          <HBarChart data={participationBySchool} unit="%" />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution by trimester */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">Evolução do Desempenho por Trimestre</h3>
          <LineChart data={scoreByTrimester} height={160} maxValue={10} />
        </div>

        {/* Material usage donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Uso do Material Didático</h3>
          <DonutChart data={materialUsageData} centerLabel="docentes" centerValue="47" />
        </div>
      </div>

      {/* Ranking e Competências */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School ranking */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Ranking de Escolas — Índice Acelera+</h3>
            <IconTrend size={16} className="text-[#2E8C99]" />
          </div>
          <div className="space-y-3">
            {[...schools]
              .sort((a, b) => b.elevaIndex - a.elevaIndex)
              .map((school, i) => (
                <div key={school.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${i === 0 ? 'bg-[#F48B1B] text-white' : i === 1 ? 'bg-[#2E8C99] text-white' : i === 2 ? 'bg-[#4BAAB6] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{school.name}</p>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${school.elevaIndex}%`,
                          backgroundColor: school.elevaIndex >= 80 ? '#059669' : school.elevaIndex >= 60 ? '#2E8C99' : '#F48B1B',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 flex-shrink-0">{school.elevaIndex}%</span>
                </div>
              ))}
          </div>
        </div>

        {/* Competências */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Desempenho por Competência</h3>
          <HBarChart data={competenciasData} unit="%" />
        </div>
      </div>
    </div>
  );
}
