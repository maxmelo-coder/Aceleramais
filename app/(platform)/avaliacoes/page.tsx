'use client';
import React, { useState } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconEval, IconPlus, IconEdit, IconEye, IconX, IconSave, IconLink } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import type { DiagnosticAssessment, EvaluationStatus, EtapaEnsino } from '@/lib/types';

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

export default function AvaliacoesPage() {
  const { selected } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Avaliações');
  const [avaliacoes, setAvaliacoes] = useState<DiagnosticAssessment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);

  const publicadas = avaliacoes.filter(a => a.status === 'publicada').length;
  const aplicadas = avaliacoes.filter(a => a.status === 'aplicada').length;

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
                                <a href={`/avaliacao/${a.id}`} target="_blank" rel="noopener noreferrer" title="Ver link público"
                                  className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors">
                                  <IconLink size={15} />
                                </a>
                              )}
                              <button title="Ver respostas" className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors">
                                <IconEye size={15} />
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

      {/* Modal */}
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
    </div>
  );
}
