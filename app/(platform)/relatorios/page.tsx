'use client';
import React, { useState } from 'react';
import { LineChart } from '@/components/Charts';
import Badge from '@/components/Badge';
import { IconReports, IconDownload, IconEye } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet } from '@/lib/storage';

type ReportView = 'por_estudante' | 'por_turma' | 'por_escola' | 'rede_municipal' | 'ranking_municipio';

const REPORT_TABS: { key: ReportView; label: string }[] = [
  { key: 'por_estudante',    label: 'Por Estudante' },
  { key: 'por_turma',        label: 'Por Turma' },
  { key: 'por_escola',       label: 'Por Escola' },
  { key: 'rede_municipal',   label: 'Rede Municipal' },
  { key: 'ranking_municipio', label: 'Ranking por Município' },
];

type Tab = 'Relatórios' | 'Gráficos';

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  const a = document.createElement('a');
  a.href = uri;
  a.download = filename;
  a.click();
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
      <IconReports size={36} className="text-gray-300 mb-3" />
      <p className="text-gray-500 font-medium">{message}</p>
      <p className="text-gray-400 text-xs mt-1">Os dados aparecerão aqui quando houver respostas registradas.</p>
    </div>
  );
}

export default function RelatoriosPage() {
  const { selected, all } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Relatórios');
  const [reportView, setReportView] = useState<ReportView>('por_estudante');

  const estudantes = storageGet<any[]>('acelera_respostas_estudantes', []);
  const docentes   = storageGet<any[]>('acelera_forms_docente', []);

  // ─── Por Estudante ────────────────────────────────────────────
  function renderPorEstudante() {
    if (estudantes.length === 0) return <EmptyState message="Nenhuma resposta de estudante encontrada" />;
    const headers = ['Nome', 'Escola', 'Turma', 'Professor', 'Série', 'Acertos', 'Nota', 'NPS', 'Data'];
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Respostas dos Estudantes</h3>
          <button onClick={() => downloadCSV('estudantes.csv', [headers, ...estudantes.map((r: any) => [r.studentName, r.escola, r.turma, r.professor, r.serie, r.acertos != null ? r.acertos : '', r.score != null ? r.score : '', r.nps >= 0 ? r.nps : '', new Date(r.submittedAt).toLocaleDateString('pt-BR')])])}
            className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
            <IconDownload size={13} /> Exportar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              {headers.map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {estudantes.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.studentName || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.escola || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.turma || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.professor || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.serie || '—'}</td>
                  <td className="px-4 py-3 text-center">{r.acertos != null ? r.acertos : '—'}</td>
                  <td className="px-4 py-3 text-center font-semibold text-[#F48B1B]">{r.score != null ? r.score : '—'}</td>
                  <td className="px-4 py-3 text-center font-semibold">{r.nps >= 0 ? r.nps : '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.submittedAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Por Turma ────────────────────────────────────────────────
  function renderPorTurma() {
    if (estudantes.length === 0) return <EmptyState message="Nenhum dado de turma disponível" />;
    const byTurma = estudantes.reduce((acc: Record<string, any[]>, r: any) => {
      const key = r.turma || 'Não informado';
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});
    const rows = Object.entries(byTurma).map(([turma, rs]) => ({
      turma, count: rs.length,
      escola: (rs[0] as any).escola || '—',
      professor: (rs[0] as any).professor || '—',
      avgNPS: rs.filter((r: any) => r.nps >= 0).length > 0
        ? (rs.filter((r: any) => r.nps >= 0).reduce((a: number, r: any) => a + r.nps, 0) / rs.filter((r: any) => r.nps >= 0).length).toFixed(1)
        : '—',
      avgScore: rs.filter((r: any) => r.score != null).length > 0
        ? (rs.filter((r: any) => r.score != null).reduce((a: number, r: any) => a + r.score, 0) / rs.filter((r: any) => r.score != null).length).toFixed(1)
        : '—',
    }));
    const headers = ['Turma', 'Escola', 'Professor', 'Estudantes', 'Nota Média', 'NPS Médio'];
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Relatório por Turma</h3>
          <button onClick={() => downloadCSV('turmas.csv', [headers, ...rows.map(r => [r.turma, r.escola, r.professor, String(r.count), String(r.avgScore), String(r.avgNPS)])])}
            className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
            <IconDownload size={13} /> Exportar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              {headers.map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(r => (
                <tr key={r.turma} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.turma}</td>
                  <td className="px-4 py-3 text-gray-600">{r.escola}</td>
                  <td className="px-4 py-3 text-gray-600">{r.professor}</td>
                  <td className="px-4 py-3 text-center">{r.count}</td>
                  <td className="px-4 py-3 text-center font-semibold text-[#F48B1B]">{r.avgScore}</td>
                  <td className="px-4 py-3 text-center font-semibold text-[#2E8C99]">{r.avgNPS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Por Escola ───────────────────────────────────────────────
  function renderPorEscola() {
    if (estudantes.length === 0) return <EmptyState message="Nenhum dado por escola disponível" />;
    const byEscola = estudantes.reduce((acc: Record<string, any[]>, r: any) => {
      const key = r.escola || 'Não informado';
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});
    const rows = Object.entries(byEscola).map(([escola, rs]) => ({
      escola,
      count: rs.length,
      avgScore: rs.filter((r: any) => r.score != null).length > 0
        ? (rs.filter((r: any) => r.score != null).reduce((a: number, r: any) => a + r.score, 0) / rs.filter((r: any) => r.score != null).length).toFixed(1)
        : '—',
      avgNPS: rs.filter((r: any) => r.nps >= 0).length > 0
        ? (rs.filter((r: any) => r.nps >= 0).reduce((a: number, r: any) => a + r.nps, 0) / rs.filter((r: any) => r.nps >= 0).length).toFixed(1)
        : '—',
    }));
    const headers = ['Escola', 'Estudantes', 'Nota Média', 'NPS Médio'];
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Relatório por Escola</h3>
          <button onClick={() => downloadCSV('escolas.csv', [headers, ...rows.map(r => [r.escola, String(r.count), String(r.avgScore), String(r.avgNPS)])])}
            className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
            <IconDownload size={13} /> Exportar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              {headers.map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(r => (
                <tr key={r.escola} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.escola}</td>
                  <td className="px-4 py-3 text-center">{r.count}</td>
                  <td className="px-4 py-3 text-center font-semibold text-[#F48B1B]">{r.avgScore}</td>
                  <td className="px-4 py-3 text-center font-semibold text-[#2E8C99]">{r.avgNPS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Rede Municipal ───────────────────────────────────────────
  function renderRedeMunicipal() {
    if (docentes.length === 0 && estudantes.length === 0) return <EmptyState message="Nenhum dado da rede municipal disponível" />;
    const headers = ['Métrica', 'Valor'];
    const rows = [
      ['Respostas de Professores', String(docentes.length)],
      ['Respostas de Estudantes', String(estudantes.length)],
      ['Índice de Implementação Médio', docentes.length > 0 ? Math.round(docentes.reduce((a: number, r: any) => a + (r.indiceImplementacao||0),0)/docentes.length) + '%' : '—'],
      ['Índice de Aprendizagem Médio', docentes.length > 0 ? Math.round(docentes.reduce((a: number, r: any) => a + (r.indiceAprendizagem||0),0)/docentes.length) + '%' : '—'],
      ['Índice de Competências Médio', docentes.length > 0 ? Math.round(docentes.reduce((a: number, r: any) => a + (r.indiceCompetencias||0),0)/docentes.length) + '%' : '—'],
      ['Nota Média Estudantes', estudantes.filter((r: any) => r.score != null).length > 0 ? (estudantes.filter((r: any) => r.score != null).reduce((a: number, r: any) => a + r.score, 0) / estudantes.filter((r: any) => r.score != null).length).toFixed(1) : '—'],
      ['Média de Acertos', estudantes.filter((r: any) => r.acertos != null).length > 0 ? (estudantes.filter((r: any) => r.acertos != null).reduce((a: number, r: any) => a + r.acertos, 0) / estudantes.filter((r: any) => r.acertos != null).length).toFixed(1) : '—'],
      ['NPS Estudantes Médio', estudantes.filter((r: any) => r.nps >= 0).length > 0 ? (estudantes.filter((r: any) => r.nps >= 0).reduce((a: number, r: any) => a + r.nps, 0) / estudantes.filter((r: any) => r.nps >= 0).length).toFixed(1) : '—'],
      ['NPS Professores Médio', docentes.filter((r: any) => r.b9_nps >= 0).length > 0 ? (docentes.filter((r: any) => r.b9_nps >= 0).reduce((a: number, r: any) => a + r.b9_nps, 0) / docentes.filter((r: any) => r.b9_nps >= 0).length).toFixed(1) : '—'],
    ];
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Relatório da Rede Municipal</h3>
          <button onClick={() => downloadCSV('rede_municipal.csv', [headers, ...rows])}
            className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
            <IconDownload size={13} /> Exportar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              {headers.map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(([label, val]) => (
                <tr key={label} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{label}</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Ranking por Município ────────────────────────────────────
  function renderRankingMunicipio() {
    if (docentes.length === 0) return <EmptyState message="Nenhum dado de município disponível" />;
    const byMunicipio = docentes.reduce((acc: Record<string, any[]>, r: any) => {
      const key = r.municipio || 'Não informado';
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});
    const rows = Object.entries(byMunicipio)
      .map(([municipio, rs]) => ({
        municipio,
        count: rs.length,
        indImpl:  Math.round(rs.reduce((a: number, r: any) => a + (r.indiceImplementacao||0),0) / rs.length),
        indApre:  Math.round(rs.reduce((a: number, r: any) => a + (r.indiceAprendizagem||0),0) / rs.length),
        indComp:  Math.round(rs.reduce((a: number, r: any) => a + (r.indiceCompetencias||0),0) / rs.length),
        indAuto:  Math.round(rs.reduce((a: number, r: any) => a + (r.indiceAutoeficacia||0),0) / rs.length),
      }))
      .sort((a, b) => (b.indImpl + b.indApre) - (a.indImpl + a.indApre));
    const headers = ['#', 'Município', 'Respostas', 'Implementação', 'Aprendizagem', 'Competências', 'Autoeficácia'];
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Ranking por Município</h3>
          <button onClick={() => downloadCSV('ranking_municipio.csv', [headers, ...rows.map((r, i) => [String(i+1), r.municipio, String(r.count), r.indImpl+'%', r.indApre+'%', r.indComp+'%', r.indAuto+'%'])])}
            className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
            <IconDownload size={13} /> Exportar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              {headers.map(h => <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((r, i) => (
                <tr key={r.municipio} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-500">#{i+1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.municipio}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{r.count}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600">{r.indImpl}%</td>
                  <td className="px-4 py-3 text-center font-semibold text-green-600">{r.indApre}%</td>
                  <td className="px-4 py-3 text-center font-semibold text-orange-500">{r.indComp}%</td>
                  <td className="px-4 py-3 text-center font-semibold text-purple-600">{r.indAuto}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Gráficos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Geração e exportação de relatórios analíticos</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['Relatórios', 'Gráficos'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Relatórios' && (
        <div className="space-y-5">
          {/* Report type tabs */}
          <div className="flex flex-wrap gap-2">
            {REPORT_TABS.map(rt => (
              <button key={rt.key} onClick={() => setReportView(rt.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${reportView === rt.key ? 'bg-[#F48B1B] text-white border-[#F48B1B]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                {rt.label}
              </button>
            ))}
          </div>

          {reportView === 'por_estudante'     && renderPorEstudante()}
          {reportView === 'por_turma'         && renderPorTurma()}
          {reportView === 'por_escola'        && renderPorEscola()}
          {reportView === 'rede_municipal'    && renderRedeMunicipal()}
          {reportView === 'ranking_municipio' && renderRankingMunicipio()}
        </div>
      )}

      {tab === 'Gráficos' && (() => {
        // Build evolução por mês from student responses
        const byMonth = estudantes.reduce((acc: Record<string, number[]>, r: any) => {
          if (r.score == null || !r.submittedAt) return acc;
          const d = new Date(r.submittedAt);
          const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
          if (!acc[key]) acc[key] = [];
          acc[key].push(r.score);
          return acc;
        }, {});
        const evolucaoData = Object.entries(byMonth).map(([label, vals]) => ({
          label,
          value: parseFloat((vals.reduce((a, v) => a + v, 0) / vals.length).toFixed(1)),
        }));

        // Build desempenho por escola
        const byEscolaChart = estudantes.reduce((acc: Record<string, number[]>, r: any) => {
          if (r.score == null) return acc;
          const key = r.escola || 'Não informado';
          if (!acc[key]) acc[key] = [];
          acc[key].push(r.score);
          return acc;
        }, {});
        const escolaData = Object.entries(byEscolaChart).map(([label, vals]) => ({
          label,
          value: parseFloat((vals.reduce((a, v) => a + v, 0) / vals.length).toFixed(1)),
        }));
        const maxEscolaVal = escolaData.length > 0 ? Math.max(...escolaData.map(d => d.value)) : 10;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Evolução por Mês</h3>
                <Badge label="Nota média" variant="blue" />
              </div>
              {evolucaoData.length < 2 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center">
                  <IconReports size={32} className="text-gray-200 mb-2" />
                  <p className="text-gray-400 text-sm">Dados insuficientes (mínimo 2 meses)</p>
                </div>
              ) : (
                <LineChart data={evolucaoData} height={140} />
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Desempenho por Escola</h3>
                <Badge label={selected.name} variant="orange" />
              </div>
              {escolaData.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center">
                  <IconReports size={32} className="text-gray-200 mb-2" />
                  <p className="text-gray-400 text-sm">Aguardando dados de desempenho</p>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  {escolaData.map(d => (
                    <div key={d.label} className="space-y-0.5">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span className="truncate max-w-[60%]">{d.label}</span>
                        <span className="font-semibold text-[#F48B1B]">{d.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#F48B1B] rounded-full" style={{ width: `${(d.value / maxEscolaVal) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
