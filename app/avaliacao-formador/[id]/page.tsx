'use client';
import React, { useState } from 'react';
import { storageGet, storageSet } from '@/lib/storage';

// ─── Critérios extraídos do documento "Avaliação de Treinamento" ──────────────
const CRITERIOS = [
  'Demonstrou domínio do conteúdo apresentado',
  'Explicou os temas de forma clara e objetiva',
  'Manteve uma comunicação adequada e acessível',
  'Respondeu às dúvidas com clareza',
  'Demonstrou preparo e organização',
  'Utilizou exemplos práticos relevantes',
  'Estimulou a participação dos participantes',
  'Manteve o interesse e o engajamento durante o treinamento',
  'Demonstrou respeito e cordialidade com os participantes',
  'O tempo do treinamento foi bem administrado',
];

const OPCOES_GERAL = ['Excelente', 'Muito Bom', 'Bom', 'Regular', 'Insatisfatório'];
const ESCALA = [1, 2, 3, 4, 5];
const ESCALA_LABELS: Record<number, string> = {
  1: 'Muito Insatisfeito',
  2: 'Insatisfeito',
  3: 'Regular',
  4: 'Satisfeito',
  5: 'Muito Satisfeito',
};

// 3 etapas: Identificação → Critérios → Perguntas Abertas + Enviar
const STEPS = ['Identificação', 'Critérios de Avaliação', 'Comentários Finais'];

interface FormData {
  nomeFormador: string;
  escola: string;
  municipio: string;
  dataFormacao: string;
  criterios: (number | null)[];
  avaliacaoGeral: string;
  melhor: string;
  melhorar: string;
  aprofundar: string;
  recomendaria: string;
  comentarios: string;
}

function emptyForm(): FormData {
  return {
    nomeFormador: '',
    escola: '',
    municipio: '',
    dataFormacao: '',
    criterios: Array(CRITERIOS.length).fill(null),
    avaliacaoGeral: '',
    melhor: '',
    melhorar: '',
    aprofundar: '',
    recomendaria: '',
    comentarios: '',
  };
}

export default function AvaliacaoFormadorPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(emptyForm());
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function setF(key: keyof FormData, value: string) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  function setCriterio(idx: number, value: number) {
    setData(prev => {
      const next = [...prev.criterios];
      next[idx] = value;
      return { ...prev, criterios: next };
    });
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (step === 0) {
      if (!data.nomeFormador.trim()) errs.push('Informe o nome do formador avaliado.');
      if (!data.escola.trim()) errs.push('Informe a escola.');
      if (!data.dataFormacao) errs.push('Informe a data do treinamento.');
    }
    if (step === 1) {
      const blank = data.criterios.filter(c => c === null).length;
      if (blank > 0) errs.push(`Avalie todos os ${CRITERIOS.length} critérios.`);
      if (!data.avaliacaoGeral) errs.push('Selecione a avaliação geral do formador.');
    }
    if (step === 2) {
      if (!data.recomendaria) errs.push('Responda se recomendaria este formador.');
    }
    return errs;
  }

  function next() {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
    // Submit
    const all = storageGet<any[]>('acelera_forms_formador', []);
    const entry = { ...data, id: 'ff_' + Date.now(), submittedAt: new Date().toISOString() };
    storageSet('acelera_forms_formador', [...all, entry]);
    setSubmitted(true);
  }

  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);
  const mediaFinal = data.criterios.filter(c => c !== null).length === CRITERIOS.length
    ? (data.criterios.reduce((a: number, c) => a + (c ?? 0), 0) / CRITERIOS.length).toFixed(1)
    : null;

  // ─── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e8f4f6 100%)' }}>
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Avaliação enviada!</h2>
          <p className="text-gray-500 text-sm mb-6">Obrigado pelo seu feedback. Ele é fundamental para a melhoria contínua dos nossos treinamentos.</p>
          {mediaFinal && (
            <div className="bg-[#2E8C99]/10 rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">Sua nota média para o formador</p>
              <p className="text-3xl font-extrabold text-[#2E8C99]">{mediaFinal}<span className="text-base font-medium text-gray-400">/5</span></p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Formador</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{data.nomeFormador}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Avaliação Geral</p>
              <p className="text-sm font-semibold text-gray-800">{data.avaliacaoGeral}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Recomenda</p>
              <p className="text-sm font-semibold text-gray-800">{data.recomendaria}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 font-semibold uppercase mb-0.5">Data</p>
              <p className="text-sm font-semibold text-gray-800">{data.dataFormacao || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e8f4f6 100%)' }}>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3 py-3">
            <img src="/logo.png" alt="Acelera+" className="h-8 w-auto object-contain" />
            <div className="w-px h-5 bg-gray-200" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Programa de Educação Empreendedora</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">Avaliação de Treinamento</p>
            </div>
          </div>
          {/* Gradient accent line */}
          <div className="h-0.5 -mx-4" style={{ background: 'linear-gradient(90deg, #2E8C99, #F48B1B)' }} />
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div className="h-full transition-all duration-500"
          style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #2E8C99, #F48B1B)' }} />
      </div>

      {/* Step pills */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex gap-2 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            i === step ? 'text-white shadow-sm' :
            i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
          }`} style={i === step ? { background: 'linear-gradient(90deg, #2E8C99, #F48B1B)' } : {}}>
            {i < step ? '✓' : `${i + 1}.`} {s}
          </div>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">

        {/* ── Hero Banner (step 0 only) ────────────────────────────────── */}
        {step === 0 && (
          <div className="relative rounded-3xl overflow-hidden mb-2"
            style={{ background: 'linear-gradient(135deg, #F48B1B 0%, #d4720e 40%, #b85e0b 100%)' }}>
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: '#2E8C99' }} />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10" style={{ background: 'white' }} />
            <div className="relative px-6 py-7 flex items-center gap-5">
              <div className="flex-shrink-0 bg-white rounded-2xl p-3 shadow-lg">
                <img src="/logo.png" alt="Acelera+" className="h-12 w-auto object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-1">Avaliação de Treinamento</p>
                <h2 className="text-white text-xl font-extrabold leading-tight">Avaliação do Formador</h2>
                <p className="text-white/70 text-xs mt-1.5 leading-relaxed">
                  Questionário para avaliação do desempenho do formador durante o treinamento.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 0: Identificação ─────────────────────────────────────── */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Identificação</h3>
              <p className="text-xs text-gray-500">Informe os dados do treinamento antes de iniciar.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nome do formador avaliado *</label>
              <input value={data.nomeFormador} onChange={e => setF('nomeFormador', e.target.value)}
                placeholder="Nome completo do formador"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F48B1B]/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Escola *</label>
                <input value={data.escola} onChange={e => setF('escola', e.target.value)}
                  placeholder="Nome da escola"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F48B1B]/30" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Município</label>
                <input value={data.municipio} onChange={e => setF('municipio', e.target.value)}
                  placeholder="Cidade"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F48B1B]/30" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Data do treinamento *</label>
              <input type="date" value={data.dataFormacao} onChange={e => setF('dataFormacao', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F48B1B]/30" />
            </div>
          </div>
        )}

        {/* ── STEP 1: Critérios ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Legenda */}
            <div className="bg-[#F48B1B]/5 border border-[#F48B1B]/20 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Avalie cada item de 1 a 5:</p>
              <div className="flex flex-wrap gap-2">
                {ESCALA.map(n => (
                  <span key={n} className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
                    <strong>{n}</strong> = {ESCALA_LABELS[n]}
                  </span>
                ))}
              </div>
            </div>

            {CRITERIOS.map((criterio, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-sm font-medium text-gray-800 mb-3">{criterio}</p>
                <div className="flex gap-2 flex-wrap">
                  {ESCALA.map(n => (
                    <button key={n} onClick={() => setCriterio(i, n)}
                      className={`flex-1 min-w-[44px] py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        data.criterios[i] === n
                          ? 'border-[#F48B1B] bg-[#F48B1B] text-white shadow-md'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-[#F48B1B]/50'
                      }`}>
                      {n}
                    </button>
                  ))}
                </div>
                {data.criterios[i] !== null && (
                  <p className="text-[11px] text-[#F48B1B] font-medium mt-2">{ESCALA_LABELS[data.criterios[i]!]}</p>
                )}
              </div>
            ))}

            {/* Avaliação Geral */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-900 mb-3">Como você avalia o desempenho geral do formador? *</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {OPCOES_GERAL.map(op => (
                  <button key={op} onClick={() => setF('avaliacaoGeral', op)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      data.avaliacaoGeral === op
                        ? 'border-[#2E8C99] bg-[#2E8C99] text-white shadow-md'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-[#2E8C99]/50'
                    }`}>
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Perguntas Abertas ─────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
              <h3 className="font-bold text-gray-900">Perguntas Abertas</h3>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  1. O que o formador fez de melhor durante o treinamento?
                </label>
                <textarea value={data.melhor} onChange={e => setF('melhor', e.target.value)}
                  rows={3} placeholder="Descreva os pontos positivos..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  2. O que poderia ser melhorado?
                </label>
                <textarea value={data.melhorar} onChange={e => setF('melhorar', e.target.value)}
                  rows={3} placeholder="Sugestões de melhoria..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  3. Houve algum conteúdo que gostaria que fosse aprofundado?
                </label>
                <textarea value={data.aprofundar} onChange={e => setF('aprofundar', e.target.value)}
                  rows={2} placeholder="Conteúdos que merecem mais atenção..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  4. Você recomendaria este formador para futuros treinamentos? *
                </label>
                <div className="flex gap-3">
                  {['Sim', 'Talvez', 'Não'].map((op, idx) => {
                    const colors = [
                      { border: '#059669', bg: '#059669' },
                      { border: '#F48B1B', bg: '#F48B1B' },
                      { border: '#E30613', bg: '#E30613' },
                    ];
                    const sel = data.recomendaria === op;
                    return (
                      <button key={op} onClick={() => setF('recomendaria', op)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                          sel ? 'text-white shadow-md' : 'bg-gray-50 text-gray-600'
                        }`}
                        style={sel
                          ? { borderColor: colors[idx].border, background: colors[idx].bg }
                          : { borderColor: '#e5e7eb' }
                        }>
                        {op}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  5. Comentários ou sugestões adicionais
                </label>
                <textarea value={data.comentarios} onChange={e => setF('comentarios', e.target.value)}
                  rows={3} placeholder="Deixe aqui qualquer comentário adicional..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
              </div>
            </div>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-700 mb-1">Por favor, corrija os seguintes itens:</p>
            <ul className="space-y-0.5">
              {errors.map((e, i) => <li key={i} className="text-xs text-red-600">• {e}</li>)}
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2 pb-8">
          {step > 0 && (
            <button onClick={() => { setStep(s => s - 1); setErrors([]); }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              ← Voltar
            </button>
          )}
          <button onClick={next}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(90deg, #F48B1B, #2E8C99)' }}>
            {step < STEPS.length - 1 ? 'Continuar →' : '✓ Enviar avaliação'}
          </button>
        </div>
      </main>
    </div>
  );
}
