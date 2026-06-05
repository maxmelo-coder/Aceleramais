'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconMaterials, IconPlus, IconX, IconSave, IconUpload, IconLink, IconBook, IconDownload } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { TrainingMaterial, MaterialType } from '@/lib/types';

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
  </svg>
);

const tabLabels = ['Todos', 'PPT', 'PDF', 'Vídeos', 'Links'] as const;
type Tab = typeof tabLabels[number];

const TIPOS: { value: MaterialType; label: string }[] = [
  { value: 'ppt',   label: 'Apresentação (PPT)' },
  { value: 'pdf',   label: 'PDF' },
  { value: 'video', label: 'Vídeo' },
  { value: 'link',  label: 'Link externo' },
  { value: 'outro', label: 'Outro' },
];

const tipoIcon: Record<MaterialType, string> = {
  ppt:   '📊',
  pdf:   '📄',
  video: '🎥',
  link:  '🔗',
  outro: '📁',
};

const tipoBadge: Record<MaterialType, 'orange' | 'red' | 'purple' | 'blue' | 'gray'> = {
  ppt:   'orange',
  pdf:   'red',
  video: 'purple',
  link:  'blue',
  outro: 'gray',
};

const tabFilter: Record<Tab, MaterialType | null> = {
  Todos:   null,
  PPT:     'ppt',
  PDF:     'pdf',
  Vídeos:  'video',
  Links:   'link',
};

function emptyForm() {
  return {
    id: '',
    title: '',
    description: '',
    tipo: 'pdf' as MaterialType,
    tema: '',
    municipioId: '',
    trainingId: '',
    trainingTitle: '',
    responsavel: '',
    tags: '',
    url: '',
  };
}

export default function MateriaisPage() {
  const { all } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Todos');
  const [materials, setMaterials] = useState<TrainingMaterial[]>(() => storageGet('acelera_materiais', []));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { storageSet('acelera_materiais', materials); }, [materials]);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);

  const filtered = materials.filter(m => {
    const f = tabFilter[tab];
    return f === null || m.tipo === f;
  });

  function openNew() { setForm(emptyForm()); setSaved(false); setShowModal(true); }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.title.trim()) { alert('Título é obrigatório.'); return; }
    const munName = all.find(m => m.id === form.municipioId)?.name ?? '';
    setMaterials(prev => [...prev, {
      id: 'mat' + Date.now(),
      title: form.title,
      description: form.description,
      tipo: form.tipo,
      tema: form.tema,
      municipioId: form.municipioId,
      municipioName: munName,
      trainingId: form.trainingId || undefined,
      trainingTitle: form.trainingTitle || undefined,
      responsavel: form.responsavel,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      url: form.url || undefined,
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
          <h1 className="text-2xl font-bold text-gray-900">Materiais para Formações</h1>
          <p className="text-sm text-gray-500 mt-0.5">Repositório de materiais utilizados nas formações docentes</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <IconUpload size={15} /> Upload de material
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total" value={materials.length} icon={<IconMaterials size={18} />} color="blue" />
        <StatCard title="PPT"   value={materials.filter(m => m.tipo === 'ppt').length}   icon={<IconMaterials size={18} />} color="orange" />
        <StatCard title="PDF"   value={materials.filter(m => m.tipo === 'pdf').length}   icon={<IconMaterials size={18} />} color="red" />
        <StatCard title="Links" value={materials.filter(m => m.tipo === 'link').length}  icon={<IconLink size={18} />} color="blue" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto">
        {tabLabels.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <IconMaterials size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum material cadastrado</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">
            {tab === 'Todos'
              ? 'Faça o upload do primeiro material para que ele apareça aqui.'
              : `Nenhum material do tipo "${tab}" cadastrado ainda.`}
          </p>
          <button onClick={openNew}
            className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
            <IconUpload size={15} /> Upload de material
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{tipoIcon[m.tipo]}</span>
                <Badge label={TIPOS.find(t => t.value === m.tipo)?.label ?? m.tipo} variant={tipoBadge[m.tipo]} size="sm" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm line-clamp-2">{m.title}</p>
                {m.tema && <p className="text-xs text-gray-500 mt-1">{m.tema}</p>}
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                {m.trainingTitle && <p>Formação: {m.trainingTitle}</p>}
                {m.responsavel && <p>Responsável: {m.responsavel}</p>}
                <p>{new Date(m.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
              {m.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {m.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{tag}</span>
                  ))}
                </div>
              )}
              {m.url && (
                <a href={m.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#2E8C99] hover:text-[#226E79] transition-colors">
                  <IconLink size={12} /> Acessar material
                </a>
              )}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => { if (confirm('Confirmar exclusão?')) setMaterials(prev => prev.filter(x => x.id !== m.id)); }}
                  title="Excluir"
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Upload de Material</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Título do material" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Breve descrição..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.tipo} onChange={e => setField('tipo', e.target.value)}>
                    {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tema</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.tema} onChange={e => setField('tema', e.target.value)} placeholder="Ex: Empreendedorismo" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Município</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.municipioId} onChange={e => setField('municipioId', e.target.value)}>
                    <option value="">Todos</option>
                    {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Responsável</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                    value={form.responsavel} onChange={e => setField('responsavel', e.target.value)} placeholder="Nome do responsável" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">URL / Link</label>
                <input type="url" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.url} onChange={e => setField('url', e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.tags} onChange={e => setField('tags', e.target.value)} placeholder="Ex: empreendedorismo, inovação, metodologia" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar material'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
