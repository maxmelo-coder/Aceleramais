'use client';
import React, { useState } from 'react';
import Badge from '@/components/Badge';
import { IconPlus, IconEvidence, IconSearch } from '@/components/Icons';
import { evidences } from '@/lib/mock-data';

const typeColors: Record<string, string> = {
  foto: 'bg-purple-50 text-purple-700',
  pdf: 'bg-red-50 text-red-700',
  link: 'bg-blue-50 text-blue-700',
  relato: 'bg-amber-50 text-amber-700',
  projeto: 'bg-green-50 text-green-700',
};

const typeIcons: Record<string, string> = {
  foto: '📷',
  pdf: '📄',
  link: '🔗',
  relato: '💬',
  projeto: '🚀',
};

export default function EvidenciasPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = evidences.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.competencia.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Evidências Pedagógicas</h1>
          <p className="text-sm text-gray-500">{evidences.length} evidências registradas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm"
        >
          <IconPlus size={16} />
          Nova evidência
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2E8C99]/20">
          <h3 className="font-semibold text-gray-900 mb-4">Registrar nova evidência</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Título</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]" placeholder="Ex.: Feira de Ideias — 6º A" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tipo</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
                <option>foto</option><option>pdf</option><option>link</option><option>relato</option><option>projeto</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Competência empreendedora</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]" placeholder="Ex.: Criatividade" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição</label>
              <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99] resize-none" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button className="px-4 py-2 text-sm bg-[#2E8C99] text-white rounded-lg hover:bg-[#226E79] font-medium">Salvar</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
        <IconSearch size={15} className="text-gray-400" />
        <input type="text" placeholder="Buscar evidência…" value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ev => (
          <div key={ev.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[ev.type]}`}>
                {typeIcons[ev.type]} {ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
              </span>
              <span className="text-xs text-gray-400">{ev.createdAt}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1.5">{ev.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{ev.description}</p>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
              <Badge label={ev.schoolName.replace('EMEF ', '')} variant="blue" />
              {ev.turmaName && <Badge label={ev.turmaName} variant="gray" />}
              <Badge label={ev.competencia} variant="orange" />
            </div>
            <p className="text-xs text-gray-400 mt-2">{ev.teacherName} · {ev.trimesterId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
