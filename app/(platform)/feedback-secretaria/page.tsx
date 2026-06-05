'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconFeedback, IconPlus, IconX, IconSave } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { SecretaryFeedback, FeedbackType, FeedbackStatus } from '@/lib/types';

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
  </svg>
);

const TIPOS: { value: FeedbackType; label: string }[] = [
  { value: 'avaliacao_geral',    label: 'Avaliação geral' },
  { value: 'execucao_projeto',   label: 'Execução do projeto' },
  { value: 'formacao_docente',   label: 'Formação docente' },
  { value: 'material_didatico',  label: 'Material didático' },
  { value: 'resultados',         label: 'Resultados' },
  { value: 'prestacao_contas',   label: 'Prestação de contas' },
  { value: 'ajustes',            label: 'Ajustes' },
];

const STATUS_CONFIG: Record<FeedbackStatus, { label: string; variant: 'green' | 'yellow' | 'red' | 'blue'; dot: string }> = {
  positivo:  { label: 'Positivo',  variant: 'green',  dot: 'bg-green-500' },
  atencao:   { label: 'Atenção',   variant: 'yellow', dot: 'bg-yellow-500' },
  critico:   { label: 'Crítico',   variant: 'red',    dot: 'bg-red-500' },
  resolvido: { label: 'Resolvido', variant: 'blue',   dot: 'bg-blue-500' },
};

function emptyForm() {
  return {
    id: '',
    userName: '',
    municipioId: '',
    municipioName: '',
    tipo: 'avaliacao_geral' as FeedbackType,
    status: 'positivo' as FeedbackStatus,
    texto: '',
    trimestre: '2º Trimestre',
  };
}

export default function FeedbackSecretariaPage() {
  const { selected, all } = useMunicipio();
  const [feedbacks, setFeedbacks] = useState<SecretaryFeedback[]>(() => storageGet('acelera_feedback', []));
  const [filterMunicipio, setFilterMunicipio] = useState('todos');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { storageSet('acelera_feedback', feedbacks); }, [feedbacks]);

  const filtered = feedbacks.filter(f => {
    if (filterMunicipio !== 'todos' && f.municipioId !== filterMunicipio) return false;
    if (filterTipo !== 'todos' && f.tipo !== filterTipo) return false;
    if (filterStatus !== 'todos' && f.status !== filterStatus) return false;
    return true;
  });

  function openNew() { setForm(emptyForm()); setSaved(false); setShowModal(true); }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.texto.trim()) { alert('Texto do feedback é obrigatório.'); return; }
    const munName = all.find(m => m.id === form.municipioId)?.name ?? selected.name;
    setFeedbacks(prev => [...prev, {
      ...form, id: 'fb' + Date.now(),
      userId: 'u001',
      municipioName: munName || form.municipioName,
      createdAt: new Date().toISOString(),
    }]);
    setSaved(true);
    setTimeout(closeModal, 1200);
  }

  function setField(key: string, value: string) {
    if (!form) return;
    setForm({ ...form, [key]: value } as typeof form);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback da Secretaria</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registros de feedback dos secretários municipais</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <IconPlus size={15} /> Novo feedback
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterMunicipio} onChange={e => setFilterMunicipio(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os municípios</option>
          {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os tipos</option>
          {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os status</option>
          {(Object.keys(STATUS_CONFIG) as FeedbackStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total" value={feedbacks.length} icon={<IconFeedback size={18} />} color="blue" />
        <StatCard title="Positivos"  value={feedbacks.filter(f => f.status === 'positivo').length}  icon={<IconFeedback size={18} />} color="green" />
        <StatCard title="Críticos"   value={feedbacks.filter(f => f.status === 'critico').length}   icon={<IconFeedback size={18} />} color="red" />
        <StatCard title="Resolvidos" value={feedbacks.filter(f => f.status === 'resolvido').length} icon={<IconFeedback size={18} />} color="orange" />
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <IconFeedback size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum feedback registrado ainda</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">Registre feedbacks dos secretários para acompanhar a percepção sobre o projeto.</p>
          <button onClick={openNew}
            className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
            <IconPlus size={15} /> Novo feedback
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(f => {
            const sc = STATUS_CONFIG[f.status];
            const tipoLabel = TIPOS.find(t => t.value === f.tipo)?.label ?? f.tipo;
            return (
              <div key={f.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{f.userName || 'Secretário(a)'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{f.municipioName}</p>
                  </div>
                  <Badge label={sc.label} variant={sc.variant} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">{tipoLabel}</span>
                  <span className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{f.texto}</p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => { if (confirm('Confirmar exclusão?')) setFeedbacks(prev => prev.filter(x => x.id !== f.id)); }}
                    title="Excluir"
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Novo Feedback</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Secretário(a)</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.userName} onChange={e => setField('userName', e.target.value)} placeholder="Nome do secretário(a)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Município</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.municipioId} onChange={e => setField('municipioId', e.target.value)}>
                    <option value="">Selecione</option>
                    {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Trimestre</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.trimestre} onChange={e => setField('trimestre', e.target.value)}>
                    {['1º Trimestre', '2º Trimestre', '3º Trimestre', '4º Trimestre'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.tipo} onChange={e => setField('tipo', e.target.value)}>
                    {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.status} onChange={e => setField('status', e.target.value)}>
                    {(Object.keys(STATUS_CONFIG) as FeedbackStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Texto do feedback *</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  rows={4} value={form.texto} onChange={e => setField('texto', e.target.value)}
                  placeholder="Descreva o feedback recebido..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
