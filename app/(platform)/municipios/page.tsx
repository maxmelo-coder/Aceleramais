'use client';
import React, { useState } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconMapPin, IconPlus, IconEdit, IconEye, IconX, IconSave, IconBuilding } from '@/components/Icons';
import { municipiosData } from '@/lib/mock-data';
import type { MunicipioData, MunicipioStatus } from '@/lib/types';

const statusConfig: Record<MunicipioStatus, { label: string; variant: 'green' | 'yellow' | 'blue' | 'gray' }> = {
  ativo:      { label: 'Ativo',      variant: 'green'  },
  pausado:    { label: 'Pausado',    variant: 'yellow' },
  concluido:  { label: 'Concluído',  variant: 'blue'   },
  em_analise: { label: 'Em análise', variant: 'gray'   },
};

const emptyForm = (): Omit<MunicipioData, 'schools'> => ({
  id: '',
  name: '',
  state: 'Alagoas',
  uf: 'AL',
  codigoIBGE: '',
  secretaria: '',
  secretario: '',
  email: '',
  telefone: '',
  dataInicio: '',
  status: 'ativo',
  observacoes: '',
});

export default function MunicipiosPage() {
  const [municipios, setMunicipios] = useState<MunicipioData[]>(municipiosData);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<(Omit<MunicipioData, 'schools'>) | null>(null);
  const [saved, setSaved] = useState(false);

  const totalEscolas = municipios.reduce((acc, m) => acc + m.schools.length, 0);
  const ativos = municipios.filter(m => m.status === 'ativo').length;

  function openNew() {
    setEditing(emptyForm());
    setShowModal(true);
  }

  function openEdit(m: MunicipioData) {
    const { schools: _, ...rest } = m;
    setEditing({ ...rest });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setSaved(false);
  }

  function handleSave() {
    if (!editing) return;
    if (!editing.name.trim()) return alert('Nome é obrigatório.');
    const exists = municipios.find(m => m.id === editing.id);
    if (exists) {
      setMunicipios(prev => prev.map(m => m.id === editing.id ? { ...m, ...editing } : m));
    } else {
      const newId = 'm' + Date.now();
      setMunicipios(prev => [...prev, { ...editing, id: newId, schools: [] }]);
    }
    setSaved(true);
    setTimeout(closeModal, 1200);
  }

  function handleField<K extends keyof typeof editing>(key: K, value: string) {
    if (!editing) return;
    setEditing({ ...editing, [key]: value } as typeof editing);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Municípios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestão dos municípios parceiros do projeto</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <IconPlus size={16} />
          Novo município
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total cadastrados"
          value={municipios.length}
          icon={<IconMapPin size={18} />}
          color="blue"
        />
        <StatCard
          title="Ativos"
          value={ativos}
          icon={<IconMapPin size={18} />}
          color="green"
        />
        <StatCard
          title="Total de escolas"
          value={totalEscolas}
          icon={<IconBuilding size={18} />}
          color="orange"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Lista de Municípios</h2>
        </div>
        {municipios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconMapPin size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Nenhum município cadastrado</p>
            <p className="text-gray-400 text-sm mt-1">Clique em "Novo município" para começar</p>
            <button
              onClick={openNew}
              className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors"
            >
              <IconPlus size={15} /> Novo município
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-medium">Nome</th>
                  <th className="px-6 py-3 text-left font-medium">Estado</th>
                  <th className="px-6 py-3 text-left font-medium">Secretário(a)</th>
                  <th className="px-6 py-3 text-center font-medium">Escolas</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {municipios.map(m => {
                  const sc = statusConfig[m.status] ?? statusConfig.ativo;
                  return (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                      <td className="px-6 py-4 text-gray-600">{m.state} ({m.uf})</td>
                      <td className="px-6 py-4 text-gray-600">{m.secretario || '—'}</td>
                      <td className="px-6 py-4 text-center text-gray-700 font-semibold">{m.schools.length}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge label={sc.label} variant={sc.variant} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(m)}
                            title="Editar"
                            className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors"
                          >
                            <IconEdit size={15} />
                          </button>
                          <button
                            title="Visualizar"
                            className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors"
                          >
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

      {/* Modal */}
      {showModal && editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">
                {editing.id ? 'Editar Município' : 'Novo Município'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
                <IconX size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome do município *</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.name}
                  onChange={e => handleField('name', e.target.value)}
                  placeholder="Ex: Limoeiro de Anadia"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.state}
                  onChange={e => handleField('state', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Código IBGE</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.codigoIBGE ?? ''}
                  onChange={e => handleField('codigoIBGE', e.target.value)}
                  placeholder="Ex: 2704005"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Secretaria</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.secretaria ?? ''}
                  onChange={e => handleField('secretaria', e.target.value)}
                  placeholder="Nome da secretaria"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Secretário(a)</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.secretario}
                  onChange={e => handleField('secretario', e.target.value)}
                  placeholder="Nome do secretário"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.email ?? ''}
                  onChange={e => handleField('email', e.target.value)}
                  placeholder="secretaria@municipio.gov.br"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.telefone ?? ''}
                  onChange={e => handleField('telefone', e.target.value)}
                  placeholder="(82) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data de início</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.dataInicio ?? ''}
                  onChange={e => handleField('dataInicio', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={editing.status}
                  onChange={e => handleField('status', e.target.value)}
                >
                  <option value="ativo">Ativo</option>
                  <option value="pausado">Pausado</option>
                  <option value="concluido">Concluído</option>
                  <option value="em_analise">Em análise</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  rows={3}
                  value={editing.observacoes ?? ''}
                  onChange={e => handleField('observacoes', e.target.value)}
                  placeholder="Observações adicionais..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}
              >
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar município'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
