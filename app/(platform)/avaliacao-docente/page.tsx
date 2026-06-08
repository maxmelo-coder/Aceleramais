'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconTeacher, IconPlus, IconEye, IconEdit, IconX, IconSave } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { TeacherEvaluationForm } from '@/lib/types';

const tabLabels = ['Formulários', 'Respostas', 'Análise'] as const;
type Tab = typeof tabLabels[number];

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
  </svg>
);

// ─── Extended form type stored in localStorage ────────────────────────────────
interface DocenteFormData {
  id: string;
  createdAt: string;
  // Bloco 1 - Identificação
  nomeProfessor: string;
  escola: string;
  turmas: string;
  municipio: string;
  qtdEstudantes: string;
  concluiuModulo: string;
  moduloAtual: string;
  // Bloco 2 - Implementação
  b2_material: number;
  b2_atividades: number;
  b2_interesse: number;
  b2_tempo: number;
  b2_livro: number;
  // Bloco 3 - Aprendizagem
  b3_nivel: number;
  b3_necessidade: number;
  b3_planejamento: number;
  b3_ideias: number;
  // Bloco 4 - Competências
  b4_iniciativa: number;
  b4_criatividade: number;
  b4_resolucao: number;
  b4_lideranca: number;
  b4_equipe: number;
  b4_comunicacao: number;
  b4_planejamento: number;
  // Bloco 5 - Autoavaliação
  b5_dominio: number;
  b5_material: number;
  b5_organizacao: number;
  b5_conducao: number;
  b5_engajamento: number;
  b5_motivacao: number;
  b5_objetivos: number;
  // Bloco 6 - Monitoramento
  b6_aulasMinistradas: string;
  b6_atividadesPraticas: string;
  b6_apresentacaoProjetos: string;
  b6_recursosComplementares: string;
  b6_participacaoRegular: string;
  // Bloco 7 - Dificuldades
  b7_faltaTempo: boolean;
  b7_poucoInteresse: boolean;
  b7_dificuldadeConteudo: boolean;
  b7_faltaRecursos: boolean;
  b7_necessidadeFormacao: boolean;
  b7_ausenciaApoio: boolean;
  b7_cargaHoraria: boolean;
  b7_outros: boolean;
  b7_outrosTexto: string;
  // Bloco 8 - Impacto
  b8_interesse: number;
  b8_iniciativa: number;
  b8_vidaReal: number;
  b8_protagonismo: number;
  // Bloco 9 - NPS
  b9_nps: number;
  b9_justificativa: string;
  // Bloco 10 - Abertas
  b10_melhorias: string;
  b10_sugestoes: string;
  b10_aprendizagem: string;
  b10_melhorAtividade: string;
  // Índices calculados
  indiceImplementacao: number;
  indiceAprendizagem: number;
  indiceCompetencias: number;
  indiceAutoeficacia: number;
  indiceEngajamento: number;
}

const MODULOS = ['Módulo I – Negócios', 'Módulo II – Educação Financeira', 'Módulo III – Inovação', 'Módulo IV – Comunicação'];

function avg(...vals: number[]) {
  const valid = vals.filter(v => v > 0);
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function calcIndices(d: DocenteFormData) {
  const indiceImplementacao = Math.round(avg(d.b2_material, d.b2_atividades, d.b2_interesse, d.b2_tempo, d.b2_livro) * 20);
  const indiceAprendizagem = Math.round(avg(d.b3_nivel, d.b3_necessidade, d.b3_planejamento, d.b3_ideias) * 20);
  const indiceCompetencias = Math.round(avg(d.b4_iniciativa, d.b4_criatividade, d.b4_resolucao, d.b4_lideranca, d.b4_equipe, d.b4_comunicacao, d.b4_planejamento) * 20);
  const indiceAutoeficacia = Math.round(avg(d.b5_dominio, d.b5_material, d.b5_organizacao, d.b5_conducao, d.b5_engajamento, d.b5_motivacao, d.b5_objetivos) * 20);
  const indiceEngajamento = d.b6_participacaoRegular === 'Mais de 75%' ? 100 : d.b6_participacaoRegular === '50% a 75%' ? 62 : d.b6_participacaoRegular === 'Menos de 50%' ? 25 : 0;
  return { indiceImplementacao, indiceAprendizagem, indiceCompetencias, indiceAutoeficacia, indiceEngajamento };
}

function emptyDocente(): DocenteFormData {
  return {
    id: '', createdAt: '',
    nomeProfessor: '', escola: '', turmas: '', municipio: '',
    qtdEstudantes: '', concluiuModulo: '', moduloAtual: '',
    b2_material: 0, b2_atividades: 0, b2_interesse: 0, b2_tempo: 0, b2_livro: 0,
    b3_nivel: 0, b3_necessidade: 0, b3_planejamento: 0, b3_ideias: 0,
    b4_iniciativa: 0, b4_criatividade: 0, b4_resolucao: 0, b4_lideranca: 0, b4_equipe: 0, b4_comunicacao: 0, b4_planejamento: 0,
    b5_dominio: 0, b5_material: 0, b5_organizacao: 0, b5_conducao: 0, b5_engajamento: 0, b5_motivacao: 0, b5_objetivos: 0,
    b6_aulasMinistradas: '', b6_atividadesPraticas: '', b6_apresentacaoProjetos: '', b6_recursosComplementares: '', b6_participacaoRegular: '',
    b7_faltaTempo: false, b7_poucoInteresse: false, b7_dificuldadeConteudo: false, b7_faltaRecursos: false,
    b7_necessidadeFormacao: false, b7_ausenciaApoio: false, b7_cargaHoraria: false, b7_outros: false, b7_outrosTexto: '',
    b8_interesse: 0, b8_iniciativa: 0, b8_vidaReal: 0, b8_protagonismo: 0,
    b9_nps: -1, b9_justificativa: '',
    b10_melhorias: '', b10_sugestoes: '', b10_aprendizagem: '', b10_melhorAtividade: '',
    indiceImplementacao: 0, indiceAprendizagem: 0, indiceCompetencias: 0, indiceAutoeficacia: 0, indiceEngajamento: 0,
  };
}

// ─── Scale button (1-5) ───────────────────────────────────────────────────────
function ScaleButtons({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const colors = ['', 'bg-red-500 text-white', 'bg-orange-400 text-white', 'bg-yellow-400 text-gray-900', 'bg-lime-500 text-white', 'bg-green-600 text-white'];
  return (
    <div className="flex gap-1.5">
      {[1,2,3,4,5].map(v => (
        <button key={v} type="button" onClick={() => onChange(v)}
          className={`w-9 h-9 rounded-lg text-sm font-bold border-2 transition-all ${value === v ? colors[v] + ' border-transparent scale-110' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'}`}>
          {v}
        </button>
      ))}
    </div>
  );
}

// ─── Likert row ───────────────────────────────────────────────────────────────
function LikertRow({ label, field, data, onChange }: { label: string; field: string; data: DocenteFormData; onChange: (f: string, v: number) => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-700 flex-1">{label}</span>
      <ScaleButtons value={(data as any)[field]} onChange={v => onChange(field, v)} />
    </div>
  );
}

// ─── Radio group ─────────────────────────────────────────────────────────────
function RadioGroup({ label, field, options, data, onChange }: { label: string; field: string; options: string[]; data: DocenteFormData; onChange: (f: string, v: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => onChange(field, opt)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${(data as any)[field] === opt ? 'bg-[#F48B1B] text-white border-[#F48B1B]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Wizard steps UI ─────────────────────────────────────────────────────────
const WIZARD_STEPS = ['Identificação', 'Módulo', 'Aprendizagem', 'Competências', 'Autoavaliação', 'Monitoramento', 'Dificuldades', 'Impacto', 'NPS', 'Questões Abertas'];

export default function AvaliacaoDocentePage() {
  const { selected, all } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Formulários');
  const [forms, setForms] = useState<TeacherEvaluationForm[]>(() => storageGet('acelera_forms_docente_meta', []));
  const [respostas, setRespostas] = useState<DocenteFormData[]>(() => storageGet('acelera_forms_docente', []));
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [docente, setDocente] = useState<DocenteFormData>(emptyDocente());
  const [saved, setSaved] = useState(false);
  // legacy meta form modal
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [metaForm, setMetaForm] = useState({ id: '', title: '', municipioId: '', trimestre: '2º Trimestre', totalProfessores: 0, status: 'aberto' as 'aberto' | 'encerrado' });
  const [metaSaved, setMetaSaved] = useState(false);

  useEffect(() => { storageSet('acelera_forms_docente', respostas); }, [respostas]);
  useEffect(() => { storageSet('acelera_forms_docente_meta', forms); }, [forms]);

  function setF(field: string, value: string | number | boolean) {
    setDocente(prev => ({ ...prev, [field]: value }));
  }

  function validateStep(): boolean {
    if (wizardStep === 0 && !docente.nomeProfessor.trim()) {
      alert('Nome do professor é obrigatório.');
      return false;
    }
    return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    if (wizardStep < WIZARD_STEPS.length - 1) setWizardStep(s => s + 1);
  }

  function prevStep() {
    if (wizardStep > 0) setWizardStep(s => s - 1);
  }

  function handleSaveDocente() {
    const indices = calcIndices(docente);
    const final: DocenteFormData = { ...docente, ...indices, id: 'doc' + Date.now(), createdAt: new Date().toISOString() };
    setRespostas(prev => [...prev, final]);
    setSaved(true);
    setTimeout(() => { setShowWizard(false); setDocente(emptyDocente()); setWizardStep(0); setSaved(false); }, 1500);
  }

  // meta form handlers
  function handleSaveMeta() {
    if (!metaForm.title.trim()) { alert('Título obrigatório'); return; }
    const munName = all.find(m => m.id === metaForm.municipioId)?.name ?? selected.name;
    if (metaForm.id) {
      setForms(prev => prev.map(f => f.id === metaForm.id ? { ...f, ...metaForm, municipioName: munName } : f));
    } else {
      setForms(prev => [...prev, { ...metaForm, id: 'af' + Date.now(), municipioName: munName, respondentes: 0, participacaoPct: 0, mediasMaterial: 0, mediasFormacao: 0, mediasEngajamento: 0, createdAt: new Date().toISOString() }]);
    }
    setMetaSaved(true);
    setTimeout(() => { setShowMetaModal(false); setMetaSaved(false); }, 1200);
  }

  const progressPct = Math.round(((wizardStep + 1) / WIZARD_STEPS.length) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliação Docente</h1>
          <p className="text-sm text-gray-500 mt-0.5">Questionários diagnósticos dos professores</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setShowMetaModal(true); setMetaForm({ id: '', title: '', municipioId: '', trimestre: '2º Trimestre', totalProfessores: 0, status: 'aberto' }); setMetaSaved(false); }}
            className="flex items-center gap-2 border border-[#F48B1B] text-[#F48B1B] px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
            <IconPlus size={15} /> Novo formulário
          </button>
          <button onClick={() => { setShowWizard(true); setDocente(emptyDocente()); setWizardStep(0); setSaved(false); }}
            className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <IconPlus size={15} /> Responder avaliação
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabLabels.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Formulários' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Respostas" value={respostas.length} icon={<IconTeacher size={18} />} color="blue" />
            <StatCard title="Impl. Média" value={respostas.length > 0 ? Math.round(respostas.reduce((a,r) => a+r.indiceImplementacao,0)/respostas.length)+'%' : '—'} icon={<IconTeacher size={18} />} color="orange" />
            <StatCard title="Aprendiz. Média" value={respostas.length > 0 ? Math.round(respostas.reduce((a,r) => a+r.indiceAprendizagem,0)/respostas.length)+'%' : '—'} icon={<IconTeacher size={18} />} color="green" />
            <StatCard title="NPS Médio" value={respostas.length > 0 ? (respostas.reduce((a,r) => a+(r.b9_nps >= 0 ? r.b9_nps : 0),0)/respostas.length).toFixed(1) : '—'} icon={<IconTeacher size={18} />} color="purple" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Respostas dos Professores</h2>
            </div>
            {respostas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <IconTeacher size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhuma avaliação respondida ainda</p>
                <button onClick={() => { setShowWizard(true); setDocente(emptyDocente()); setWizardStep(0); }}
                  className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
                  <IconPlus size={15} /> Responder avaliação
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left font-medium">Professor</th>
                      <th className="px-6 py-3 text-left font-medium">Escola</th>
                      <th className="px-6 py-3 text-left font-medium">Módulo</th>
                      <th className="px-6 py-3 text-center font-medium">Implementação</th>
                      <th className="px-6 py-3 text-center font-medium">Aprendizagem</th>
                      <th className="px-6 py-3 text-center font-medium">NPS</th>
                      <th className="px-6 py-3 text-center font-medium">Data</th>
                      <th className="px-6 py-3 text-center font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {respostas.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{r.nomeProfessor || '—'}</td>
                        <td className="px-6 py-4 text-gray-600">{r.escola || '—'}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-[160px] truncate">{r.moduloAtual || '—'}</td>
                        <td className="px-6 py-4 text-center font-semibold text-blue-600">{r.indiceImplementacao}%</td>
                        <td className="px-6 py-4 text-center font-semibold text-green-600">{r.indiceAprendizagem}%</td>
                        <td className="px-6 py-4 text-center font-semibold">{r.b9_nps >= 0 ? r.b9_nps : '—'}</td>
                        <td className="px-6 py-4 text-center text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => { if(confirm('Excluir?')) setRespostas(prev => prev.filter(x => x.id !== r.id)); }}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><TrashIcon /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'Respostas' && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
          <IconTeacher size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            {respostas.length === 0 ? 'Nenhuma resposta registrada' : `${respostas.length} resposta(s) registrada(s)`}
          </p>
        </div>
      )}

      {tab === 'Análise' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Impl. do Módulo" value={respostas.length > 0 ? Math.round(respostas.reduce((a,r)=>a+r.indiceImplementacao,0)/respostas.length)+'%' : '—'} icon={<IconTeacher size={18} />} color="blue" />
            <StatCard title="Aprendizagem" value={respostas.length > 0 ? Math.round(respostas.reduce((a,r)=>a+r.indiceAprendizagem,0)/respostas.length)+'%' : '—'} icon={<IconTeacher size={18} />} color="green" />
            <StatCard title="Competências" value={respostas.length > 0 ? Math.round(respostas.reduce((a,r)=>a+r.indiceCompetencias,0)/respostas.length)+'%' : '—'} icon={<IconTeacher size={18} />} color="orange" />
            <StatCard title="Autoeficácia" value={respostas.length > 0 ? Math.round(respostas.reduce((a,r)=>a+r.indiceAutoeficacia,0)/respostas.length)+'%' : '—'} icon={<IconTeacher size={18} />} color="purple" />
          </div>
          {respostas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400 text-sm">Os gráficos de análise serão exibidos quando houver dados.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Wizard Modal ───────────────────────────────────────────────────── */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">ETAPA {wizardStep + 1} DE {WIZARD_STEPS.length}</p>
                <h3 className="font-semibold text-gray-900">{WIZARD_STEPS[wizardStep]}</h3>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-gray-600"><IconX size={20} /></button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100">
              <div className="h-full bg-[#F48B1B] transition-all duration-300" style={{ width: `${progressPct}%` }} />
            </div>

            {/* Step bubbles */}
            <div className="px-6 pt-4 flex gap-1.5 overflow-x-auto pb-2">
              {WIZARD_STEPS.map((label, i) => (
                <button key={i} onClick={() => setWizardStep(i)}
                  className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium transition-colors ${i === wizardStep ? 'bg-[#F48B1B] text-white' : i < wizardStep ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">

              {/* Bloco 1 – Identificação */}
              {wizardStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome do Professor *</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={docente.nomeProfessor} onChange={e => setF('nomeProfessor', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Escola</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={docente.escola} onChange={e => setF('escola', e.target.value)}>
                      <option value="">Selecione</option>
                      {selected.schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Turma(s)</label>
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={docente.turmas} onChange={e => setF('turmas', e.target.value)} placeholder="Ex: 5A, 7B" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Município</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={docente.municipio} onChange={e => setF('municipio', e.target.value)}>
                      <option value="">Selecione</option>
                      {all.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                  </div>
                  <RadioGroup label="Quantos estudantes estão matriculados?" field="qtdEstudantes" options={['Até 20', '21 a 35', '36 a 50', 'Mais de 50']} data={docente} onChange={setF} />
                  <RadioGroup label="Você concluiu integralmente o Módulo?" field="concluiuModulo" options={['Sim', 'Não', 'Em andamento']} data={docente} onChange={setF} />
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Qual módulo está executando?</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={docente.moduloAtual} onChange={e => setF('moduloAtual', e.target.value)}>
                      <option value="">Selecione</option>
                      {MODULOS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Bloco 2 – Implementação do Módulo */}
              {wizardStep === 1 && (
                <div>
                  <p className="text-xs text-gray-500 mb-4">1 = Discordo totalmente · 5 = Concordo totalmente</p>
                  <LikertRow label="O material didático apresentou conteúdos adequados" field="b2_material" data={docente} onChange={setF} />
                  <LikertRow label="As atividades propostas foram de fácil aplicação" field="b2_atividades" data={docente} onChange={setF} />
                  <LikertRow label="Os estudantes demonstraram interesse pelos conteúdos" field="b2_interesse" data={docente} onChange={setF} />
                  <LikertRow label="O tempo destinado ao módulo foi suficiente" field="b2_tempo" data={docente} onChange={setF} />
                  <LikertRow label="O livro contribuiu para a compreensão dos conceitos de negócios" field="b2_livro" data={docente} onChange={setF} />
                </div>
              )}

              {/* Bloco 3 – Aprendizagem */}
              {wizardStep === 2 && (
                <div>
                  <p className="text-xs text-gray-500 mb-4">1 = Baixíssimo · 5 = Excelente</p>
                  <LikertRow label="Nível de aprendizagem dos estudantes sobre negócios" field="b3_nivel" data={docente} onChange={setF} />
                  <LikertRow label="Compreenderam a diferença entre necessidade e oportunidade" field="b3_necessidade" data={docente} onChange={setF} />
                  <LikertRow label="Compreenderam a importância do planejamento" field="b3_planejamento" data={docente} onChange={setF} />
                  <LikertRow label="Conseguiram desenvolver ideias de negócios" field="b3_ideias" data={docente} onChange={setF} />
                </div>
              )}

              {/* Bloco 4 – Competências */}
              {wizardStep === 3 && (
                <div>
                  <p className="text-xs text-gray-500 mb-4">1 = Não Desenvolvida · 5 = Muito Desenvolvida</p>
                  <LikertRow label="Iniciativa" field="b4_iniciativa" data={docente} onChange={setF} />
                  <LikertRow label="Criatividade" field="b4_criatividade" data={docente} onChange={setF} />
                  <LikertRow label="Resolução de Problemas" field="b4_resolucao" data={docente} onChange={setF} />
                  <LikertRow label="Liderança" field="b4_lideranca" data={docente} onChange={setF} />
                  <LikertRow label="Trabalho em equipe" field="b4_equipe" data={docente} onChange={setF} />
                  <LikertRow label="Comunicação" field="b4_comunicacao" data={docente} onChange={setF} />
                  <LikertRow label="Planejamento" field="b4_planejamento" data={docente} onChange={setF} />
                </div>
              )}

              {/* Bloco 5 – Autoavaliação */}
              {wizardStep === 4 && (
                <div>
                  <p className="text-xs text-gray-500 mb-4">1 = Muito insatisfatório · 5 = Excelente</p>
                  <LikertRow label="Meu domínio sobre os conteúdos do módulo" field="b5_dominio" data={docente} onChange={setF} />
                  <LikertRow label="Minha utilização do material didático" field="b5_material" data={docente} onChange={setF} />
                  <LikertRow label="Minha organização e planejamento das aulas" field="b5_organizacao" data={docente} onChange={setF} />
                  <LikertRow label="Minha capacidade de conduzir as atividades" field="b5_conducao" data={docente} onChange={setF} />
                  <LikertRow label="Meu engajamento durante as aulas" field="b5_engajamento" data={docente} onChange={setF} />
                  <LikertRow label="Minha capacidade de motivar os estudantes" field="b5_motivacao" data={docente} onChange={setF} />
                  <LikertRow label="Considero que alcancei os objetivos do módulo" field="b5_objetivos" data={docente} onChange={setF} />
                </div>
              )}

              {/* Bloco 6 – Monitoramento */}
              {wizardStep === 5 && (
                <div className="space-y-5">
                  <RadioGroup label="Quantas aulas foram efetivamente ministradas?" field="b6_aulasMinistradas" options={['Até 4 aulas', '5 a 8 aulas', '9 a 12 aulas', 'Mais de 12 aulas']} data={docente} onChange={setF} />
                  <RadioGroup label="Foram desenvolvidas atividades práticas de negócios?" field="b6_atividadesPraticas" options={['Sim', 'Não', 'Parcialmente']} data={docente} onChange={setF} />
                  <RadioGroup label="Houve apresentação de projetos pelos estudantes?" field="b6_apresentacaoProjetos" options={['Sim', 'Não']} data={docente} onChange={setF} />
                  <RadioGroup label="Utilizou recursos complementares além do livro?" field="b6_recursosComplementares" options={['Sim', 'Não']} data={docente} onChange={setF} />
                  <RadioGroup label="Quantos estudantes participaram regularmente?" field="b6_participacaoRegular" options={['Menos de 50%', '50% a 75%', 'Mais de 75%']} data={docente} onChange={setF} />
                </div>
              )}

              {/* Bloco 7 – Dificuldades */}
              {wizardStep === 6 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Marque todas as dificuldades encontradas:</p>
                  {([
                    ['b7_faltaTempo', 'Falta de tempo'],
                    ['b7_poucoInteresse', 'Pouco interesse dos estudantes'],
                    ['b7_dificuldadeConteudo', 'Dificuldade de compreensão dos conteúdos'],
                    ['b7_faltaRecursos', 'Falta de recursos tecnológicos'],
                    ['b7_necessidadeFormacao', 'Necessidade de mais formação'],
                    ['b7_ausenciaApoio', 'Ausência de apoio familiar'],
                    ['b7_cargaHoraria', 'Carga horária insuficiente'],
                    ['b7_outros', 'Outros'],
                  ] as [keyof DocenteFormData, string][]).map(([field, label]) => (
                    <label key={field} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-[#F48B1B]"
                        checked={!!docente[field]}
                        onChange={e => setF(field, e.target.checked)} />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                  {docente.b7_outros && (
                    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-2"
                      placeholder="Descreva outras dificuldades..." value={docente.b7_outrosTexto} onChange={e => setF('b7_outrosTexto', e.target.value)} />
                  )}
                </div>
              )}

              {/* Bloco 8 – Impacto */}
              {wizardStep === 7 && (
                <div>
                  <p className="text-xs text-gray-500 mb-4">1 = Discordo totalmente · 5 = Concordo totalmente</p>
                  <LikertRow label="O módulo contribuiu para despertar o interesse pelo empreendedorismo" field="b8_interesse" data={docente} onChange={setF} />
                  <LikertRow label="Os estudantes passaram a demonstrar mais iniciativa" field="b8_iniciativa" data={docente} onChange={setF} />
                  <LikertRow label="Conseguem relacionar conteúdos com situações da vida real" field="b8_vidaReal" data={docente} onChange={setF} />
                  <LikertRow label="O módulo contribuiu para o desenvolvimento do protagonismo estudantil" field="b8_protagonismo" data={docente} onChange={setF} />
                </div>
              )}

              {/* Bloco 9 – NPS */}
              {wizardStep === 8 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700">Em uma escala de 0 a 10, qual a probabilidade de recomendar o programa Acelera+ a outros professores?</p>
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({length:11},(_,i)=>i).map(n => (
                      <button key={n} type="button" onClick={() => setF('b9_nps', n)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold border-2 transition-all ${docente.b9_nps === n
                          ? n <= 6 ? 'bg-red-500 text-white border-red-500' : n <= 8 ? 'bg-yellow-400 text-gray-900 border-yellow-400' : 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Justifique sua nota</label>
                    <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3} value={docente.b9_justificativa} onChange={e => setF('b9_justificativa', e.target.value)} />
                  </div>
                </div>
              )}

              {/* Bloco 10 – Questões Abertas */}
              {wizardStep === 9 && (
                <div className="space-y-4">
                  {([
                    ['b10_melhorias', 'O que deve ser melhorado no módulo?'],
                    ['b10_sugestoes', 'Sugestões para os próximos módulos'],
                    ['b10_aprendizagem', 'Qual foi a principal aprendizagem observada nos estudantes?'],
                    ['b10_melhorAtividade', 'Qual atividade teve melhor resultado?'],
                  ] as [string, string][]).map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                      <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={3}
                        value={(docente as any)[field]} onChange={e => setF(field, e.target.value)} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <button onClick={prevStep} disabled={wizardStep === 0}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-colors">← Anterior</button>
              {wizardStep < WIZARD_STEPS.length - 1 ? (
                <button onClick={nextStep}
                  className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-5 py-2 rounded-lg text-sm font-medium">
                  Próximo →
                </button>
              ) : (
                <button onClick={handleSaveDocente}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                  <IconSave size={15} />
                  {saved ? 'Salvo!' : 'Enviar avaliação'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Meta form modal */}
      {showMetaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Novo Formulário</h3>
              <button onClick={() => setShowMetaModal(false)} className="text-gray-400 hover:text-gray-600"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={metaForm.title} onChange={e => setMetaForm(f => ({...f, title: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Trimestre</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={metaForm.trimestre} onChange={e => setMetaForm(f => ({...f, trimestre: e.target.value}))}>
                    {['1º Trimestre','2º Trimestre','3º Trimestre','4º Trimestre'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total professores</label>
                  <input type="number" min={0} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    value={metaForm.totalProfessores} onChange={e => setMetaForm(f => ({...f, totalProfessores: parseInt(e.target.value)||0}))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={metaForm.status} onChange={e => setMetaForm(f => ({...f, status: e.target.value as 'aberto'|'encerrado'}))}>
                  <option value="aberto">Aberto</option>
                  <option value="encerrado">Encerrado</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowMetaModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
              <button onClick={handleSaveMeta}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white ${metaSaved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} /> {metaSaved ? 'Salvo!' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
