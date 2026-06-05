'use client';
import React, { useState } from 'react';
import { IconConfig, IconSave, IconUpload, IconGlobe } from '@/components/Icons';

const tabLabels = ['Plataforma', 'Avaliações', 'Relatórios', 'Segurança', 'Sobre'] as const;
type Tab = typeof tabLabels[number];

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<Tab>('Plataforma');
  const [saved, setSaved] = useState(false);
  const [lgpd, setLgpd] = useState(true);
  const [logAcoes, setLogAcoes] = useState(true);
  const [anonimizacao, setAnonimizacao] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-[#2E8C99]' : 'bg-gray-300'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações Gerais</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configurações da plataforma Acelera+</p>
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

      {tab === 'Plataforma' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="font-semibold text-gray-900">Identidade da Plataforma</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nome da plataforma</label>
              <input defaultValue="Acelera+ Escola de Empreendedorismo"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Ano letivo</label>
              <input defaultValue="2025"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cor primária</label>
              <div className="flex items-center gap-2">
                <input type="color" defaultValue="#F48B1B" className="h-9 w-16 rounded border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500">#F48B1B</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cor secundária</label>
              <div className="flex items-center gap-2">
                <input type="color" defaultValue="#2E8C99" className="h-9 w-16 rounded border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500">#2E8C99</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Logo da plataforma</label>
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="Logo atual" className="h-12 w-auto object-contain border border-gray-200 rounded-lg p-2 bg-white" />
                <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  <IconUpload size={14} /> Fazer upload
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
              <IconSave size={14} /> {saved ? 'Salvo!' : 'Salvar configurações'}
            </button>
          </div>
        </div>
      )}

      {tab === 'Avaliações' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="font-semibold text-gray-900">Configurações de Avaliações</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nota mínima de aprovação</label>
              <input type="number" defaultValue={6} min={0} max={10} step={0.1}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Escala de avaliação docente</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30">
                <option>1 a 5</option>
                <option>1 a 10</option>
                <option>0% a 100%</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Trimestres ativos em 2025</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {[1, 2, 3, 4].map(t => (
                  <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked={t <= 2} className="rounded border-gray-300 text-[#2E8C99]" />
                    {t}º Trim.
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
              <IconSave size={14} /> {saved ? 'Salvo!' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {tab === 'Relatórios' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="font-semibold text-gray-900">Configurações de Relatórios</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Template padrão</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30">
                <option>Padrão Acelera+</option>
                <option>Simples</option>
                <option>Detalhado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rodapé dos relatórios</label>
              <input defaultValue="Acelera+ Escola de Empreendedorismo · 2025"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Campos obrigatórios nos relatórios</label>
              <div className="space-y-2">
                {['Município', 'Escola', 'Trimestre', 'Responsável técnico', 'Data de geração'].map(f => (
                  <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#2E8C99]" />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
              <IconSave size={14} /> {saved ? 'Salvo!' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {tab === 'Segurança' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="font-semibold text-gray-900">Privacidade e Segurança (LGPD)</h2>
          <div className="space-y-1">
            <Toggle value={lgpd} onChange={setLgpd} label="Conformidade LGPD habilitada" />
            <Toggle value={logAcoes} onChange={setLogAcoes} label="Log de ações dos usuários" />
            <Toggle value={anonimizacao} onChange={setAnonimizacao} label="Anonimização automática de dados sensíveis" />
          </div>
          <div>
            <p className="text-xs text-gray-500">
              A plataforma segue as diretrizes da Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).
              Os dados pessoais dos estudantes são tratados exclusivamente para fins pedagógicos.
            </p>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
              <IconSave size={14} /> {saved ? 'Salvo!' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {tab === 'Sobre' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Sobre a Plataforma</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Versão</p>
                <p className="text-gray-900 font-semibold mt-0.5">2.0.0</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Responsável Técnico</p>
                <p className="text-gray-900 mt-0.5">Equipe Acelera+ Tecnologia</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Contato</p>
                <p className="text-gray-900 mt-0.5">tecnologia@acelera.com.br</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Stack Tecnológico</p>
                <p className="text-gray-900 mt-0.5">Next.js 16 · React 19 · TypeScript · Tailwind CSS v4</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Última atualização</p>
                <p className="text-gray-900 mt-0.5">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              © 2025 Acelera+ Escola de Empreendedorismo. Todos os direitos reservados.
              Desenvolvido para apoiar municípios parceiros na gestão do projeto de empreendedorismo escolar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
