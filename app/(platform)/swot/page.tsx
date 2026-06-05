'use client';
import React, { useState, useEffect } from 'react';
import { IconSWOT, IconPlus, IconX, IconSave, IconDownload } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { SwotItem, SwotCategory, SwotOrigin } from '@/lib/types';

const QUADRANTES: { key: SwotCategory; label: string; color: string; bg: string; border: string }[] = [
  { key: 'forca',        label: 'Forças',       color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  { key: 'fraqueza',     label: 'Fraquezas',    color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' },
  { key: 'oportunidade', label: 'Oportunidades', color: 'text-blue-700', bg: 'bg-blue-50',   border: 'border-blue-200' },
  { key: 'ameaca',       label: 'Ameaças',      color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
];

const ORIGENS: { value: SwotOrigin; label: string }[] = [
  { value: 'avaliacao', label: 'Avaliação' },
  { value: 'formacao',  label: 'Formação'  },
  { value: 'feedback',  label: 'Feedback'  },
  { value: 'manual',    label: 'Manual'    },
];

function emptyItemForm(cat: SwotCategory) {
  return { texto: '', categoria: cat, origem: 'manual' as SwotOrigin };
}

export default function SwotPage() {
  const { selected, all } = useMunicipio();
  const [filterMunicipio, setFilterMunicipio] = useState(selected.id);
  const [filterEscola, setFilterEscola] = useState('todas');
  const [filterTrimestre, setFilterTrimestre] = useState('2');
  const [items, setItems] = useState<SwotItem[]>(() => storageGet('acelera_swot', []));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { storageSet('acelera_swot', items); }, [items]);
  const [form, setForm] = useState<ReturnType<typeof emptyItemForm> | null>(null);
  const [saved, setSaved] = useState(false);

  const mun = all.find(m => m.id === filterMunicipio);
  const schools = mun?.schools ?? [];

  function openAdd(cat: SwotCategory) {
    setForm(emptyItemForm(cat));
    setSaved(false);
    setShowModal(true);
  }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.texto.trim()) { alert('Texto é obrigatório.'); return; }
    setItems(prev => [...prev, { id: 'sw' + Date.now(), category: form.categoria, text: form.texto, origem: form.origem }]);
    setSaved(true);
    setTimeout(closeModal, 1200);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análise SWOT</h1>
          <p className="text-sm text-gray-500 mt-0.5">Forças, fraquezas, oportunidades e ameaças por município</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Geração automática de SWOT em desenvolvimento.')}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <IconSWOT size={15} /> Gerar SWOT automática
          </button>
          <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <IconDownload size={15} /> Exportar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterMunicipio} onChange={e => setFilterMunicipio(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterEscola} onChange={e => setFilterEscola(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todas">Todas as escolas</option>
          {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterTrimestre} onChange={e => setFilterTrimestre(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          {['1', '2', '3', '4'].map(t => <option key={t} value={t}>{t}º Trimestre</option>)}
        </select>
      </div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUADRANTES.map(q => {
          const qItems = items.filter(i => i.category === q.key);
          return (
            <div key={q.key} className={`rounded-2xl border ${q.border} p-5 space-y-3`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-bold text-base ${q.color}`}>{q.label}</h3>
                <button
                  onClick={() => openAdd(q.key)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ${q.bg} ${q.color} hover:opacity-80 transition-opacity`}>
                  <IconPlus size={12} /> Adicionar
                </button>
              </div>
              {qItems.length === 0 ? (
                <div className={`rounded-xl ${q.bg} p-4 text-center`}>
                  <p className={`text-xs ${q.color} opacity-60`}>Nenhum item ainda. Clique em "Adicionar" para inserir.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {qItems.map(item => (
                    <div key={item.id} className={`rounded-xl ${q.bg} px-3 py-2.5 flex items-start justify-between gap-2`}>
                      <p className={`text-sm ${q.color} flex-1`}>{item.text}</p>
                      <button
                        onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                        className={`${q.color} opacity-40 hover:opacity-80 transition-opacity flex-shrink-0 mt-0.5`}>
                        <IconX size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">
                Adicionar item — {QUADRANTES.find(q => q.key === form.categoria)?.label}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Texto *</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })}
                  placeholder="Descreva o item SWOT..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Origem</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.origem} onChange={e => setForm({ ...form, origem: e.target.value as SwotOrigin })}>
                  {ORIGENS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Adicionado!' : 'Adicionar item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
