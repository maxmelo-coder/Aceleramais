'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconEval, IconPlus, IconEdit, IconEye, IconX, IconSave, IconLink } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { DiagnosticAssessment, EvaluationStatus, EtapaEnsino } from '@/lib/types';
import { getBancoQuestoesBySerie } from '@/lib/banco-questoes';

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
  </svg>
);

const ETAPAS: EtapaEnsino[] = ['EF Anos Iniciais', 'EF Anos Finais', 'EJA'];
const SERIES = ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano', 'EJA'];
const TRIMESTRES = ['1º Trimestre', '2º Trimestre', '3º Trimestre', '4º Trimestre'];

const tabLabels = ['Avaliações', 'Resultados', 'Questões'] as const;
type Tab = typeof tabLabels[number];

const statusConfig: Record<EvaluationStatus, { label: string; variant: 'yellow' | 'blue' | 'green' | 'gray' }> = {
  rascunho:  { label: 'Rascunho',  variant: 'yellow' },
  publicada: { label: 'Publicada', variant: 'blue'   },
  aplicada:  { label: 'Aplicada',  variant: 'green'  },
  encerrada: { label: 'Encerrada', variant: 'gray'   },
};

interface RespostaEstudante {
  id: string;
  assessmentId: string;
  studentName: string;
  cidade: string;
  escola: string;
  turma: string;
  professor: string;
  serie: string;
  respostas: Record<string, string>;
  score: number;
  acertos: number;
  totalQuestoes: number;
  nps: number;
  satisfacao: number;
  moduloFavorito: string;
  gostou: string;
  melhorar: string;
  submittedAt: string;
}

function emptyForm() {
  return {
    id: '',
    title: '',
    etapa: 'EF Anos Iniciais' as EtapaEnsino,
    serie: '5º ano',
    trimestre: '2º Trimestre',
    competencia: '',
    status: 'rascunho' as EvaluationStatus,
  };
}

function exportCsv(rows: RespostaEstudante[], assessmentTitle: string) {
  const headers = ['Nome', 'Escola', 'Turma', 'Série', 'Acertos', 'Nota', 'NPS', 'Data'];
  const lines = rows.map(r => [
    r.studentName,
    r.escola,
    r.turma,
    r.serie,
    r.acertos,
    r.score,
    r.nps,
    new Date(r.submittedAt).toLocaleDateString('pt-BR'),
  ].join(';'));
  const csv = [headers.join(';'), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `respostas-${assessmentTitle.replace(/\s+/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Avaliações pré-semeadas com IDs fixos
const SEED_AVALIACOES: DiagnosticAssessment[] = [
  {
    id: 'diagnostico-8ano-negocios-2025',
    title: 'Avaliação Diagnóstica — Módulo Negócios · 8º ano',
    etapa: 'EF Anos Finais',
    serie: '8º ano',
    trimestre: '2º Trimestre',
    competencia: 'Empreendedorismo e Negócios',
    status: 'publicada',
    respondents: 0,
    totalStudents: 0,
    avgScore: 0,
    createdAt: '2025-01-01T00:00:00.000Z',
    publicUrl: '/avaliacao/diagnostico-8ano-negocios-2025',
  },
  {
    id: 'diagnostico-9ano-negocios-2025',
    title: 'Avaliação Diagnóstica — Módulo Negócios · 9º ano',
    etapa: 'EF Anos Finais',
    serie: '9º ano',
    trimestre: '2º Trimestre',
    competencia: 'Empreendedorismo e Negócios',
    status: 'publicada',
    respondents: 0,
    totalStudents: 0,
    avgScore: 0,
    createdAt: '2025-01-01T00:00:00.000Z',
    publicUrl: '/avaliacao/diagnostico-9ano-negocios-2025',
  },
];

const SEED_IDS = SEED_AVALIACOES.map(a => a.id);

function initAvaliacoes(): DiagnosticAssessment[] {
  const stored = storageGet<DiagnosticAssessment[]>('acelera_avaliacoes', []);
  // Remove avaliação antiga unificada se existir
  const withoutOld = stored.filter(a => a.id !== 'diagnostico-89-negocios-2025');
  // Adiciona seeds que ainda não existem
  const missingSeed = SEED_AVALIACOES.filter(s => !withoutOld.some(a => a.id === s.id));
  if (missingSeed.length > 0 || withoutOld.length !== stored.length) {
    const merged = [...missingSeed, ...withoutOld];
    storageSet('acelera_avaliacoes', merged);
    return merged;
  }
  return withoutOld;
}

export default function AvaliacoesPage() {
  const { selected } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Avaliações');
  const [avaliacoes, setAvaliacoes] = useState<DiagnosticAssessment[]>(() => initAvaliacoes());
  const [showModal, setShowModal] = useState(false);
  const [respostasPanel, setRespostasPanel] = useState<DiagnosticAssessment | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyLink(id: string) {
    const url = `${window.location.origin}/avaliacao/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  }

  useEffect(() => { storageSet('acelera_avaliacoes', avaliacoes); }, [avaliacoes]);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);
  const [respostasServidor, setRespostasServidor] = useState<RespostaEstudante[]>([]);

  function authHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('eleva_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Carrega respostas do servidor na montagem e faz merge com localStorage
  useEffect(() => {
    fetch('/api/estudantes', { headers: authHeaders() }).then(r => r.json()).then((server: RespostaEstudante[]) => {
      if (!Array.isArray(server)) return;
      const local = storageGet<RespostaEstudante[]>('acelera_respostas_estudantes', []);
      const map = new Map<string, RespostaEstudante>();
      local.forEach(r => map.set(r.id, r));
      server.forEach(r => map.set(r.id, r));
      const merged = Array.from(map.values());
      storageSet('acelera_respostas_estudantes', merged);
      setRespostasServidor(merged);
    }).catch(() => {
      setRespostasServidor(storageGet<RespostaEstudante[]>('acelera_respostas_estudantes', []));
    });
  }, []);

  const publicadas = avaliacoes.filter(a => a.status === 'publicada').length;
  const aplicadas = avaliacoes.filter(a => a.status === 'aplicada').length;

  // Banco de questões notice derived from form serie
  const formBanco = form ? getBancoQuestoesBySerie(form.serie) : undefined;

  function openNew() { setForm(emptyForm()); setSaved(false); setShowModal(true); }
  function openEdit(a: DiagnosticAssessment) {
    setForm({ id: a.id, title: a.title, etapa: a.etapa, serie: a.serie, trimestre: a.trimestre, competencia: a.competencia, status: a.status });
    setSaved(false); setShowModal(true);
  }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.title.trim()) { alert('Título é obrigatório.'); return; }
    const exists = avaliacoes.find(a => a.id === form.id);
    if (exists) {
      setAvaliacoes(prev => prev.map(a => a.id === form.id ? { ...a, ...form } : a));
    } else {
      setAvaliacoes(prev => [...prev, {
        ...form, id: 'av' + Date.now(),
        respondents: 0, totalStudents: 0, avgScore: 0,
        createdAt: new Date().toISOString(),
        publicUrl: '/avaliacao/av' + Date.now(),
      }]);
    }
    setSaved(true);
    setTimeout(closeModal, 1200);
  }

  function setField(key: string, value: string) {
    if (!form) return;
    setForm({ ...form, [key]: value } as typeof form);
  }

  // Respostas panel data — usa dados do servidor (já mergeado com localStorage)
  const todasRespostas = respostasServidor.length > 0
    ? respostasServidor
    : storageGet<RespostaEstudante[]>('acelera_respostas_estudantes', []);
  const respostasFiltradas = respostasPanel
    ? todasRespostas.filter(r => r.assessmentId === respostasPanel.id || r.assessmentId?.startsWith(respostasPanel.id))
    : [];
  const mediaAcertos = respostasFiltradas.length > 0
    ? (respostasFiltradas.reduce((s, r) => s + r.acertos, 0) / respostasFiltradas.length).toFixed(1)
    : '—';
  const mediaNota = respostasFiltradas.length > 0
    ? (respostasFiltradas.reduce((s, r) => s + r.score, 0) / respostasFiltradas.length).toFixed(1)
    : '—';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliações Diagnósticas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Criação, publicação e análise de avaliações</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <IconPlus size={15} /> Nova avaliação
        </button>
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

      {tab === 'Avaliações' && (
        <>
          {/* Banner de links ativos */}
          {avaliacoes.filter(a => a.status === 'publicada').length > 0 && (
            <div className="bg-gradient-to-r from-[#2E8C99]/10 to-[#F48B1B]/10 border border-[#2E8C99]/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E8C99" strokeWidth="2" className="flex-shrink-0">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span className="font-semibold text-gray-900 text-sm">Links para os estudantes</span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {avaliacoes.filter(a => a.status === 'publicada').length} ativo{avaliacoes.filter(a => a.status === 'publicada').length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-2">
                {avaliacoes.filter(a => a.status === 'publicada').map(a => {
                  const url = typeof window !== 'undefined' ? `${window.location.origin}/avaliacao/${a.id}` : `/avaliacao/${a.id}`;
                  const copied = copiedId === a.id;
                  return (
                    <div key={a.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{a.title}</p>
                        <p className="text-xs text-[#2E8C99] font-mono truncate mt-0.5">{url}</p>
                      </div>
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium transition-colors border border-gray-200">
                        Abrir
                      </a>
                      <button onClick={() => copyLink(a.id)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          copied
                            ? 'bg-green-500 text-white border border-green-500'
                            : 'bg-[#F48B1B] hover:bg-[#D4720E] text-white border border-[#F48B1B]'
                        }`}>
                        {copied ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20,6 9,17 4,12"/>
                            </svg>
                            Copiado!
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            Copiar link
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3">📱 Compartilhe este link com os estudantes via WhatsApp, e-mail ou projetor.</p>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Total" value={avaliacoes.length} icon={<IconEval size={18} />} color="blue" />
            <StatCard title="Publicadas" value={publicadas} icon={<IconEval size={18} />} color="orange" />
            <StatCard title="Aplicadas" value={aplicadas} icon={<IconEval size={18} />} color="green" />
            <StatCard title="Respostas" value={avaliacoes.reduce((a, x) => a + x.respondents, 0)} icon={<IconEval size={18} />} color="blue" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Avaliações cadastradas</h2>
              <span className="text-sm text-gray-400">{avaliacoes.length} avaliação{avaliacoes.length !== 1 ? 'ões' : ''}</span>
            </div>
            {avaliacoes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <IconEval size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhuma avaliação criada ainda</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">Crie uma avaliação diagnóstica para aplicar com os estudantes.</p>
                <button onClick={openNew}
                  className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
                  <IconPlus size={15} /> Nova avaliação
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left font-medium">Título</th>
                      <th className="px-6 py-3 text-left font-medium">Etapa</th>
                      <th className="px-6 py-3 text-left font-medium">Série</th>
                      <th className="px-6 py-3 text-left font-medium">Trimestre</th>
                      <th className="px-6 py-3 text-center font-medium">Status</th>
                      <th className="px-6 py-3 text-center font-medium">Respostas</th>
                      <th className="px-6 py-3 text-center font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {avaliacoes.map(a => {
                      const sc = statusConfig[a.status];
                      return (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{a.title}</td>
                          <td className="px-6 py-4 text-gray-600">{a.etapa}</td>
                          <td className="px-6 py-4 text-gray-600">{a.serie}</td>
                          <td className="px-6 py-4 text-gray-600">{a.trimestre}</td>
                          <td className="px-6 py-4 text-center">
                            <Badge label={sc.label} variant={sc.variant} />
                          </td>
                          <td className="px-6 py-4 text-center text-gray-700">{a.respondents}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => openEdit(a)} title="Editar" className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors">
                                <IconEdit size={15} />
                              </button>
                              {a.status === 'publicada' && (
                                <>
                                  <a href={`/avaliacao/${a.id}`} target="_blank" rel="noopener noreferrer" title="Abrir formulário"
                                    className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors">
                                    <IconLink size={15} />
                                  </a>
                                  <button onClick={() => copyLink(a.id)} title="Copiar link para estudantes"
                                    className={`p-1.5 rounded-lg transition-all ${copiedId === a.id ? 'text-green-600 bg-green-50' : 'text-[#F48B1B] hover:bg-orange-50'}`}>
                                    {copiedId === a.id ? (
                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                                    ) : (
                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                      </svg>
                                    )}
                                  </button>
                                </>
                              )}
                              <button title="Ver respostas" onClick={() => setRespostasPanel(a)} className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors">
                                <IconEye size={15} />
                              </button>
                              <button
                                onClick={() => { if (confirm('Confirmar exclusão?')) setAvaliacoes(prev => prev.filter(x => x.id !== a.id)); }}
                                title="Excluir"
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'Resultados' && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
          <IconEval size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum resultado disponível</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">Os resultados aparecerão aqui após as avaliações serem aplicadas e respondidas pelos estudantes.</p>
        </div>
      )}

      {tab === 'Questões' && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
          <IconEval size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Banco de questões vazio</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">Crie uma avaliação para adicionar questões ao banco.</p>
        </div>
      )}

      {/* Modal Criar/Editar Avaliação */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">{form.id ? 'Editar Avaliação' : 'Nova Avaliação'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Ex: Avaliação Diagnóstica — 2º Trimestre 5º ano" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Etapa</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.etapa} onChange={e => setField('etapa', e.target.value)}>
                    {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Série</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.serie} onChange={e => setField('serie', e.target.value)}>
                    {SERIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Trimestre</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.trimestre} onChange={e => setField('trimestre', e.target.value)}>
                    {TRIMESTRES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.status} onChange={e => setField('status', e.target.value)}>
                    <option value="rascunho">Rascunho</option>
                    <option value="publicada">Publicada</option>
                    <option value="aplicada">Aplicada</option>
                    <option value="encerrada">Encerrada</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Competência</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.competencia} onChange={e => setField('competencia', e.target.value)} placeholder="Ex: Empreendedorismo e Inovação" />
              </div>

              {/* Banco de questões notice */}
              {formBanco && (
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
                  <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div>
                    <p className="font-semibold">Banco de questões disponível: "{formBanco.titulo}" ({formBanco.questoes.length} questões)</p>
                    <p className="text-blue-600 mt-0.5">Essas questões serão exibidas automaticamente no formulário público dos estudantes.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar avaliação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Painel de respostas */}
      {respostasPanel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Respostas dos estudantes</h3>
                <p className="text-sm text-gray-500 mt-0.5">{respostasPanel.title}</p>
              </div>
              <button onClick={() => setRespostasPanel(null)} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>

            {/* Resumo */}
            {respostasFiltradas.length > 0 && (
              <div className="px-6 py-4 border-b border-gray-100 flex gap-6 flex-shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#F48B1B]">{respostasFiltradas.length}</p>
                  <p className="text-xs text-gray-500">estudantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#2E8C99]">{mediaAcertos}</p>
                  <p className="text-xs text-gray-500">média de acertos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{mediaNota}</p>
                  <p className="text-xs text-gray-500">nota média</p>
                </div>
                <div className="ml-auto flex items-center">
                  <button
                    onClick={() => exportCsv(respostasFiltradas, respostasPanel.title)}
                    className="flex items-center gap-2 bg-[#2E8C99] hover:bg-[#256e78] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Exportar CSV
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-y-auto flex-1">
              {respostasFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <IconEval size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Nenhuma resposta ainda</p>
                  <p className="text-gray-400 text-sm mt-1">Os estudantes precisam acessar o link público e responder.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr className="text-xs text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3 text-left font-medium">Nome</th>
                        <th className="px-6 py-3 text-left font-medium">Escola</th>
                        <th className="px-6 py-3 text-left font-medium">Turma</th>
                        <th className="px-6 py-3 text-left font-medium">Série</th>
                        <th className="px-6 py-3 text-center font-medium">Acertos</th>
                        <th className="px-6 py-3 text-center font-medium">Nota</th>
                        <th className="px-6 py-3 text-center font-medium">NPS</th>
                        <th className="px-6 py-3 text-left font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {respostasFiltradas.map(r => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 font-medium text-gray-900">{r.studentName}</td>
                          <td className="px-6 py-3 text-gray-600">{r.escola || '—'}</td>
                          <td className="px-6 py-3 text-gray-600">{r.turma || '—'}</td>
                          <td className="px-6 py-3 text-gray-600">{r.serie || '—'}</td>
                          <td className="px-6 py-3 text-center">
                            {r.totalQuestoes > 0
                              ? <span className="font-semibold text-gray-800">{r.acertos}/{r.totalQuestoes}</span>
                              : <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {r.totalQuestoes > 0 ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                r.score >= 7 ? 'bg-green-100 text-green-700' : r.score >= 5 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                              }`}>{r.score.toFixed(1)}</span>
                            ) : <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {r.nps >= 0 ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                r.nps >= 9 ? 'bg-green-100 text-green-700' : r.nps >= 7 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                              }`}>{r.nps}</span>
                            ) : <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-6 py-3 text-gray-500 text-xs">{new Date(r.submittedAt).toLocaleDateString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
