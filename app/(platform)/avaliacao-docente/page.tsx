'use client';
import React, { useState } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconTeacher, IconPlus, IconEye, IconEdit, IconX, IconSave } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import type { TeacherEvaluationForm } from '@/lib/types';

const tabLabels = ['Formulários', 'Respostas', 'Análise'] as const;
type Tab = typeof tabLabels[number];

function emptyForm() {
  return {
    id: '',
    title: '',
    municipioId: '',
    municipioName: '',
    trimestre: '2º Trimestre',
    totalProfessores: 0,
    status: 'aberto' as 'aberto' | 'encerrado',
  };
}

export default function AvaliacaoDocentePage() {
  const { selected, all } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Formulários');
  const [forms, setForms] = useState<TeacherEvaluationForm[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);

  const totalRespondentes = forms.reduce((a, f) => a + f.respondentes, 0);
  const mediaParticipacao = forms.length > 0
    ? Math.round(forms.reduce((a, f) => a + f.participacaoPct, 0) / forms.length)
    : 0;

  function openNew() { setForm(emptyForm()); setSaved(false); setShowModal(true); }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.title.trim()) { alert('Título é obrigatório.'); return; }
    const munName = all.find(m => m.id === form.municipioId)?.name ?? selected.name;
    const exists = forms.find(f => f.id === form.id);
    if (exists) {
      setForms(prev => prev.map(f => f.id === form.id ? { ...f, ...form, municipioName: munName } : f));
    } else {
      setForms(prev => [...prev, {
        ...form, id: 'af' + Date.now(),
        municipioName: munName,
        respondentes: 0,
        participacaoPct: 0,
        mediasMaterial: 0,
        mediasFormacao: 0,
        mediasEngajamento: 0,
        createdAt: new Date().toISOString(),
      }]);
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
          <h1 className="text-2xl font-bold text-gray-900">Avaliação Docente</h1>
          <p className="text-sm text-gray-500 mt-0.5">Formulários de avaliação aplicados aos professores</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <IconPlus size={15} /> Novo formulário
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

      {tab === 'Formulários' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Formulários"     value={forms.length}      icon={<IconTeacher size={18} />} color="blue" />
            <StatCard title="Respondentes"    value={totalRespondentes} icon={<IconTeacher size={18} />} color="orange" />
            <StatCard title="% Participação"  value={`${mediaParticipacao}%`} icon={<IconTeacher size={18} />} color="green" />
            <StatCard title="Abertos"         value={forms.filter(f => f.status === 'aberto').length} icon={<IconTeacher size={18} />} color="blue" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Formulários de Avaliação Docente</h2>
            </div>
            {forms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <IconTeacher size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhum formulário criado ainda</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">Crie um formulário para coletar avaliações dos professores parceiros.</p>
                <button onClick={openNew}
                  className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
                  <IconPlus size={15} /> Novo formulário
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left font-medium">Título</th>
                      <th className="px-6 py-3 text-left font-medium">Município</th>
                      <th className="px-6 py-3 text-center font-medium">Respostas</th>
                      <th className="px-6 py-3 text-center font-medium">% Participação</th>
                      <th className="px-6 py-3 text-center font-medium">Status</th>
                      <th className="px-6 py-3 text-center font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {forms.map(f => (
                      <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{f.title}</td>
                        <td className="px-6 py-4 text-gray-600">{f.municipioName || '—'}</td>
                        <td className="px-6 py-4 text-center text-gray-700">{f.respondentes}/{f.totalProfessores}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-semibold ${f.participacaoPct >= 80 ? 'text-green-600' : f.participacaoPct >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {f.participacaoPct}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge label={f.status === 'aberto' ? 'Aberto' : 'Encerrado'} variant={f.status === 'aberto' ? 'green' : 'gray'} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors"><IconEdit size={15} /></button>
                            <button className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors"><IconEye size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'Respostas' && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
          <IconTeacher size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma resposta registrada</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">As respostas dos professores aparecerão aqui após os formulários serem preenchidos.</p>
        </div>
      )}

      {tab === 'Análise' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Taxa de Participação" value="—" subtitle="aguardando dados" icon={<IconTeacher size={18} />} color="blue" />
            <StatCard title="Média Material"      value="—" subtitle="aguardando dados" icon={<IconTeacher size={18} />} color="orange" />
            <StatCard title="Média Formação"       value="—" subtitle="aguardando dados" icon={<IconTeacher size={18} />} color="green" />
            <StatCard title="Média Engajamento"    value="—" subtitle="aguardando dados" icon={<IconTeacher size={18} />} color="blue" />
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm">Os gráficos de análise serão exibidos quando houver dados suficientes.</p>
          </div>
        </div>
      )}

      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Novo Formulário de Avaliação</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Ex: Avaliação Docente 2º Trimestre 2025" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Município</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.municipioId} onChange={e => setField('municipioId', e.target.value)}>
                  <option value="">Todos os municípios</option>
                  {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Trimestre</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.trimestre} onChange={e => setField('trimestre', e.target.value)}>
                    {['1º Trimestre', '2º Trimestre', '3º Trimestre', '4º Trimestre'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total de professores</label>
                  <input type="number" min={0}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.totalProfessores} onChange={e => setField('totalProfessores', parseInt(e.target.value) || 0)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.status} onChange={e => setField('status', e.target.value)}>
                  <option value="aberto">Aberto</option>
                  <option value="encerrado">Encerrado</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar formulário'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
