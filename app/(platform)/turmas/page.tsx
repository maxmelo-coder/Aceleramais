'use client';
import React, { useState, useMemo } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconClasses, IconPlus, IconEdit, IconEye, IconX, IconSave, IconStudents } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import type { Turma, EtapaEnsino } from '@/lib/types';

const ETAPAS: EtapaEnsino[] = ['EF Anos Iniciais', 'EF Anos Finais', 'EJA'];
const SERIES = ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano', 'EJA'];
const TURNOS = ['manhã', 'tarde', 'noite', 'integral'] as const;

function emptyTurmaForm(municipioId: string) {
  return {
    id: '',
    name: '',
    schoolId: '',
    schoolName: '',
    municipioId,
    etapa: 'EF Anos Iniciais' as EtapaEnsino,
    serie: '1º ano',
    turno: 'manhã' as typeof TURNOS[number],
    teacherName: '',
    studentCount: 0,
    participationRate: 0,
    status: 'ativo' as 'ativo' | 'inativo',
    observations: '',
  };
}

export default function TurmasPage() {
  const { selected, all } = useMunicipio();
  const [municipioFilter, setMunicipioFilter] = useState(selected.id);
  const [etapaFilter, setEtapaFilter] = useState('todas');
  const [turnoFilter, setTurnoFilter] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof emptyTurmaForm> | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [saved, setSaved] = useState(false);

  const allSchools = useMemo(() => all.flatMap(m => m.schools.map(s => ({ ...s, municipioId: m.id, municipioName: m.name }))), [all]);
  const filteredSchools = useMemo(() => {
    if (municipioFilter === 'todos') return allSchools;
    return allSchools.filter(s => s.municipioId === municipioFilter);
  }, [allSchools, municipioFilter]);

  const filteredTurmas = useMemo(() => {
    return turmas.filter(t => {
      if (municipioFilter !== 'todos' && t.municipioId !== municipioFilter) return false;
      if (etapaFilter !== 'todas' && t.etapa !== etapaFilter) return false;
      if (turnoFilter !== 'todos' && t.turno !== turnoFilter) return false;
      return true;
    });
  }, [turmas, municipioFilter, etapaFilter, turnoFilter]);

  function openNew() {
    setForm(emptyTurmaForm(municipioFilter !== 'todos' ? municipioFilter : selected.id));
    setSaved(false);
    setShowModal(true);
  }

  function openEdit(t: Turma) {
    setForm({
      id: t.id, name: t.name, schoolId: t.schoolId, schoolName: t.schoolName,
      municipioId: t.municipioId ?? selected.id,
      etapa: t.etapa, serie: t.serie, turno: t.turno,
      teacherName: t.teacherName, studentCount: t.studentCount,
      participationRate: t.participationRate, status: t.status,
      observations: t.observations ?? '',
    });
    setSaved(false);
    setShowModal(true);
  }

  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.name.trim()) { alert('Nome da turma é obrigatório.'); return; }
    if (!form.schoolId) { alert('Escola é obrigatória.'); return; }
    const school = allSchools.find(s => s.id === form.schoolId);
    const exists = turmas.find(t => t.id === form.id);
    if (exists) {
      setTurmas(prev => prev.map(t => t.id === form.id ? { ...t, ...form, schoolName: school?.name ?? form.schoolName } : t));
    } else {
      setTurmas(prev => [...prev, { ...form, id: 't' + Date.now(), schoolName: school?.name ?? '' }]);
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
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestão de turmas e estudantes participantes</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <IconPlus size={15} /> Nova turma
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={municipioFilter} onChange={e => setMunicipioFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os municípios</option>
          {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={etapaFilter} onChange={e => setEtapaFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todas">Todas as etapas</option>
          {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <select value={turnoFilter} onChange={e => setTurnoFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os turnos</option>
          {TURNOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total de turmas" value={filteredTurmas.length} icon={<IconClasses size={18} />} color="blue" />
        <StatCard title="Estudantes" value={filteredTurmas.reduce((a, t) => a + t.studentCount, 0)} icon={<IconStudents size={18} />} color="orange" />
        <StatCard title="EF Anos Iniciais" value={filteredTurmas.filter(t => t.etapa === 'EF Anos Iniciais').length} icon={<IconClasses size={18} />} color="green" />
        <StatCard title="EF Anos Finais + EJA" value={filteredTurmas.filter(t => t.etapa !== 'EF Anos Iniciais').length} icon={<IconClasses size={18} />} color="blue" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Turmas cadastradas</h2>
          <span className="text-sm text-gray-400">{filteredTurmas.length} resultado{filteredTurmas.length !== 1 ? 's' : ''}</span>
        </div>
        {filteredTurmas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconClasses size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma turma cadastrada ainda</p>
            <p className="text-gray-400 text-sm mt-1">Clique em "Nova turma" para começar</p>
            <button onClick={openNew}
              className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
              <IconPlus size={15} /> Nova turma
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-medium">Nome da turma</th>
                  <th className="px-6 py-3 text-left font-medium">Escola</th>
                  <th className="px-6 py-3 text-left font-medium">Série</th>
                  <th className="px-6 py-3 text-left font-medium">Turno</th>
                  <th className="px-6 py-3 text-left font-medium">Professor</th>
                  <th className="px-6 py-3 text-center font-medium">Estudantes</th>
                  <th className="px-6 py-3 text-center font-medium">% Participação</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTurmas.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-[160px]"><span className="truncate block">{t.schoolName}</span></td>
                    <td className="px-6 py-4 text-gray-600">{t.serie}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{t.turno}</td>
                    <td className="px-6 py-4 text-gray-600">{t.teacherName || '—'}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{t.studentCount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${t.participationRate >= 80 ? 'text-green-600' : t.participationRate >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {t.participationRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge label={t.status === 'ativo' ? 'Ativo' : 'Inativo'} variant={t.status === 'ativo' ? 'green' : 'red'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(t)} title="Editar" className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors">
                          <IconEdit size={15} />
                        </button>
                        <button title="Ver estudantes" className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors">
                          <IconEye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">{form.id ? 'Editar Turma' : 'Nova Turma'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome da turma *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Ex: 5A Manhã" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Escola *</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.schoolId} onChange={e => setField('schoolId', e.target.value)}>
                  <option value="">Selecione uma escola</option>
                  {filteredSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Turno</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.turno} onChange={e => setField('turno', e.target.value)}>
                  {TURNOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Professor de Empreendedorismo</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.teacherName} onChange={e => setField('teacherName', e.target.value)} placeholder="Nome do professor" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quantidade de estudantes</label>
                <input type="number" min={0} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.studentCount} onChange={e => setField('studentCount', parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.status} onChange={e => setField('status', e.target.value)}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  rows={3} value={form.observations} onChange={e => setField('observations', e.target.value)} placeholder="Observações adicionais..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar turma'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
