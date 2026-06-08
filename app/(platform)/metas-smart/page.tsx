'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconSMART, IconPlus, IconEdit, IconEye, IconX, IconSave } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { SmartGoal, GoalStatus } from '@/lib/types';

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
  </svg>
);

const STATUS_CONFIG: Record<GoalStatus, { label: string; variant: 'gray' | 'blue' | 'green' | 'red' | 'purple' }> = {
  nao_iniciada: { label: 'Não iniciada', variant: 'gray'   },
  em_andamento: { label: 'Em andamento', variant: 'blue'   },
  concluida:    { label: 'Concluída',    variant: 'green'  },
  atrasada:     { label: 'Atrasada',     variant: 'red'    },
  cancelada:    { label: 'Cancelada',    variant: 'purple' },
};

function emptyForm() {
  return {
    id: '',
    title: '',
    municipioId: '',
    municipioName: '',
    schoolId: '',
    responsible: '',
    especifica: '',
    mensuravel: '',
    atingivel: '',
    relevante: '',
    temporal: '',
    deadline: '',
    initialValue: 0,
    targetValue: 0,
    currentValue: 0,
    status: 'nao_iniciada' as GoalStatus,
    origem: '',
    observations: '',
  };
}

export default function MetasSmartPage() {
  const { selected, all } = useMunicipio();
  const [filterMunicipio, setFilterMunicipio] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [metas, setMetas] = useState<SmartGoal[]>(() => storageGet('acelera_metas', []));
  const [showModal, setShowModal] = useState(false);
  const [viewMeta, setViewMeta] = useState<SmartGoal | null>(null);

  useEffect(() => { storageSet('acelera_metas', metas); }, [metas]);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);
  const [newCurrent, setNewCurrent] = useState(0);
  const [newStatus, setNewStatus] = useState<GoalStatus>('em_andamento');

  const filtered = metas.filter(m => {
    if (filterMunicipio !== 'todos' && m.municipioId !== filterMunicipio) return false;
    if (filterStatus !== 'todos' && m.status !== filterStatus) return false;
    return true;
  });

  function openNew() { setForm(emptyForm()); setSaved(false); setShowModal(true); }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function openEdit(m: SmartGoal) {
    setForm({
      id: m.id,
      title: m.title,
      municipioId: m.municipioId || '',
      municipioName: m.municipioName || '',
      schoolId: m.schoolId || '',
      responsible: m.responsible,
      especifica: m.especifica,
      mensuravel: m.mensuravel,
      atingivel: m.atingivel,
      relevante: m.relevante,
      temporal: m.temporal,
      deadline: m.deadline,
      initialValue: m.initialValue,
      targetValue: m.targetValue,
      currentValue: m.currentValue,
      status: m.status,
      origem: m.origem || '',
      observations: m.observations || '',
    });
    setSaved(false);
    setShowModal(true);
  }

  function openView(m: SmartGoal) {
    setViewMeta(m);
    setNewCurrent(m.currentValue);
    setNewStatus(m.status);
  }

  function updateProgress() {
    if (!viewMeta) return;
    setMetas(prev => prev.map(m => m.id === viewMeta.id
      ? { ...m, currentValue: newCurrent, status: newStatus }
      : m
    ));
    setViewMeta(null);
  }

  function handleSave() {
    if (!form) return;
    if (!form.title.trim()) { alert('Título é obrigatório.'); return; }
    const munName = all.find(m => m.id === form.municipioId)?.name ?? '';
    if (form.id) {
      setMetas(prev => prev.map(m => m.id === form.id ? {
        ...m,
        title: form.title,
        municipioId: form.municipioId || undefined,
        municipioName: munName || m.municipioName,
        schoolId: form.schoolId || undefined,
        responsible: form.responsible,
        especifica: form.especifica,
        mensuravel: form.mensuravel,
        atingivel: form.atingivel,
        relevante: form.relevante,
        temporal: form.temporal,
        deadline: form.deadline,
        initialValue: Number(form.initialValue),
        targetValue: Number(form.targetValue),
        currentValue: Number(form.currentValue),
        status: form.status,
        origem: form.origem || undefined,
        observations: form.observations || undefined,
      } : m));
    } else {
      setMetas(prev => [...prev, {
        id: 'mt' + Date.now(),
        title: form.title,
        municipioId: form.municipioId || undefined,
        municipioName: munName || undefined,
        schoolId: form.schoolId || undefined,
        responsible: form.responsible,
        especifica: form.especifica,
        mensuravel: form.mensuravel,
        atingivel: form.atingivel,
        relevante: form.relevante,
        temporal: form.temporal,
        deadline: form.deadline,
        initialValue: Number(form.initialValue),
        targetValue: Number(form.targetValue),
        currentValue: Number(form.currentValue),
        status: form.status,
        origem: form.origem || undefined,
        observations: form.observations || undefined,
      }]);
    }
    setSaved(true);
    setTimeout(closeModal, 1200);
  }

  function setField(key: string, value: string | number) {
    if (!form) return;
    setForm({ ...form, [key]: value } as typeof form);
  }

  function getProgress(m: SmartGoal): number {
    if (m.targetValue === 0) return 0;
    return Math.min(Math.round((m.currentValue / m.targetValue) * 100), 100);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Metas SMART</h1>
          <p className="text-sm text-gray-500 mt-0.5">Definição e acompanhamento de metas específicas e mensuráveis</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <IconPlus size={15} /> Nova meta
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total"       value={metas.length} icon={<IconSMART size={18} />} color="blue" />
        <StatCard title="Em andamento" value={metas.filter(m => m.status === 'em_andamento').length} icon={<IconSMART size={18} />} color="orange" />
        <StatCard title="Concluídas"  value={metas.filter(m => m.status === 'concluida').length}  icon={<IconSMART size={18} />} color="green" />
        <StatCard title="Atrasadas"   value={metas.filter(m => m.status === 'atrasada').length}   icon={<IconSMART size={18} />} color="red" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterMunicipio} onChange={e => setFilterMunicipio(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os municípios</option>
          {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os status</option>
          {(Object.keys(STATUS_CONFIG) as GoalStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <IconSMART size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma meta cadastrada ainda</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">Defina metas SMART para acompanhar o progresso do projeto com indicadores claros.</p>
          <button onClick={openNew}
            className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
            <IconPlus size={15} /> Nova meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => {
            const sc = STATUS_CONFIG[m.status];
            const progress = getProgress(m);
            return (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm flex-1">{m.title}</h3>
                  <Badge label={sc.label} variant={sc.variant} />
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  {m.municipioName && <p>📍 {m.municipioName}</p>}
                  {m.responsible && <p>👤 {m.responsible}</p>}
                  {m.deadline && <p>📅 Prazo: {new Date(m.deadline).toLocaleDateString('pt-BR')}</p>}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progresso</span>
                    <span className="font-semibold text-gray-700">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: m.status === 'atrasada' ? '#EF4444' : m.status === 'concluida' ? '#10B981' : '#F48B1B',
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors"><IconEdit size={14} /></button>
                  <button onClick={() => openView(m)} className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors"><IconEye size={14} /></button>
                  <button
                    onClick={() => { if (confirm('Confirmar exclusão?')) setMetas(prev => prev.filter(x => x.id !== m.id)); }}
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

      {/* View Modal */}
      {viewMeta && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Detalhe da Meta</h3>
              <button onClick={() => setViewMeta(null)} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-gray-900">{viewMeta.title}</h4>
                {viewMeta.municipioName && <p className="text-xs text-gray-500 mt-1">📍 {viewMeta.municipioName}</p>}
                {viewMeta.responsible && <p className="text-xs text-gray-500">👤 {viewMeta.responsible}</p>}
              </div>
              <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm">
                {viewMeta.especifica && <p><span className="font-semibold text-blue-700">S:</span> {viewMeta.especifica}</p>}
                {viewMeta.mensuravel && <p><span className="font-semibold text-blue-700">M:</span> {viewMeta.mensuravel}</p>}
                {viewMeta.atingivel && <p><span className="font-semibold text-blue-700">A:</span> {viewMeta.atingivel}</p>}
                {viewMeta.relevante && <p><span className="font-semibold text-blue-700">R:</span> {viewMeta.relevante}</p>}
                {viewMeta.temporal && <p><span className="font-semibold text-blue-700">T:</span> {viewMeta.temporal}</p>}
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progresso</span>
                  <span className="font-semibold text-gray-700">{getProgress(viewMeta)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${getProgress(viewMeta)}%`, backgroundColor: viewMeta.status === 'atrasada' ? '#EF4444' : viewMeta.status === 'concluida' ? '#10B981' : '#F48B1B' }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Inicial: {viewMeta.initialValue}</span>
                  <span>Atual: {viewMeta.currentValue}</span>
                  <span>Meta: {viewMeta.targetValue}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Atualizar Progresso</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Valor atual</label>
                    <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                      value={newCurrent} onChange={e => setNewCurrent(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                      value={newStatus} onChange={e => setNewStatus(e.target.value as GoalStatus)}>
                      {(Object.keys(STATUS_CONFIG) as GoalStatus[]).map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={updateProgress}
                  className="w-full bg-[#2E8C99] hover:bg-[#247885] text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Salvar Progresso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">{form?.id ? 'Editar Meta SMART' : 'Nova Meta SMART'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Título da meta *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Título da meta" />
              </div>
              <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Critérios SMART</p>
                {[
                  { key: 'especifica',  label: 'S — Específica',  placeholder: 'O que exatamente queremos alcançar?' },
                  { key: 'mensuravel',  label: 'M — Mensurável',  placeholder: 'Como vamos medir o progresso?' },
                  { key: 'atingivel',   label: 'A — Atingível',   placeholder: 'É realista com os recursos disponíveis?' },
                  { key: 'relevante',   label: 'R — Relevante',   placeholder: 'Por que esta meta é importante?' },
                  { key: 'temporal',    label: 'T — Temporal',    placeholder: 'Qual o prazo para alcançar?' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-blue-600 mb-1">{f.label}</label>
                    <input className="w-full border border-blue-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300/40"
                      value={(form as any)[f.key]} onChange={e => setField(f.key, e.target.value)} placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Município</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.municipioId} onChange={e => setField('municipioId', e.target.value)}>
                    <option value="">Selecione</option>
                    {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Responsável</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.responsible} onChange={e => setField('responsible', e.target.value)} placeholder="Nome" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Prazo</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.deadline} onChange={e => setField('deadline', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valor inicial</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.initialValue} onChange={e => setField('initialValue', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valor meta</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.targetValue} onChange={e => setField('targetValue', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valor atual</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.currentValue} onChange={e => setField('currentValue', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.status} onChange={e => setField('status', e.target.value)}>
                    {(Object.keys(STATUS_CONFIG) as GoalStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar meta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
