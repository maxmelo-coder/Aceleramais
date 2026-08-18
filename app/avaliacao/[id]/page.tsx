'use client';
import React, { useState, useEffect } from 'react';
import { storageGet, storageSet } from '@/lib/storage';
import { getBancoQuestoesBySerie, getBancoQuestoesById } from '@/lib/banco-questoes';
import type { BancoQuestoes } from '@/lib/banco-questoes';

// Mapeamento de ID de avaliação → banco de questões e série pré-definida
const ASSESSMENT_MAP: Record<string, { bancoId: string; serie: string; titulo: string }> = {
  'diagnostico-6ano-negocios-2025':  { bancoId: 'bq-67-empreendedorismo', serie: '6º ano',  titulo: 'Empreendedorismo · 6º ano'  },
  'diagnostico-7ano-negocios-2025':  { bancoId: 'bq-67-empreendedorismo', serie: '7º ano',  titulo: 'Empreendedorismo · 7º ano'  },
  'diagnostico-8ano-negocios-2025':  { bancoId: 'bq-89-negocios', serie: '8º ano',  titulo: 'Módulo Negócios · 8º ano'  },
  'diagnostico-9ano-negocios-2025':  { bancoId: 'bq-89-negocios', serie: '9º ano',  titulo: 'Módulo Negócios · 9º ano'  },
  // avaliação legada unificada
  'diagnostico-89-negocios-2025':    { bancoId: 'bq-89-negocios', serie: '',         titulo: 'Módulo Negócios · 8º/9º ano' },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface RespostaEstudante {
  id: string;
  assessmentId: string;
  studentName: string;
  cidade: string;
  escola: string;
  turma: string;
  professor: string;
  serie: string;
  respostas: Record<string, string>;
  score: number;
  acertos: number;
  totalQuestoes: number;
  nps: number;
  satisfacao: number;
  moduloFavorito: string;
  gostou: string;
  melhorar: string;
  submittedAt: string;
}

// ─── Scale visual for students ────────────────────────────────────────────────
const SCALE_COLORS = ['', 'bg-red-500 text-white', 'bg-orange-400 text-white', 'bg-yellow-400 text-gray-900', 'bg-lime-500 text-white', 'bg-green-600 text-white'];

function EmojiScale({ label, sublabels, value, onChange }: { label: string; sublabels?: [string, string]; value: number; onChange: (v: number) => void }) {
  const emojis = ['', '😞', '😕', '😐', '🙂', '😊'];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <p className="font-medium text-gray-900 text-sm">{label}</p>
      {sublabels && (
        <div className="flex justify-between text-xs text-gray-400">
          <span>{sublabels[0]}</span>
          <span>{sublabels[1]}</span>
        </div>
      )}
      <div className="flex gap-2 justify-center">
        {[1,2,3,4,5].map(v => (
          <button key={v} type="button" onClick={() => onChange(v)}
            className={`flex flex-col items-center gap-1 w-14 py-2 rounded-xl border-2 transition-all text-lg ${value === v ? SCALE_COLORS[v] + ' border-transparent scale-110' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <span>{emojis[v]}</span>
            <span className={`text-xs font-bold ${value === v ? 'text-inherit' : 'text-gray-400'}`}>{v}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── NPS grid ─────────────────────────────────────────────────────────────────
function NPSGrid({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({length:11},(_,i)=>i).map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`w-11 h-11 rounded-xl text-sm font-bold border-2 transition-all ${value === n
            ? n <= 6 ? 'bg-red-500 text-white border-red-500' : n <= 8 ? 'bg-yellow-400 text-gray-900 border-yellow-400' : 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
          {n}
        </button>
      ))}
    </div>
  );
}

export default function AvaliacaoEstudantePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use ? React.use(params as unknown as Promise<{ id: string }>) : (params as unknown as { id: string });
  const avaliacaoId = resolvedParams?.id ?? 'default';

  // Metadados pré-definidos para este link específico (se existir no mapeamento)
  const assessmentMeta = ASSESSMENT_MAP[avaliacaoId];

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [resultado, setResultado] = useState<{ acertos: number; score: number } | null>(null);

  // Auto-recuperação: reencaminha ao servidor respostas salvas localmente após cold start
  useEffect(() => {
    const local = storageGet<any[]>('acelera_respostas_estudantes', []);
    if (local.length === 0) return;
    local.forEach(entry => {
      fetch('/api/estudantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => {});
    });
  }, []);

  // Etapa 1 - Identificação
  // Se o link já define a série, pré-preenche e bloqueia o campo
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [escola, setEscola] = useState('');
  const [turma, setTurma] = useState('');
  const [professor, setProfessor] = useState('');
  const [serie, setSerie] = useState(assessmentMeta?.serie ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Etapa 2 - Questões diagnósticas
  const [respostasQuestoes, setRespostasQuestoes] = useState<Record<string, string>>({});

  // Etapa 3 - Percepção e NPS
  const [satisfacao, setSatisfacao] = useState(0);
  const [aprendeu, setAprendeu] = useState(0);
  const [moduloFavorito, setModuloFavorito] = useState('');
  const [nps, setNps] = useState(-1);
  const [gostou, setGostou] = useState('');
  const [melhorar, setMelhorar] = useState('');

  // Banco de questões: se o link tem um banco definido, usa direto; caso contrário deriva da série escolhida
  const bancoQuestoes: BancoQuestoes | undefined = assessmentMeta
    ? getBancoQuestoesById(assessmentMeta.bancoId)
    : (serie ? getBancoQuestoesBySerie(serie) : undefined);
  const totalEtapas = bancoQuestoes ? 4 : 3;

  // Step labels depend on whether there's a banco de questões
  const stepLabels = bancoQuestoes
    ? ['Identificação', 'Questões', 'Percepção', 'Resultado']
    : ['Identificação', 'Percepção', 'Resultado'];

  // Map logical step to rendered label index for progress bar
  function getStepLabel(s: number) {
    return stepLabels[s] ?? stepLabels[stepLabels.length - 1];
  }

  function respondidas() {
    if (!bancoQuestoes) return 0;
    return bancoQuestoes.questoes.filter(q => respostasQuestoes[q.id]).length;
  }

  function validateStep0() {
    const errs: Record<string, string> = {};
    if (!nome.trim()) errs.nome = 'Obrigatório';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (step === 0 && !validateStep0()) return;
    setStep(s => s + 1);
  }

  function prevStep() {
    setStep(s => Math.max(0, s - 1));
  }

  function calcularResultado() {
    if (!bancoQuestoes) return { acertos: 0, score: 0 };
    const acertos = bancoQuestoes.questoes.filter(q => respostasQuestoes[q.id] === q.correta).length;
    const score = parseFloat(((acertos / bancoQuestoes.questoes.length) * 10).toFixed(1));
    return { acertos, score };
  }

  async function handleSubmit() {
    const { acertos, score } = calcularResultado();
    setResultado({ acertos, score });

    const resposta: RespostaEstudante = {
      id: 'resp_' + Date.now(),
      assessmentId: avaliacaoId,
      studentName: nome,
      cidade,
      escola,
      turma,
      professor,
      serie,
      respostas: respostasQuestoes,
      score,
      acertos,
      totalQuestoes: bancoQuestoes ? bancoQuestoes.questoes.length : 0,
      nps,
      satisfacao,
      moduloFavorito,
      gostou,
      melhorar,
      submittedAt: new Date().toISOString(),
    };
    // 1. localStorage (fallback offline)
    const existing = storageGet<RespostaEstudante[]>('acelera_respostas_estudantes', []);
    storageSet('acelera_respostas_estudantes', [...existing, resposta]);
    // 2. API servidor (sincronização cross-device)
    try {
      await fetch('/api/estudantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resposta),
      });
    } catch {
      // offline — resposta já salva no localStorage
    }
    setSubmitted(true);
  }

  // ── Step index mapping (with or without questoes step) ──
  // step 0 = Identificação
  // step 1 = Questões (if banco) OR Percepção (if no banco)
  // step 2 = Percepção (if banco) OR submit leads to result
  // step 3 = last step before submit (if banco)
  const percepStep = bancoQuestoes ? 2 : 1;
  const lastStep = bancoQuestoes ? 3 : 2;

  // Score color
  function scoreColor(score: number) {
    if (score >= 7) return 'bg-green-500';
    if (score >= 5) return 'bg-orange-400';
    return 'bg-red-500';
  }

  function scoreMsg(score: number) {
    if (score >= 9) return 'Excelente! Você domina muito bem o conteúdo!';
    if (score >= 7) return 'Muito bom! Continue se dedicando!';
    if (score >= 5) return 'Bom trabalho! Há espaço para crescer ainda mais.';
    return 'Continue estudando! Cada erro é uma oportunidade de aprender.';
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* ── Header com logo ───────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        {/* Accent line */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #F48B1B 0%, #2E8C99 50%, #F48B1B 100%)' }} />
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <img src="/logo.png" alt="Acelera+" className="h-9 w-auto object-contain flex-shrink-0" />
          <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 leading-none tracking-wide uppercase">Questionário do Estudante</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {assessmentMeta ? assessmentMeta.titulo : 'Avaliação Diagnóstica'}
            </p>
          </div>
          {!submitted && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 text-white"
              style={{ background: 'linear-gradient(90deg, #F48B1B, #2E8C99)' }}>
              {step + 1}/{totalEtapas}
            </span>
          )}
        </div>
        {/* Progress degradê */}
        {!submitted && (
          <div className="h-1 bg-gray-100 overflow-hidden">
            <div className="h-full transition-all duration-500 rounded-r-full"
              style={{ width: `${((step+1)/totalEtapas)*100}%`, background: 'linear-gradient(90deg, #F48B1B, #2E8C99)' }} />
          </div>
        )}
      </header>

      {/* Step labels */}
      {!submitted && (
        <div className="bg-white border-b border-gray-50">
          <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-2">
            {stepLabels.map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all ${
                    i < step ? 'bg-green-500 text-white' : step === i ? 'text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                  style={step === i ? { background: 'linear-gradient(135deg, #F48B1B, #2E8C99)' } : {}}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-[11px] font-medium hidden sm:block ${step >= i ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${step > i ? 'bg-[#F48B1B]' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl space-y-5">

          {/* ── Etapa 1 – Identificação ──────────────────────────────────── */}
          {!submitted && step === 0 && (
            <>
            {/* Hero banner */}
            <div className="relative rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #F48B1B 0%, #d4720e 40%, #a85500 100%)' }}>
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 bg-white" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 bg-white" />
              <div className="relative px-6 py-6 flex items-center gap-5">
                <div className="flex-shrink-0 bg-white/15 rounded-2xl p-3 border border-white/20">
                  <img src="/logo.png" alt="Acelera+" className="h-10 w-auto object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
                <div>
                  <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-1">Programa de Educação Empreendedora</p>
                  <h2 className="text-white text-lg font-extrabold leading-tight">Avaliação Diagnóstica</h2>
                  {assessmentMeta && (
                    <p className="text-white/80 text-xs mt-1">{assessmentMeta.titulo}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2.5">
                    {bancoQuestoes && <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">{bancoQuestoes.questoes.length} questões</span>}
                    <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">~10 min</span>
                    <span className="bg-[#2E8C99]/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Gratuito</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Seus dados</h1>
              <p className="text-sm text-gray-500 mb-6">Preencha para começar.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                  <input className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 ${errors.nome ? 'border-red-300' : 'border-gray-200'}`}
                    value={nome} onChange={e => { setNome(e.target.value); setErrors(p => ({...p, nome: ''})); }} placeholder="Seu nome completo" />
                  {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Sua cidade" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Série</label>
                    {assessmentMeta && assessmentMeta.serie !== '' ? (
                      <div className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-700 font-medium">
                        {assessmentMeta.serie}
                      </div>
                    ) : (
                      <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={serie} onChange={e => setSerie(e.target.value)}>
                        <option value="">Selecione</option>
                        {(assessmentMeta ? ['8º ano', '9º ano'] : ['4º ano','5º ano','6º ano','7º ano','8º ano','9º ano']).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Escola</label>
                  <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={escola} onChange={e => setEscola(e.target.value)} placeholder="Nome da escola" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                    <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={turma} onChange={e => setTurma(e.target.value)} placeholder="Ex: 5A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Professor</label>
                    <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={professor} onChange={e => setProfessor(e.target.value)} placeholder="Nome do professor" />
                  </div>
                </div>
              </div>
              <button onClick={next} className="mt-8 w-full text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ background: 'linear-gradient(90deg, #F48B1B, #2E8C99)' }}>
                Continuar →
              </button>
            </div>
            </>
          )}

          {/* ── Etapa 2 – Questões Diagnósticas (only when bancoQuestoes exists) ── */}
          {!submitted && step === 1 && bancoQuestoes && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">{bancoQuestoes.titulo}</h1>
                <p className="text-sm text-gray-500 mt-1">Módulo: {bancoQuestoes.modulo} · {bancoQuestoes.questoes.length} questões</p>
                {/* Progress bar showing answered questions */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Questões respondidas</span>
                    <span className="font-semibold text-[#F48B1B]">{respondidas()} / {bancoQuestoes.questoes.length}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-[#F48B1B] rounded-full transition-all" style={{ width: `${(respondidas() / bancoQuestoes.questoes.length) * 100}%` }} />
                  </div>
                </div>
              </div>

              {bancoQuestoes.questoes.map(q => (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F48B1B] text-white text-sm font-bold flex items-center justify-center">
                      {q.numero}
                    </span>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed pt-1">{q.enunciado}</p>
                  </div>
                  <div className="space-y-2">
                    {q.opcoes.map(op => (
                      <button key={op.letra} type="button"
                        onClick={() => setRespostasQuestoes(prev => ({ ...prev, [q.id]: op.letra }))}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm text-left transition-all ${
                          respostasQuestoes[q.id] === op.letra
                            ? 'bg-[#F48B1B] text-white border-[#F48B1B]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#F48B1B]/50 hover:bg-orange-50'
                        }`}>
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          respostasQuestoes[q.id] === op.letra ? 'border-white text-white' : 'border-gray-300 text-gray-500'
                        }`}>{op.letra}</span>
                        <span>{op.texto}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <button onClick={prevStep} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">← Voltar</button>
                <button onClick={next} className="flex-1 bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* ── Etapa Percepção e NPS ────────────────────────────────────────── */}
          {!submitted && step === percepStep && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">Sua opinião sobre o programa</h1>
                <p className="text-sm text-gray-500 mt-1">Avalie de 1 (ruim) a 5 (ótimo)</p>
              </div>

              <EmojiScale
                label="Como você avalia o programa Acelera+?"
                sublabels={['Muito ruim', 'Excelente']}
                value={satisfacao}
                onChange={setSatisfacao}
              />
              <EmojiScale
                label="Você aprendeu algo útil para sua vida?"
                sublabels={['Não aprendi nada', 'Aprendi muito']}
                value={aprendeu}
                onChange={setAprendeu}
              />

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="font-medium text-gray-900 text-sm mb-3">Qual módulo você mais gostou?</p>
                <div className="flex flex-wrap gap-2">
                  {['Negócios','Educação Financeira','Inovação','Comunicação'].map(m => (
                    <button key={m} type="button" onClick={() => setModuloFavorito(m)}
                      className={`px-4 py-2 rounded-xl text-sm border-2 font-medium transition-colors ${moduloFavorito === m ? 'bg-[#F48B1B] text-white border-[#F48B1B]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <p className="font-medium text-gray-900 text-sm">Em uma escala de 0 a 10, qual a probabilidade de você recomendar o programa para um amigo?</p>
                <NPSGrid value={nps} onChange={setNps} />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0 = Muito improvável</span>
                  <span>10 = Com certeza!</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">O que você mais gostou do programa? (opcional)</label>
                  <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" rows={3}
                    value={gostou} onChange={e => setGostou(e.target.value)} placeholder="Escreva aqui..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">O que poderia ser melhor? (opcional)</label>
                  <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" rows={3}
                    value={melhorar} onChange={e => setMelhorar(e.target.value)} placeholder="Escreva aqui..." />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">← Voltar</button>
                {bancoQuestoes ? (
                  <button onClick={next} className="flex-1 bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                    Ver resultado →
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="flex-1 bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                    Enviar avaliação ✓
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Etapa Resultado (only when there's banco de questões) ──────── */}
          {!submitted && step === lastStep && bancoQuestoes && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">Quase lá!</h1>
                <p className="text-sm text-gray-500 mt-1">Revise e envie sua avaliação.</p>
              </div>

              {/* Preview resultado antes de enviar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm font-medium text-gray-700 mb-4">Resumo das suas respostas:</p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#F48B1B]">{respondidas()}</p>
                    <p className="text-xs text-gray-500">respondidas</p>
                  </div>
                  <div className="flex-1 h-px bg-gray-100" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-400">{bancoQuestoes.questoes.length - respondidas()}</p>
                    <p className="text-xs text-gray-500">em branco</p>
                  </div>
                </div>
                {bancoQuestoes.questoes.length - respondidas() > 0 && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-4">
                    Você deixou {bancoQuestoes.questoes.length - respondidas()} questão(ões) sem resposta. Você ainda pode voltar para respondê-las.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={prevStep} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">← Voltar</button>
                <button onClick={handleSubmit} className="flex-1 bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                  Enviar avaliação ✓
                </button>
              </div>
            </div>
          )}

          {/* ── Confirmação + Resultado ───────────────────────────────────── */}
          {submitted && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Obrigado pela sua participação!</h1>
                <p className="text-[#2E8C99] font-semibold text-lg">{nome}</p>
              </div>

              {resultado && bancoQuestoes && (
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <p className="text-sm text-gray-600">
                    Você acertou <span className="font-bold text-gray-900">{resultado.acertos} de {bancoQuestoes.questoes.length}</span> questões
                  </p>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Nota:</span>
                      <span className="text-3xl font-bold text-[#F48B1B]">{resultado.score.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${scoreColor(resultado.score)}`}
                        style={{ width: `${resultado.score * 10}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{scoreMsg(resultado.score)}</p>
                </div>
              )}

              <a href="/"
                className="inline-block bg-[#F48B1B] hover:bg-[#D4720E] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
                Finalizar
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
