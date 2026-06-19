'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconTraining, IconPlus, IconEdit, IconEye, IconX, IconSave } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { TrainingSession, TrainingModality } from '@/lib/types';

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
  </svg>
);

const tabLabels = ['Formações', 'Presenças', 'Histórico'] as const;
type Tab = typeof tabLabels[number];

const MODALIDADES: { value: TrainingModality; label: string }[] = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'online',     label: 'Online'     },
  { value: 'hibrida',    label: 'Híbrida'    },
];

const modalBadge: Record<TrainingModality, { label: string; variant: 'blue' | 'green' | 'orange' }> = {
  presencial: { label: 'Presencial', variant: 'blue'   },
  online:     { label: 'Online',     variant: 'green'  },
  hibrida:    { label: 'Híbrida',    variant: 'orange' },
};

function emptyForm() {
  return {
    id: '',
    title: '',
    municipioId: '',
    municipioName: '',
    schools: [] as string[],
    date: '',
    startTime: '',
    cargaHoraria: 2,
    modalidade: 'presencial' as TrainingModality,
    formador: '',
    temas: '',
    objetivos: '',
    totalProfessores: 0,
  };
}

export default function FormacoesPage() {
  const { selected, all } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Formações');
  const [sessions, setSessions] = useState<TrainingSession[]>(() => storageGet('acelera_formacoes', []));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { storageSet('acelera_formacoes', sessions); }, [sessions]);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);

  const totalCarga = sessions.reduce((a, s) => a + s.cargaHoraria, 0);
  const mediaPresenca = sessions.length > 0
    ? Math.round(sessions.reduce((a, s) => a + s.presencaPct, 0) / sessions.length)
    : 0;
  const formadores = new Set(sessions.map(s => s.formador).filter(Boolean)).size;

  function openNew() { setForm(emptyForm()); setSaved(false); setShowModal(true); }
  function openEdit(s: TrainingSession) {
    setForm({
      id: s.id,
      title: s.title,
      municipioId: s.municipioId ?? '',
      municipioName: s.municipioName ?? '',
      schools: s.schools ?? [],
      date: s.date,
      startTime: s.startTime ?? '',
      cargaHoraria: s.cargaHoraria,
      modalidade: s.modalidade,
      formador: s.formador ?? '',
      temas: s.temas?.join(', ') ?? '',
      objetivos: s.objetivos ?? '',
      totalProfessores: s.totalProfessores,
    });
    setSaved(false);
    setShowModal(true);
  }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.title.trim()) { alert('Título é obrigatório.'); return; }
    if (!form.date) { alert('Data é obrigatória.'); return; }
    const munName = all.find(m => m.id === form.municipioId)?.name ?? '';
    const sessionData = {
      title: form.title,
      municipioId: form.municipioId,
      municipioName: munName,
      schools: form.schools,
      date: form.date,
      startTime: form.startTime,
      cargaHoraria: Number(form.cargaHoraria),
      modalidade: form.modalidade,
      formador: form.formador,
      temas: form.temas ? [form.temas] : [],
      objetivos: form.objetivos,
      totalProfessores: Number(form.totalProfessores),
    };
    const exists = sessions.find(s => s.id === (form as any).id);
    if (exists) {
      setSessions(prev => prev.map(s => s.id === (form as any).id ? { ...s, ...sessionData } : s));
    } else {
      setSessions(prev => [...prev, { ...sessionData, id: 'tr' + Date.now(), presentes: 0, presencaPct: 0 }]);
    }
    setSaved(true);
    setTimeout(closeModal, 1200);
  }

  function setField(key: string, value: string | number) {
    if (!form) return;
    setForm({ ...form, [key]: value } as typeof form);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Formação Docente</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registro e acompanhamento das formações realizadas</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <IconPlus size={15} /> Nova formação
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total formações"    value={sessions.length}        icon={<IconTraining size={18} />} color="blue" />
        <StatCard title="Carga horária"      value={`${totalCarga}h`}       icon={<IconTraining size={18} />} color="orange" />
        <StatCard title="% Presença média"   value={`${mediaPresenca}%`}    icon={<IconTraining size={18} />} color="green" />
        <StatCard title="Formadores ativos"  value={formadores}             icon={<IconTraining size={18} />} color="blue" />
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

      {tab === 'Formações' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Formações realizadas</h2>
            <span className="text-sm text-gray-400">{sessions.length} registros</span>
          </div>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <IconTraining size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Nenhuma formação registrada ainda</p>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">Registre as formações docentes para acompanhar a participação e carga horária.</p>
              <button onClick={openNew}
                className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
                <IconPlus size={15} /> Nova formação
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-medium">Título</th>
                    <th className="px-6 py-3 text-left font-medium">Município</th>
                    <th className="px-6 py-3 text-left font-medium">Data</th>
                    <th className="px-6 py-3 text-center font-medium">Carga</th>
                    <th className="px-6 py-3 text-center font-medium">Modalidade</th>
                    <th className="px-6 py-3 text-center font-medium">Presentes/Total</th>
                    <th className="px-6 py-3 text-center font-medium">%</th>
                    <th className="px-6 py-3 text-center font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sessions.map(s => {
                    const mb = modalBadge[s.modalidade];
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{s.title}</td>
                        <td className="px-6 py-4 text-gray-600">{s.municipioName || '—'}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(s.date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4 text-center text-gray-700">{s.cargaHoraria}h</td>
                        <td className="px-6 py-4 text-center"><Badge label={mb.label} variant={mb.variant} /></td>
                        <td className="px-6 py-4 text-center text-gray-700">{s.presentes}/{s.totalProfessores}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-semibold ${s.presencaPct >= 80 ? 'text-green-600' : s.presencaPct >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {s.presencaPct}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openEdit(s)} title="Editar" className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors"><IconEdit size={15} /></button>
                            <button onClick={() => openEdit(s)} title="Visualizar" className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors"><IconEye size={15} /></button>
                            <button
                              onClick={() => { if (confirm('Confirmar exclusão?')) setSessions(prev => prev.filter(x => x.id !== s.id)); }}
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
      )}

      {tab === 'Presenças' && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <IconTraining size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Controle de presenças</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">Selecione uma formação para registrar ou visualizar as presenças.</p>
        </div>
      )}

      {tab === 'Histórico' && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <IconTraining size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Histórico de formações</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">O histórico completo de formações será exibido aqui.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Nova Formação</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Título da formação" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Município</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.municipioId} onChange={e => setField('municipioId', e.target.value)}>
                  <option value="">Todos os municípios</option>
                  {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data *</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.date} onChange={e => setField('date', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Horário</label>
                <input type="time" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.startTime} onChange={e => setField('startTime', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Carga horária (h)</label>
                <input type="number" min={1} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.cargaHoraria} onChange={e => setField('cargaHoraria', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Modalidade</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.modalidade} onChange={e => setField('modalidade', e.target.value)}>
                  {MODALIDADES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Formador(a)</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.formador} onChange={e => setField('formador', e.target.value)} placeholder="Nome do formador" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Total de professores esperados</label>
                <input type="number" min={0} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.totalProfessores} onChange={e => setField('totalProfessores', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Temas abordados</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.temas} onChange={e => setField('temas', e.target.value)} placeholder="Ex: Metodologia ativa, Plano de Empreendimento..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Objetivos</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  value={form.objetivos} onChange={e => setField('objetivos', e.target.value)} placeholder="Objetivos da formação..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar formação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
