'use client';
import React, { useState } from 'react';
import { IconConfig, IconCheck } from '@/components/Icons';
import { projectConfig } from '@/lib/mock-data';

export default function ConfiguracoesGeraisPage() {
  const [saved, setSaved] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#F48B1B');
  const [secondaryColor, setSecondaryColor] = useState('#2E8C99');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Configurações Gerais</h1>
        <p className="text-sm text-gray-500">Identidade visual, dados institucionais e parâmetros da plataforma</p>
      </div>

      {/* Visual identity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Identidade Visual</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Logo da plataforma</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#2E8C99] transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#F48B1B] flex items-center justify-center text-white font-black text-xl mx-auto mb-2">E+</div>
              <p className="text-xs text-gray-400">Clique para fazer upload ou arraste aqui</p>
              <p className="text-[11px] text-gray-300 mt-1">PNG, SVG · Máx. 2MB</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Cor principal (laranja)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Cor secundária (azul)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional data */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Dados Institucionais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Nome da plataforma', value: 'Eleva+ Educação Empreendedora' },
            { label: 'Nome do projeto', value: projectConfig.projectName },
            { label: 'Empresa responsável', value: projectConfig.company },
            { label: 'Município/Rede', value: projectConfig.networkName },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
              <input type="text" defaultValue={f.value}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]" />
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation params */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Parâmetros de Avaliação</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Nota mínima para aprovação', value: '6.0' },
            { label: 'Escala de avaliação docente', value: '1 a 5' },
            { label: 'Trimestres ativos no ano', value: '4' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
              <input type="text" defaultValue={f.value}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]" />
            </div>
          ))}
        </div>
      </div>

      {/* Legal */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Termos e Privacidade</h3>
        <div className="space-y-3">
          {[
            { label: 'Termos de Uso', active: true },
            { label: 'Política de Privacidade (LGPD)', active: true },
            { label: 'Anonimização de dados em relatórios executivos', active: true },
            { label: 'Log de ações de usuários', active: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <p className="text-sm text-gray-700">{item.label}</p>
              <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors flex-shrink-0
                ${item.active ? 'bg-[#2E8C99]' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
                  ${item.active ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all
            ${saved ? 'bg-green-500 text-white' : 'bg-[#F48B1B] hover:bg-[#D4720E] text-white'}`}
        >
          {saved ? <><IconCheck size={16} /> Salvo!</> : 'Salvar configurações'}
        </button>
      </div>
    </div>
  );
}
