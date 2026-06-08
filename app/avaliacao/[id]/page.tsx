'use client';
import React, { useState } from 'react';
import { storageGet, storageSet } from '@/lib/storage';

// ─── Types ────────────────────────────────────────────────────────────────────
interface EstudanteResposta {
  id: string;
  avaliacaoId: string;
  submittedAt: string;
  // Etapa 1
  nome: string;
  cidade: string;
  escola: string;
  turma: string;
  professor: string;
  serie: string;
  // Etapa 2
  e2_aprendeu: number;
  e2_material: number;
  e2_facilidade: number;
  e2_criouIdeias: number;
  e2_quer_empreender: number;
  e2_moduloFavorito: string;
  // Etapa 3
  e3_iniciativa: number;
  e3_criatividade: number;
  e3_resolucao: number;
  e3_equipe: number;
  e3_comunicacao: number;
  // Etapa 4
  e4_nps: number;
  e4_gostou: string;
  e4_melhorar: string;
}

// ─── Scale visual for students ────────────────────────────────────────────────
const SCALE_COLORS = ['', 'bg-red-500 text-white', 'bg-orange-400 text-white', 'bg-yellow-400 text-gray-900', 'bg-lime-500 text-white', 'bg-green-600 text-white'];

function EmojiScale({ label, sublabels, value, onChange }: { label: string; sublabels?: [string, string]; value: number; onChange: (v: number) => void }) {
  const emojis = ['', '😞', '😕', '😐', '😊', '😄'];
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

const STEP_LABELS = ['Identificação', 'Avaliação do Módulo', 'Competências', 'NPS & Envio'];

export default function AvaliacaoEstudantePage({ params }: { params: Promise<{ id: string }> }) {
  // Note: params may be a promise in Next.js 16; for simplicity we use React.use
  const resolvedParams = React.use ? React.use(params as unknown as Promise<{ id: string }>) : (params as unknown as { id: string });
  const avaliacaoId = resolvedParams?.id ?? 'default';

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Etapa 1
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [escola, setEscola] = useState('');
  const [turma, setTurma] = useState('');
  const [professor, setProfessor] = useState('');
  const [serie, setSerie] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Etapa 2
  const [e2_aprendeu, setE2aprendeu] = useState(0);
  const [e2_material, setE2material] = useState(0);
  const [e2_facilidade, setE2facilidade] = useState(0);
  const [e2_criouIdeias, setE2criouIdeias] = useState(0);
  const [e2_quer, setE2quer] = useState(0);
  const [e2_modulo, setE2modulo] = useState('');

  // Etapa 3
  const [e3_iniciativa, setE3iniciativa] = useState(0);
  const [e3_criatividade, setE3criatividade] = useState(0);
  const [e3_resolucao, setE3resolucao] = useState(0);
  const [e3_equipe, setE3equipe] = useState(0);
  const [e3_comunicacao, setE3comunicacao] = useState(0);

  // Etapa 4
  const [e4_nps, setE4nps] = useState(-1);
  const [e4_gostou, setE4gostou] = useState('');
  const [e4_melhorar, setE4melhorar] = useState('');

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

  function handleSubmit() {
    const resposta: EstudanteResposta = {
      id: 'est' + Date.now(),
      avaliacaoId,
      submittedAt: new Date().toISOString(),
      nome, cidade, escola, turma, professor, serie,
      e2_aprendeu, e2_material, e2_facilidade, e2_criouIdeias, e2_quer_empreender: e2_quer, e2_moduloFavorito: e2_modulo,
      e3_iniciativa, e3_criatividade, e3_resolucao, e3_equipe, e3_comunicacao,
      e4_nps, e4_gostou, e4_melhorar,
    };
    const existing = storageGet<EstudanteResposta[]>('acelera_respostas_estudantes', []);
    storageSet('acelera_respostas_estudantes', [...existing, resposta]);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F48B1B] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14v8"/></svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Questionário do Estudante</p>
            <p className="text-sm font-bold text-gray-900">Acelera+ Escola de Empreendedorismo</p>
          </div>
        </div>
      </header>

      {/* Progress */}
      {!submitted && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              {STEP_LABELS.map((label, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= i ? 'bg-[#F48B1B] text-white' : 'bg-gray-200 text-gray-500'}`}>{i+1}</div>
                    <span className={`text-xs font-medium hidden sm:block ${step >= i ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-0.5 transition-colors ${step > i ? 'bg-[#F48B1B]' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-[#F48B1B] rounded-full transition-all" style={{ width: `${((step+1)/STEP_LABELS.length)*100}%` }} />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl space-y-5">

          {/* ── Etapa 1 – Identificação ──────────────────────────────────── */}
          {!submitted && step === 0 && (
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
                    <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm" value={serie} onChange={e => setSerie(e.target.value)}>
                      <option value="">Selecione</option>
                      {['4º ano','5º ano','6º ano','7º ano','8º ano','9º ano'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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
              <button onClick={next} className="mt-8 w-full bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                Continuar →
              </button>
            </div>
          )}

          {/* ── Etapa 2 – Avaliação do Módulo ───────────────────────────── */}
          {!submitted && step === 1 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">Como foi o programa?</h1>
                <p className="text-sm text-gray-500 mt-1">Avalie de 1 (ruim) a 5 (ótimo)</p>
              </div>
              <EmojiScale label="Você aprendeu algo útil para sua vida?" sublabels={['Não aprendi nada','Aprendi muito']} value={e2_aprendeu} onChange={setE2aprendeu} />
              <EmojiScale label="O material didático foi interessante?" sublabels={['Muito chato','Muito interessante']} value={e2_material} onChange={setE2material} />
              <EmojiScale label="As atividades foram fáceis de entender?" sublabels={['Muito difícil','Muito fácil']} value={e2_facilidade} onChange={setE2facilidade} />
              <EmojiScale label="Você conseguiu criar ideias de negócios?" sublabels={['Não consegui','Sim, várias ideias']} value={e2_criouIdeias} onChange={setE2criouIdeias} />
              <EmojiScale label="Você gostaria de empreender no futuro?" sublabels={['Não tenho interesse','Tenho muito interesse']} value={e2_quer} onChange={setE2quer} />

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="font-medium text-gray-900 text-sm mb-3">Qual módulo você mais gostou?</p>
                <div className="flex flex-wrap gap-2">
                  {['Negócios','Educação Financeira','Inovação','Comunicação'].map(m => (
                    <button key={m} type="button" onClick={() => setE2modulo(m)}
                      className={`px-4 py-2 rounded-xl text-sm border-2 font-medium transition-colors ${e2_modulo === m ? 'bg-[#F48B1B] text-white border-[#F48B1B]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">← Voltar</button>
                <button onClick={next} className="flex-1 bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors">Próximo →</button>
              </div>
            </div>
          )}

          {/* ── Etapa 3 – Competências ───────────────────────────────────── */}
          {!submitted && step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">Suas competências</h1>
                <p className="text-sm text-gray-500 mt-1">Como você se sente agora comparado ao início?</p>
              </div>
              <EmojiScale label="Tenho iniciativa para propor soluções" value={e3_iniciativa} onChange={setE3iniciativa} />
              <EmojiScale label="Consigo criar ideias novas e diferentes" value={e3_criatividade} onChange={setE3criatividade} />
              <EmojiScale label="Consigo resolver problemas com calma" value={e3_resolucao} onChange={setE3resolucao} />
              <EmojiScale label="Sei trabalhar bem em equipe" value={e3_equipe} onChange={setE3equipe} />
              <EmojiScale label="Consigo me comunicar melhor" value={e3_comunicacao} onChange={setE3comunicacao} />
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">← Voltar</button>
                <button onClick={next} className="flex-1 bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors">Próximo →</button>
              </div>
            </div>
          )}

          {/* ── Etapa 4 – NPS + Envio ────────────────────────────────────── */}
          {!submitted && step === 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">Última etapa!</h1>
                <p className="text-sm text-gray-500 mt-1">Sua opinião é muito importante para nós.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <p className="font-medium text-gray-900 text-sm">Em uma escala de 0 a 10, qual a probabilidade de você recomendar o programa para um amigo?</p>
                <NPSGrid value={e4_nps} onChange={setE4nps} />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0 = Muito improvável</span>
                  <span>10 = Com certeza!</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">O que você mais gostou do programa? (opcional)</label>
                  <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" rows={3}
                    value={e4_gostou} onChange={e => setE4gostou(e.target.value)} placeholder="Escreva aqui..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">O que poderia ser melhor? (opcional)</label>
                  <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30" rows={3}
                    value={e4_melhorar} onChange={e => setE4melhorar(e.target.value)} placeholder="Escreva aqui..." />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">← Voltar</button>
                <button onClick={handleSubmit} className="flex-1 bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                  Enviar avaliação ✓
                </button>
              </div>
            </div>
          )}

          {/* ── Confirmação ──────────────────────────────────────────────── */}
          {submitted && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Obrigado pela sua participação!</h1>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-2">Sua avaliação foi registrada com sucesso.</p>
              <p className="text-[#2E8C99] font-semibold text-lg">{nome}</p>
              <a href="/"
                className="mt-8 inline-block bg-[#F48B1B] hover:bg-[#D4720E] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
                Voltar ao início
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
