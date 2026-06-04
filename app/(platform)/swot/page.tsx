'use client';
import React, { useState } from 'react';
import { IconPlus, IconEdit } from '@/components/Icons';
import { swotAnalyses } from '@/lib/mock-data';
import type { SwotItem } from '@/lib/types';

const categories = [
  { key: 'forca' as const, label: 'Forças', icon: '💪', bg: 'bg-green-50', border: 'border-green-200', head: 'bg-green-500', text: 'text-green-800', badge: 'bg-green-100 text-green-700' },
  { key: 'fraqueza' as const, label: 'Fraquezas', icon: '⚠️', bg: 'bg-amber-50', border: 'border-amber-200', head: 'bg-amber-500', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-700' },
  { key: 'oportunidade' as const, label: 'Oportunidades', icon: '🚀', bg: 'bg-[#EBF6F7]', border: 'border-[#2E8C99]/30', head: 'bg-[#2E8C99]', text: 'text-[#226E79]', badge: 'bg-[#2E8C99]/10 text-[#226E79]' },
  { key: 'ameaca' as const, label: 'Ameaças', icon: '🛡️', bg: 'bg-red-50', border: 'border-red-200', head: 'bg-red-500', text: 'text-red-800', badge: 'bg-red-100 text-red-700' },
];

export default function SWOTPage() {
  const [selected, setSelected] = useState(swotAnalyses[0]);

  const getItems = (cat: SwotItem['category']) =>
    selected?.items.filter(i => i.category === cat) ?? [];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Análise SWOT</h1>
          <p className="text-sm text-gray-500">Forças, Fraquezas, Oportunidades e Ameaças do projeto</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
          <IconPlus size={16} />
          Nova análise
        </button>
      </div>

      {selected && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Análise geral da rede — {selected.trimesterName}</p>
              <p className="text-xs text-gray-400">Última atualização: {selected.updatedAt}</p>
            </div>
            <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
              <IconEdit size={14} />
              Editar análise
            </button>
          </div>

          {/* SWOT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map(cat => {
              const items = getItems(cat.key);
              return (
                <div key={cat.key} className={`${cat.bg} ${cat.border} border rounded-2xl overflow-hidden`}>
                  <div className={`${cat.head} px-5 py-3 flex items-center gap-2`}>
                    <span className="text-lg">{cat.icon}</span>
                    <h3 className="font-bold text-white">{cat.label}</h3>
                    <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">{items.length}</span>
                  </div>
                  <div className="p-4 space-y-2.5">
                    {items.map(item => (
                      <div key={item.id} className={`flex items-start gap-2.5 text-sm ${cat.text}`}>
                        <span className="mt-0.5 text-base leading-none flex-shrink-0">•</span>
                        <p className="leading-relaxed">{item.text}</p>
                        {item.auto && (
                          <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full ${cat.badge} font-medium`}>auto</span>
                        )}
                      </div>
                    ))}
                    <button className={`flex items-center gap-1.5 text-xs ${cat.text} opacity-60 hover:opacity-100 transition-opacity mt-1`}>
                      <IconPlus size={12} />
                      Adicionar item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary insight */}
          <div className="bg-[#060606] rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3">Síntese estratégica</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              O projeto apresenta bases sólidas de execução com alto engajamento discente e suporte institucional firme da Secretaria. Os principais desafios concentram-se na participação de escolas periféricas e na infraestrutura tecnológica. A Feira Municipal de Empreendedorismo representa uma oportunidade estratégica para consolidar os resultados do 3º trimestre e ampliar o impacto junto à comunidade.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
