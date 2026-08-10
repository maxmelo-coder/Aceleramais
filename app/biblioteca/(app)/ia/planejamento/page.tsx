'use client';

import { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { ChatInterface } from '@/components/library/ia/ChatInterface';
import { SafetyBanner } from '@/components/library/ia/SafetyBanner';

const ETAPAS = [
  'Educação Infantil',
  'Ensino Fundamental I (1º ao 5º ano)',
  'Ensino Fundamental II (6º ao 9º ano)',
  'Ensino Médio',
  'EJA',
];

const ANOS_POR_ETAPA: Record<string, string[]> = {
  'Educação Infantil': ['Berçário', 'Maternal I', 'Maternal II', 'Pré I', 'Pré II'],
  'Ensino Fundamental I (1º ao 5º ano)': ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'],
  'Ensino Fundamental II (6º ao 9º ano)': ['6º ano', '7º ano', '8º ano', '9º ano'],
  'Ensino Médio': ['1ª série', '2ª série', '3ª série'],
  'EJA': ['Fase I', 'Fase II', 'Fase III'],
};

export default function PlanejamentoPage() {
  const [formDone, setFormDone] = useState(false);
  const [form, setForm] = useState({
    etapa: '',
    ano: '',
    componente: '',
    tema: '',
    duracao: '',
  });
  const [initialMessage, setInitialMessage] = useState('');

  function handleEtapaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm(f => ({ ...f, etapa: e.target.value, ano: '' }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Quero criar um plano de aula com as seguintes informações:

- **Etapa**: ${form.etapa || 'Não informada'}
- **Ano/Série**: ${form.ano || 'Não informado'}
- **Componente curricular**: ${form.componente || 'Não informado'}
- **Tema**: ${form.tema || 'Não informado'}
- **Duração estimada**: ${form.duracao || 'Não informada'}

Por favor, crie um plano de aula completo, alinhado à BNCC, com: contexto, objetivos, habilidades da BNCC, abertura, desenvolvimento, prática, fechamento, avaliação formativa, diferenciação e acessibilidade.`;
    setInitialMessage(msg);
    setFormDone(true);
  }

  const anos = form.etapa ? (ANOS_POR_ETAPA[form.etapa] ?? []) : [];

  if (formDone) {
    return (
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white bg-bib-teal shrink-0"
            aria-hidden="true"
          >
            <Calendar size={20} />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-bib-text-light-primary"
              style={{ fontFamily: 'var(--font-bib-display)' }}
            >
              Planejador de Aulas
            </h1>
            <p className="text-sm text-bib-text-light-muted">
              {form.componente && form.tema ? `${form.componente} · ${form.tema}` : 'Gerando seu plano de aula...'}
            </p>
          </div>
        </div>
        <ChatInterface
          mode="planejamento"
          placeholder="Refine o plano: 'Tornar mais criativa', 'Adicionar DUA', 'Simplificar'..."
          initialSystemMessage={initialMessage}
        />
        <button
          type="button"
          onClick={() => { setFormDone(false); setInitialMessage(''); }}
          className="mt-4 text-xs text-bib-text-light-muted hover:text-bib-text-light-primary transition-colors"
        >
          ← Voltar ao formulário
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white bg-bib-teal shrink-0"
          aria-hidden="true"
        >
          <Calendar size={20} />
        </div>
        <div>
          <h1
            className="text-xl font-bold text-bib-text-light-primary"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            Planejador de Aulas
          </h1>
          <p className="text-sm text-bib-text-light-muted">
            Planos alinhados à BNCC com diferenciação e acessibilidade
          </p>
        </div>
      </div>

      <SafetyBanner />

      <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-bib-md border border-bib-border-light p-6 shadow-sm space-y-5">
        <h2 className="text-sm font-semibold text-bib-text-light-primary" style={{ fontFamily: 'var(--font-bib-display)' }}>
          Sobre a aula
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-bib-text-light-secondary mb-1.5" htmlFor="etapa">
              Etapa de ensino
            </label>
            <select
              id="etapa"
              value={form.etapa}
              onChange={handleEtapaChange}
              required
              className="w-full px-3 py-2 rounded-bib-sm border border-bib-border-light text-sm text-bib-text-light-primary bg-white focus:outline-none focus:ring-2 focus:ring-bib-teal/40"
            >
              <option value="">Selecione...</option>
              {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-bib-text-light-secondary mb-1.5" htmlFor="ano">
              Ano / Série
            </label>
            <select
              id="ano"
              value={form.ano}
              onChange={e => setForm(f => ({ ...f, ano: e.target.value }))}
              disabled={!form.etapa}
              className="w-full px-3 py-2 rounded-bib-sm border border-bib-border-light text-sm text-bib-text-light-primary bg-white focus:outline-none focus:ring-2 focus:ring-bib-teal/40 disabled:opacity-50"
            >
              <option value="">Selecione a etapa primeiro</option>
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-bib-text-light-secondary mb-1.5" htmlFor="componente">
            Componente curricular
          </label>
          <input
            id="componente"
            type="text"
            value={form.componente}
            onChange={e => setForm(f => ({ ...f, componente: e.target.value }))}
            placeholder="Ex: Língua Portuguesa, Matemática, Ciências..."
            required
            className="w-full px-3 py-2 rounded-bib-sm border border-bib-border-light text-sm text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-teal/40"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-bib-text-light-secondary mb-1.5" htmlFor="tema">
            Tema da aula
          </label>
          <input
            id="tema"
            type="text"
            value={form.tema}
            onChange={e => setForm(f => ({ ...f, tema: e.target.value }))}
            placeholder="Ex: Frações, Poesia concreta, Ecossistemas brasileiros..."
            required
            className="w-full px-3 py-2 rounded-bib-sm border border-bib-border-light text-sm text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-teal/40"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-bib-text-light-secondary mb-1.5" htmlFor="duracao">
            Duração estimada
          </label>
          <input
            id="duracao"
            type="text"
            value={form.duracao}
            onChange={e => setForm(f => ({ ...f, duracao: e.target.value }))}
            placeholder="Ex: 50 minutos, 2 aulas de 45 min..."
            className="w-full px-3 py-2 rounded-bib-sm border border-bib-border-light text-sm text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-teal/40"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-bib-sm text-sm font-semibold text-white bg-bib-teal transition-opacity hover:opacity-90"
          >
            Gerar plano de aula
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
