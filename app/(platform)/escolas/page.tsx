'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconSchool, IconPlus, IconEdit, IconEye, IconX, IconSave, IconUpload } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { School, SchoolStatus } from '@/lib/types';

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
  </svg>
);

type ZonaFilter = 'todos' | 'urbana' | 'rural';

const statusOpts: { value: SchoolStatus; label: string }[] = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'suspenso', label: 'Suspenso' },
];

function emptySchoolForm(municipioId: string) {
  return {
    id: '',
    name: '',
    code: '',
    municipioId,
    address: '',
    bairro: '',
    zona: 'urbana' as 'urbana' | 'rural',
    gestorName: '',
    email: '',
    phone: '',
    status: 'ativo' as SchoolStatus,
    observations: '',
  };
}

export default function EscolasPage() {
  const { selected, all } = useMunicipio();
  const [municipioFilter, setMunicipioFilter] = useState(selected.id);
  const [zonaFilter, setZonaFilter] = useState<ZonaFilter>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof emptySchoolForm> | null>(null);
  const defaultSchools = all.flatMap(m => m.schools.map(s => ({ ...s, municipioName: m.name })));
  const [localSchools, setLocalSchools] = useState<School[]>(() =>
    storageGet('acelera_escolas', defaultSchools)
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => { storageSet('acelera_escolas', localSchools); }, [localSchools]);

  const filteredSchools = useMemo(() => {
    return localSchools.filter(s => {
      if (municipioFilter !== 'todos' && s.municipioId !== municipioFilter) return false;
      if (zonaFilter !== 'todos' && s.zona !== zonaFilter) return false;
      if (statusFilter !== 'todos' && s.status !== statusFilter) return false;
      return true;
    });
  }, [localSchools, municipioFilter, zonaFilter, statusFilter]);

  const total = filteredSchools.length;
  const urbanas = filteredSchools.filter(s => s.zona === 'urbana').length;
  const rurais = filteredSchools.filter(s => s.zona === 'rural').length;
  const ativas = filteredSchools.filter(s => s.status === 'ativo').length;

  function openNew() {
    setForm(emptySchoolForm(municipioFilter !== 'todos' ? municipioFilter : selected.id));
    setSaved(false);
    setShowModal(true);
  }

  function openEdit(s: School) {
    setForm({
      id: s.id,
      name: s.name,
      code: s.code,
      municipioId: s.municipioId,
      address: s.address ?? '',
      bairro: s.bairro ?? '',
      zona: s.zona ?? 'urbana',
      gestorName: s.gestorName,
      email: s.email,
      phone: s.phone,
      status: s.status,
      observations: s.observations ?? '',
    });
    setSaved(false);
    setShowModal(true);
  }

  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.name.trim()) { alert('Nome é obrigatório.'); return; }
    if (!form.code.trim()) { alert('Código INEP é obrigatório.'); return; }
    const exists = localSchools.find(s => s.id === form.id);
    if (exists) {
      setLocalSchools(prev => prev.map(s => s.id === form.id
        ? { ...s, ...form, municipioName: all.find(m => m.id === form.municipioId)?.name }
        : s));
    } else {
      setLocalSchools(prev => [...prev, {
        ...form, id: 's' + Date.now(),
        municipioName: all.find(m => m.id === form.municipioId)?.name,
        classCount: 0, studentCount: 0, teacherCount: 0,
        participationRate: 0, avgScore: 0, elevaIndex: 0,
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
          <h1 className="text-2xl font-bold text-gray-900">Escolas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Cadastro e gestão das escolas participantes</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => alert('Importação via planilha em desenvolvimento.')}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <IconUpload size={15} />
            Importar planilha
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <IconPlus size={15} />
            Nova escola
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={municipioFilter} onChange={e => setMunicipioFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os municípios</option>
          {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={zonaFilter} onChange={e => setZonaFilter(e.target.value as ZonaFilter)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todas as zonas</option>
          <option value="urbana">Urbana</option>
          <option value="rural">Rural</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os status</option>
          {statusOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total" value={total}   icon={<IconSchool size={18} />} color="blue" />
        <StatCard title="Urbanas" value={urbanas} icon={<IconSchool size={18} />} color="orange" />
        <StatCard title="Rurais"  value={rurais}  icon={<IconSchool size={18} />} color="green" />
        <StatCard title="Ativas"  value={ativas}  icon={<IconSchool size={18} />} color="blue" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Escolas cadastradas</h2>
          <span className="text-sm text-gray-400">{filteredSchools.length} resultado{filteredSchools.length !== 1 ? 's' : ''}</span>
        </div>
        {filteredSchools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconSchool size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma escola encontrada</p>
            <p className="text-gray-400 text-sm mt-1">Ajuste os filtros ou cadastre uma nova escola</p>
            <button onClick={openNew}
              className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
              <IconPlus size={15} /> Nova escola
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-medium">Nome</th>
                  <th className="px-6 py-3 text-left font-medium">Código INEP</th>
                  <th className="px-6 py-3 text-left font-medium">Município</th>
                  <th className="px-6 py-3 text-left font-medium">Gestor(a)</th>
                  <th className="px-6 py-3 text-center font-medium">Turmas</th>
                  <th className="px-6 py-3 text-center font-medium">Estudantes</th>
                  <th className="px-6 py-3 text-center font-medium">Zona</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSchools.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px]">
                      <span className="truncate block">{s.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{s.code || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{(s as any).municipioName || all.find(m => m.id === s.municipioId)?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{s.gestorName || '—'}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{s.classCount}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{s.studentCount}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge label={s.zona === 'rural' ? 'Rural' : 'Urbana'} variant={s.zona === 'rural' ? 'green' : 'blue'} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        label={s.status === 'ativo' ? 'Ativo' : s.status === 'inativo' ? 'Inativo' : 'Suspenso'}
                        variant={s.status === 'ativo' ? 'green' : s.status === 'inativo' ? 'red' : 'yellow'}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(s)} title="Editar" className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors">
                          <IconEdit size={15} />
                        </button>
                        <button onClick={() => openEdit(s)} title="Visualizar" className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors">
                          <IconEye size={15} />
                        </button>
                        <button
                          onClick={() => { if (confirm('Confirmar exclusão?')) setLocalSchools(prev => prev.filter(x => x.id !== s.id)); }}
                          title="Excluir"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                          <TrashIcon />
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
              <h3 className="font-semibold text-gray-900 text-lg">{form.id ? 'Editar Escola' : 'Nova Escola'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome da escola *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Nome completo da escola" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Município *</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.municipioId} onChange={e => setField('municipioId', e.target.value)}>
                  {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Código INEP *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.code} onChange={e => setField('code', e.target.value)} placeholder="Ex: 27000001" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Endereço</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.address} onChange={e => setField('address', e.target.value)} placeholder="Rua, número" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Bairro / Localidade</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.bairro} onChange={e => setField('bairro', e.target.value)} placeholder="Bairro ou localidade" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Zona</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.zona} onChange={e => setField('zona', e.target.value)}>
                  <option value="urbana">Urbana</option>
                  <option value="rural">Rural</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Gestor(a)</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.gestorName} onChange={e => setField('gestorName', e.target.value)} placeholder="Nome do gestor" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.email} onChange={e => setField('email', e.target.value)} placeholder="escola@edu.gov.br" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Telefone</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="(82) 99999-9999" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.status} onChange={e => setField('status', e.target.value)}>
                  {statusOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  rows={3} value={form.observations} onChange={e => setField('observations', e.target.value)}
                  placeholder="Observações adicionais..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar escola'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
