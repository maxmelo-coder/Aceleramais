'use client';
import React, { useState } from 'react';
import { storageGet, storageSet } from '@/lib/storage';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DocenteFormData {
  id: string;
  createdAt: string;
  formId: string;
  nomeProfessor: string;
  escola: string;
  turmas: string;
  municipio: string;
  qtdEstudantes: string;
  concluiuModulo: string;
  moduloAtual: string;
  b2_material: number; b2_atividades: number; b2_interesse: number; b2_tempo: number; b2_livro: number;
  b3_nivel: number; b3_necessidade: number; b3_planejamento: number; b3_ideias: number;
  b4_iniciativa: number; b4_criatividade: number; b4_resolucao: number; b4_lideranca: number;
  b4_equipe: number; b4_comunicacao: number; b4_planejamento: number;
  b5_dominio: number; b5_material: number; b5_organizacao: number; b5_conducao: number;
  b5_engajamento: number; b5_motivacao: number; b5_objetivos: number;
  b6_aulasMinistradas: string; b6_atividadesPraticas: string; b6_apresentacaoProjetos: string;
  b6_recursosComplementares: string; b6_participacaoRegular: string;
  b7_dificuldades: string[];
  b7_outrosTexto: string;
  b8_interesse: number; b8_iniciativa: number; b8_vidaReal: number; b8_protagonismo: number;
  b9_nps: number; b9_justificativa: string;
  b10_melhorias: string; b10_sugestoes: string; b10_aprendizagem: string; b10_melhorAtividade: string;
  indiceImplementacao: number; indiceAprendizagem: number; indiceCompetencias: number;
  indiceAutoeficacia: number; indiceEngajamento: number;
}

function emptyForm(): DocenteFormData {
  return {
    id: '', createdAt: '', formId: '',
    nomeProfessor: '', escola: '', turmas: '', municipio: '',
    qtdEstudantes: '', concluiuModulo: '', moduloAtual: '',
    b2_material: 0, b2_atividades: 0, b2_interesse: 0, b2_tempo: 0, b2_livro: 0,
    b3_nivel: 0, b3_necessidade: 0, b3_planejamento: 0, b3_ideias: 0,
    b4_iniciativa: 0, b4_criatividade: 0, b4_resolucao: 0, b4_lideranca: 0,
    b4_equipe: 0, b4_comunicacao: 0, b4_planejamento: 0,
    b5_dominio: 0, b5_material: 0, b5_organizacao: 0, b5_conducao: 0,
    b5_engajamento: 0, b5_motivacao: 0, b5_objetivos: 0,
    b6_aulasMinistradas: '', b6_atividadesPraticas: '', b6_apresentacaoProjetos: '',
    b6_recursosComplementares: '', b6_participacaoRegular: '',
    b7_dificuldades: [], b7_outrosTexto: '',
    b8_interesse: 0, b8_iniciativa: 0, b8_vidaReal: 0, b8_protagonismo: 0,
    b9_nps: -1, b9_justificativa: '',
    b10_melhorias: '', b10_sugestoes: '', b10_aprendizagem: '', b10_melhorAtividade: '',
    indiceImplementacao: 0, indiceAprendizagem: 0, indiceCompetencias: 0,
    indiceAutoeficacia: 0, indiceEngajamento: 0,
  };
}

function avg(...vals: number[]) {
  const v = vals.filter(x => x > 0);
  return v.length === 0 ? 0 : v.reduce((a, b) => a + b, 0) / v.length;
}

function calcIndices(d: DocenteFormData) {
  return {
    indiceImplementacao: Math.round(avg(d.b2_material, d.b2_atividades, d.b2_interesse, d.b2_tempo, d.b2_livro) * 20),
    indiceAprendizagem:  Math.round(avg(d.b3_nivel, d.b3_necessidade, d.b3_planejamento, d.b3_ideias) * 20),
    indiceCompetencias:  Math.round(avg(d.b4_iniciativa, d.b4_criatividade, d.b4_resolucao, d.b4_lideranca, d.b4_equipe, d.b4_comunicacao, d.b4_planejamento) * 20),
    indiceAutoeficacia:  Math.round(avg(d.b5_dominio, d.b5_material, d.b5_organizacao, d.b5_conducao, d.b5_engajamento, d.b5_motivacao, d.b5_objetivos) * 20),
    indiceEngajamento:   d.b6_participacaoRegular === 'Mais de 75%' ? 100 : d.b6_participacaoRegular === '50% a 75%' ? 62 : d.b6_participacaoRegular === 'Menos de 50%' ? 25 : 0,
  };
}

// ─── Scale (1–5) ──────────────────────────────────────────────────────────────
const SCALE_COLORS = ['', 'bg-red-500 text-white', 'bg-orange-400 text-white', 'bg-yellow-400 text-gray-900', 'bg-lime-500 text-white', 'bg-green-600 text-white'];

function ScaleRow({ label, field, data, onChange }: { label: string; field: keyof DocenteFormData; data: DocenteFormData; onChange: (f: keyof DocenteFormData, v: number) => void }) {
  const val = data[field] as number;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700 flex-1 leading-snug">{label}</span>
      <div className="flex gap-1.5 flex-shrink-0">
        {[1,2,3,4,5].map(v => (
          <button key={v} type="button" onClick={() => onChange(field, v)}
            className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all ${val === v ? SCALE_COLORS[v] + ' border-transparent scale-105' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'}`}>
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

function RadioRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2 pb-3 border-b border-gray-100 last:border-0">
      <p className="text-sm text-gray-700 font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} type="button" onClick={() => onChange(o)}
            className={`px-3 py-1.5 rounded-lg text-xs border-2 transition-colors font-medium ${value === o ? 'bg-[#F48B1B] text-white border-[#F48B1B]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function NPSGrid({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {Array.from({ length: 11 }, (_, i) => i).map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all ${value === n
            ? n <= 6 ? 'bg-red-500 text-white border-red-500' : n <= 8 ? 'bg-yellow-400 text-gray-900 border-yellow-400' : 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
          {n}
        </button>
      ))}
    </div>
  );
}

const STEPS = ['Identificação', 'Implementação do Módulo', 'Aprendizagem', 'Competências', 'Autoavaliação', 'Monitoramento', 'Dificuldades', 'Impacto', 'NPS', 'Questões Abertas'];
const MODULOS = ['Módulo I – Negócios', 'Módulo II – Educação Financeira', 'Módulo III – Inovação', 'Módulo IV – Comunicação'];
const DIFICULDADES_OPTS = [
  'Falta de tempo na grade curricular',
  'Pouco interesse dos estudantes',
  'Dificuldade de compreensão do conteúdo',
  'Falta de recursos tecnológicos',
  'Necessidade de mais formação',
  'Ausência de apoio familiar',
  'Carga horária insuficiente',
  'Outros',
];

function BlockCard({ step, title, subtitle, children }: { step: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-[#2E8C99] to-[#256e78] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{step}</div>
          <div>
            <h3 className="text-white font-semibold text-base leading-none">{title}</h3>
            {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function AvaliacaoDocentePublicaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use ? React.use(params as unknown as Promise<{ id: string }>) : (params as unknown as { id: string });
  const formId = resolvedParams?.id ?? 'default';

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<DocenteFormData>(() => ({ ...emptyForm(), formId }));

  function setF(field: keyof DocenteFormData, value: string | number | boolean | string[]) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  function toggleDificuldade(opt: string) {
    setData(prev => {
      const cur = prev.b7_dificuldades;
      return { ...prev, b7_dificuldades: cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt] };
    });
  }

  function canAdvance(): boolean {
    if (step === 0) return !!data.nomeProfessor.trim() && !!data.escola.trim() && !!data.municipio.trim() && !!data.moduloAtual;
    if (step === 1) return [data.b2_material, data.b2_atividades, data.b2_interesse, data.b2_tempo, data.b2_livro].every(v => v > 0);
    if (step === 2) return [data.b3_nivel, data.b3_necessidade, data.b3_planejamento, data.b3_ideias].every(v => v > 0);
    if (step === 3) return [data.b4_iniciativa, data.b4_criatividade, data.b4_resolucao, data.b4_lideranca, data.b4_equipe, data.b4_comunicacao, data.b4_planejamento].every(v => v > 0);
    if (step === 4) return [data.b5_dominio, data.b5_material, data.b5_organizacao, data.b5_conducao, data.b5_engajamento, data.b5_motivacao, data.b5_objetivos].every(v => v > 0);
    if (step === 5) return !!data.b6_aulasMinistradas && !!data.b6_participacaoRegular;
    if (step === 8) return data.b9_nps >= 0;
    return true;
  }

  async function handleSubmit() {
    const indices = calcIndices(data);
    const final: DocenteFormData = {
      ...data,
      ...indices,
      id: 'doc_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    // 1. localStorage (fallback offline)
    const existing = storageGet<DocenteFormData[]>('acelera_forms_docente', []);
    storageSet('acelera_forms_docente', [...existing, final]);
    // 2. API servidor (sincronização cross-device)
    try {
      await fetch('/api/docente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(final),
      });
    } catch {
      // offline — resposta já salva no localStorage
    }
    setSubmitted(true);
  }

  if (submitted) {
    const indices = calcIndices(data);
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #EBF6F7 0%, #FEF3E2 50%, #EBF6F7 100%)' }}>
        {/* Success header */}
        <div className="flex justify-center pt-10 pb-6">
          <img src="/logo.png" alt="Acelera+" className="h-14 w-auto object-contain drop-shadow-sm" />
        </div>

        <div className="flex-1 flex items-start justify-center px-4 pb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full overflow-hidden">
            {/* Top gradient band */}
            <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #2E8C99, #F48B1B)' }} />

            <div className="p-8 text-center space-y-6">
              {/* Success icon */}
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                  style={{ background: 'linear-gradient(135deg, #2E8C99 0%, #16a34a 100%)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#F48B1B] flex items-center justify-center shadow-md">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">Avaliação enviada!</h2>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Obrigado, <span className="font-bold text-[#2E8C99]">{data.nomeProfessor}</span>.<br/>
                  Suas respostas foram registradas com sucesso.
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Seus índices</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Índices */}
              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  { label: 'Implementação', value: indices.indiceImplementacao, color: '#2E8C99', bg: '#EBF6F7' },
                  { label: 'Aprendizagem',  value: indices.indiceAprendizagem,  color: '#16a34a', bg: '#f0fdf4' },
                  { label: 'Competências',  value: indices.indiceCompetencias,  color: '#F48B1B', bg: '#FEF3E2' },
                  { label: 'Autoeficácia',  value: indices.indiceAutoeficacia,  color: '#9333ea', bg: '#faf5ff' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className="rounded-2xl p-4 text-center" style={{ backgroundColor: bg }}>
                    <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
                    <p className="text-3xl font-black leading-none" style={{ color }}>{value}<span className="text-base font-bold">%</span></p>
                    {/* Mini progress bar */}
                    <div className="mt-2 h-1.5 rounded-full bg-white/70 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2.5 leading-relaxed">
                📊 Seus dados já estão disponíveis para a equipe Acelera+ em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* ── Hero header com logo ───────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        {/* Top accent line */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #2E8C99 0%, #F48B1B 50%, #2E8C99 100%)' }} />

        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <img src="/logo.png" alt="Acelera+" className="h-9 w-auto object-contain flex-shrink-0" />

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 leading-none tracking-wide uppercase">Avaliação Docente</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{STEPS[step]}</p>
          </div>
          <span className="text-xs font-semibold text-[#2E8C99] bg-[#EBF6F7] px-2 py-1 rounded-lg flex-shrink-0">
            {step + 1}/{STEPS.length}
          </span>
        </div>
        {/* Progress bar degradê */}
        <div className="h-1 bg-gray-100 overflow-hidden">
          <div className="h-full transition-all duration-500 rounded-r-full"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2E8C99, #F48B1B)' }} />
        </div>
      </header>

      {/* Step pills */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max pb-1">
          {STEPS.map((s, i) => (
            <div key={s} className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
              i === step ? 'text-white shadow-sm' : i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}
            style={i === step ? { background: 'linear-gradient(90deg, #2E8C99, #F48B1B)' } : {}}>
              {i < step ? '✓' : i + 1}. {s}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">

        {/* ─ STEP 0: Identificação ─────────────────────────────────────── */}
        {step === 0 && (
          <>
          {/* Hero banner só no step 0 */}
          <div className="relative rounded-3xl overflow-hidden mb-2"
            style={{ background: 'linear-gradient(135deg, #2E8C99 0%, #1d6b75 40%, #0f4a52 100%)' }}>
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: '#F48B1B' }} />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10" style={{ background: '#F48B1B' }} />
            <div className="absolute top-4 right-16 w-10 h-10 rounded-full opacity-15" style={{ background: 'white' }} />

            <div className="relative px-6 py-7 flex items-center gap-5">
              {/* Logo branca em container */}
              <div className="flex-shrink-0 bg-white rounded-2xl p-3 shadow-lg">
                <img src="/logo.png" alt="Acelera+" className="h-12 w-auto object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-1">Programa de Educação Empreendedora</p>
                <h2 className="text-white text-xl font-extrabold leading-tight">Avaliação Docente</h2>
                <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
                  Questionário diagnóstico para acompanhar a implementação do programa nas escolas.
                </p>
              </div>
            </div>
          </div>

          <BlockCard step={1} title="Identificação do Professor" subtitle="Informe seus dados antes de iniciar">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nome completo *</label>
                <input value={data.nomeProfessor} onChange={e => setF('nomeProfessor', e.target.value)}
                  placeholder="Seu nome completo" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Escola *</label>
                  <input value={data.escola} onChange={e => setF('escola', e.target.value)}
                    placeholder="Nome da escola" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Município *</label>
                  <input value={data.municipio} onChange={e => setF('municipio', e.target.value)}
                    placeholder="Cidade" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Turma(s)</label>
                  <input value={data.turmas} onChange={e => setF('turmas', e.target.value)}
                    placeholder="Ex: 8ºA, 9ºB" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nº de estudantes</label>
                  <input value={data.qtdEstudantes} onChange={e => setF('qtdEstudantes', e.target.value)}
                    placeholder="Quantidade" type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Módulo em andamento *</label>
                <div className="flex flex-wrap gap-2">
                  {MODULOS.map(m => (
                    <button key={m} type="button" onClick={() => setF('moduloAtual', m)}
                      className={`px-3 py-2 rounded-xl text-xs border-2 transition-colors font-medium ${data.moduloAtual === m ? 'bg-[#F48B1B] text-white border-[#F48B1B]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <RadioRow label="Concluiu o módulo?" options={['Sim, totalmente', 'Parcialmente', 'Não']}
                value={data.concluiuModulo} onChange={v => setF('concluiuModulo', v)} />
            </div>
          </BlockCard>
          </>
        )}

        {/* ─ STEP 1: Implementação ─────────────────────────────────────── */}
        {step === 1 && (
          <BlockCard step={2} title="Implementação do Módulo" subtitle="Avalie de 1 (muito ruim) a 5 (excelente)">
            <div className="mb-3 flex justify-between text-xs text-gray-400">
              <span>1 = Muito ruim</span><span>5 = Excelente</span>
            </div>
            {([
              ['b2_material',    'Adequação dos materiais didáticos'],
              ['b2_atividades',  'Facilidade de execução das atividades'],
              ['b2_interesse',   'Interesse dos estudantes no conteúdo'],
              ['b2_tempo',       'Suficiência do tempo disponível'],
              ['b2_livro',       'Contribuição do livro didático'],
            ] as [keyof DocenteFormData, string][]).map(([f, l]) => (
              <ScaleRow key={f} label={l} field={f} data={data} onChange={(k, v) => setF(k, v)} />
            ))}
          </BlockCard>
        )}

        {/* ─ STEP 2: Aprendizagem ──────────────────────────────────────── */}
        {step === 2 && (
          <BlockCard step={3} title="Aprendizagem dos Estudantes" subtitle="Como você percebe o aprendizado da turma?">
            <div className="mb-3 flex justify-between text-xs text-gray-400">
              <span>1 = Muito baixo</span><span>5 = Muito alto</span>
            </div>
            {([
              ['b3_nivel',        'Nível de compreensão do conteúdo pela turma'],
              ['b3_necessidade',  'Os estudantes veem necessidade x oportunidade de empreender'],
              ['b3_planejamento', 'Entendimento sobre a importância do planejamento'],
              ['b3_ideias',       'Capacidade de desenvolver e defender ideias'],
            ] as [keyof DocenteFormData, string][]).map(([f, l]) => (
              <ScaleRow key={f} label={l} field={f} data={data} onChange={(k, v) => setF(k, v)} />
            ))}
          </BlockCard>
        )}

        {/* ─ STEP 3: Competências ──────────────────────────────────────── */}
        {step === 3 && (
          <BlockCard step={4} title="Competências Empreendedoras Desenvolvidas" subtitle="Quanto cada competência foi desenvolvida na turma? (1-5)">
            <div className="mb-3 flex justify-between text-xs text-gray-400">
              <span>1 = Pouco desenvolvida</span><span>5 = Muito desenvolvida</span>
            </div>
            {([
              ['b4_iniciativa',   'Iniciativa e proatividade'],
              ['b4_criatividade', 'Criatividade e inovação'],
              ['b4_resolucao',    'Resolução de problemas'],
              ['b4_lideranca',    'Liderança'],
              ['b4_equipe',       'Trabalho em equipe'],
              ['b4_comunicacao',  'Comunicação e argumentação'],
              ['b4_planejamento', 'Planejamento e organização'],
            ] as [keyof DocenteFormData, string][]).map(([f, l]) => (
              <ScaleRow key={f} label={l} field={f} data={data} onChange={(k, v) => setF(k, v)} />
            ))}
          </BlockCard>
        )}

        {/* ─ STEP 4: Autoavaliação ─────────────────────────────────────── */}
        {step === 4 && (
          <BlockCard step={5} title="Autoavaliação do Professor" subtitle="Avalie sua própria atuação neste módulo (1-5)">
            <div className="mb-3 flex justify-between text-xs text-gray-400">
              <span>1 = Precisa melhorar</span><span>5 = Excelente</span>
            </div>
            {([
              ['b5_dominio',      'Domínio do conteúdo empreendedor'],
              ['b5_material',     'Uso e aproveitamento dos materiais'],
              ['b5_organizacao',  'Organização e planejamento das aulas'],
              ['b5_conducao',     'Capacidade de conduzir as atividades'],
              ['b5_engajamento',  'Engajamento e entusiasmo com o programa'],
              ['b5_motivacao',    'Capacidade de motivar os estudantes'],
              ['b5_objetivos',    'Alcance dos objetivos do módulo'],
            ] as [keyof DocenteFormData, string][]).map(([f, l]) => (
              <ScaleRow key={f} label={l} field={f} data={data} onChange={(k, v) => setF(k, v)} />
            ))}
          </BlockCard>
        )}

        {/* ─ STEP 5: Monitoramento ─────────────────────────────────────── */}
        {step === 5 && (
          <BlockCard step={6} title="Monitoramento da Execução" subtitle="Dados objetivos sobre a execução do módulo">
            <div className="space-y-4">
              <RadioRow label="Quantidade de aulas ministradas *"
                options={['1 a 3 aulas', '4 a 6 aulas', '7 a 10 aulas', 'Mais de 10 aulas']}
                value={data.b6_aulasMinistradas} onChange={v => setF('b6_aulasMinistradas', v)} />
              <RadioRow label="Atividades práticas realizadas"
                options={['Nenhuma', '1 a 2', '3 a 5', 'Mais de 5']}
                value={data.b6_atividadesPraticas} onChange={v => setF('b6_atividadesPraticas', v)} />
              <RadioRow label="Apresentação de projetos pelos estudantes"
                options={['Não houve', 'Parcialmente', 'Sim, todos apresentaram']}
                value={data.b6_apresentacaoProjetos} onChange={v => setF('b6_apresentacaoProjetos', v)} />
              <RadioRow label="Uso de recursos complementares (vídeos, dinâmicas, jogos)"
                options={['Não utilizei', 'Utilizei raramente', 'Utilizei frequentemente']}
                value={data.b6_recursosComplementares} onChange={v => setF('b6_recursosComplementares', v)} />
              <RadioRow label="Participação regular dos estudantes *"
                options={['Menos de 50%', '50% a 75%', 'Mais de 75%']}
                value={data.b6_participacaoRegular} onChange={v => setF('b6_participacaoRegular', v)} />
            </div>
          </BlockCard>
        )}

        {/* ─ STEP 6: Dificuldades ──────────────────────────────────────── */}
        {step === 6 && (
          <BlockCard step={7} title="Dificuldades Encontradas" subtitle="Marque todas as que se aplicam (opcional)">
            <div className="space-y-2">
              {DIFICULDADES_OPTS.map(opt => {
                const checked = data.b7_dificuldades.includes(opt);
                return (
                  <button key={opt} type="button" onClick={() => toggleDificuldade(opt)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors text-sm ${checked ? 'bg-[#F48B1B]/10 border-[#F48B1B] text-[#D4720E] font-medium' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${checked ? 'bg-[#F48B1B] border-[#F48B1B]' : 'border-gray-300'}`}>
                      {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                    </div>
                    {opt}
                  </button>
                );
              })}
              {data.b7_dificuldades.includes('Outros') && (
                <textarea value={data.b7_outrosTexto} onChange={e => setF('b7_outrosTexto', e.target.value)}
                  placeholder="Descreva a dificuldade..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F48B1B]/30 mt-1" />
              )}
            </div>
          </BlockCard>
        )}

        {/* ─ STEP 7: Impacto Percebido ─────────────────────────────────── */}
        {step === 7 && (
          <BlockCard step={8} title="Impacto Percebido nos Estudantes" subtitle="Em sua percepção, o programa provocou mudanças? (1-5)">
            <div className="mb-3 flex justify-between text-xs text-gray-400">
              <span>1 = Nenhuma mudança</span><span>5 = Mudança significativa</span>
            </div>
            {([
              ['b8_interesse',   'Despertou interesse pelo empreendedorismo'],
              ['b8_iniciativa',  'Estudantes demonstraram mais iniciativa'],
              ['b8_vidaReal',    'Conexão com situações reais de negócios'],
              ['b8_protagonismo','Desenvolvimento do protagonismo estudantil'],
            ] as [keyof DocenteFormData, string][]).map(([f, l]) => (
              <ScaleRow key={f} label={l} field={f} data={data} onChange={(k, v) => setF(k, v)} />
            ))}
          </BlockCard>
        )}

        {/* ─ STEP 8: NPS ───────────────────────────────────────────────── */}
        {step === 8 && (
          <BlockCard step={9} title="Satisfação com o Programa" subtitle="De 0 a 10, quanto você recomendaria o Acelera+ a um colega?">
            <div className="space-y-5">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>0 = Não recomendaria</span>
                <span>10 = Com certeza recomendaria</span>
              </div>
              <NPSGrid value={data.b9_nps} onChange={v => setF('b9_nps', v)} />
              {data.b9_nps >= 0 && (
                <div className={`text-center text-sm font-semibold px-3 py-2 rounded-xl ${data.b9_nps >= 9 ? 'bg-green-50 text-green-700' : data.b9_nps >= 7 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                  {data.b9_nps >= 9 ? '😊 Promotor — Você ama o programa!' : data.b9_nps >= 7 ? '😐 Neutro — Gosta, mas tem ressalvas' : '😟 Detrator — Algo precisa melhorar'}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Justifique sua nota (opcional)</label>
                <textarea value={data.b9_justificativa} onChange={e => setF('b9_justificativa', e.target.value)}
                  placeholder="O que influenciou sua avaliação?" rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
              </div>
            </div>
          </BlockCard>
        )}

        {/* ─ STEP 9: Questões Abertas ──────────────────────────────────── */}
        {step === 9 && (
          <BlockCard step={10} title="Questões Abertas" subtitle="Suas respostas são fundamentais para melhorar o programa">
            <div className="space-y-4">
              {([
                ['b10_melhorias',     'O que poderia ser melhorado no programa para a sua realidade escolar?'],
                ['b10_sugestoes',     'Que sugestões você daria para as próximas turmas?'],
                ['b10_aprendizagem',  'Descreva um momento de aprendizagem marcante com sua turma neste módulo.'],
                ['b10_melhorAtividade','Qual foi a atividade que mais engajou os estudantes? Por quê?'],
              ] as [keyof DocenteFormData, string][]).map(([f, l]) => (
                <div key={f}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{l}</label>
                  <textarea value={data[f] as string} onChange={e => setF(f, e.target.value)}
                    rows={3} placeholder="Sua resposta..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" />
                </div>
              ))}
            </div>
          </BlockCard>
        )}

        {/* ─ Navigation ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
            Anterior
          </button>

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => { if (canAdvance()) setStep(s => s + 1); else alert('Por favor, preencha os campos obrigatórios antes de continuar.'); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${canAdvance() ? 'bg-[#2E8C99] hover:bg-[#256e78]' : 'bg-gray-300 cursor-not-allowed'}`}>
              Próximo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              Enviar avaliação
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
