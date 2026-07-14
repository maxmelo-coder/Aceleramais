'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconTeacher, IconPlus, IconEye, IconEdit, IconX, IconSave } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { TeacherEvaluationForm } from '@/lib/types';

const tabLabels = ['Formulários', 'Respostas', 'Análise', 'Avaliação do Formador'] as const;
type Tab = typeof tabLabels[number];

const FORM_ID_FORMADOR = 'avaliacao-formador-2025';

// ─── Pie Chart ────────────────────────────────────────────────────────────────
interface PieSegment { label: string; value: number; color: string; }

function PieChart({ segments, size = 180 }: { segments: PieSegment[]; size?: number }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  if (total === 0) return <p className="text-xs text-gray-400 text-center py-4">Sem dados</p>;
  const cx = size / 2, cy = size / 2, r = size * 0.4;
  let angle = -Math.PI / 2;
  const paths = segments.map(seg => {
    const sweep = (seg.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return { ...seg, d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z` };
  });
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size}>
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="1.5" />)}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-600">{s.label}</span>
            <span className="text-xs font-semibold text-gray-800">{s.value}</span>
            <span className="text-xs text-gray-400">({total > 0 ? Math.round(s.value / total * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

// ID fixo da avaliação docente pública
const FORM_ID_PUBLICO = 'avaliacao-docente-2025';

export default function AvaliacaoDocentePage() {
  const { selected, all } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Formulários');
  const [forms, setForms] = useState<TeacherEvaluationForm[]>(() => storageGet('acelera_forms_docente_meta', []));
  const [respostas, setRespostas] = useState<DocenteFormData[]>(() => storageGet('acelera_forms_docente', []));
  const [respostasFormador, setRespostasFormador] = useState<any[]>(() => storageGet('acelera_forms_formador', []));
  const [syncedAt, setSyncedAt] = useState<Date>(new Date());
  const [syncing, setSyncing] = useState(false);
  const [viewRespostaFormador, setViewRespostaFormador] = useState<any | null>(null);

  const PERGUNTAS_ABERTAS = [
    { key: 'melhor',      label: 'O que o formador fez de melhor durante o treinamento?' },
    { key: 'melhorar',    label: 'O que poderia ser melhorado?' },
    { key: 'aprofundar',  label: 'Houve algum conteúdo que gostaria que fosse aprofundado?' },
    { key: 'comentarios', label: 'Comentários ou sugestões adicionais' },
  ];

  // Retorna headers com token de autenticação para chamadas GET protegidas
  function authHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('eleva_token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Merge ADITIVO — localStorage é o backup permanente, servidor é complementar.
  // NUNCA remove do local. Adiciona itens do servidor que não estão no local.
  // Reenvia ao servidor qualquer item local que não esteja lá (recupera após cold start).
  function mergeResponses(local: any[], server: any[]): any[] {
    const map = new Map<string, any>();
    local.forEach(r => map.set(r.id, r));        // local como base
    server.forEach(r => map.set(r.id, r));        // servidor complementa/atualiza
    return Array.from(map.values()).sort((a: any, b: any) =>
      new Date(b.submittedAt || b.createdAt || 0).getTime() -
      new Date(a.submittedAt || a.createdAt || 0).getTime()
    );
  }

  // Reenvia ao servidor itens locais que não estão no servidor (recupera após cold start do Lambda)
  async function reuploadMissing(local: any[], server: any[], endpoint: string) {
    const serverIds = new Set(server.map((r: any) => r.id));
    const missing = local.filter(r => !serverIds.has(r.id));
    for (const r of missing) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(r),
        });
      } catch { /* offline */ }
    }
  }

  // Na montagem: busca do servidor e faz merge ADITIVO com localStorage
  useEffect(() => {
    async function loadFromServer() {
      try {
        const [rfRes, rdRes] = await Promise.all([
          fetch('/api/formador', { headers: authHeaders() }).then(r => r.json()),
          fetch('/api/docente',  { headers: authHeaders() }).then(r => r.json()),
        ]);
        if (Array.isArray(rfRes)) {
          const local = storageGet<any[]>('acelera_forms_formador', []);
          const merged = mergeResponses(local, rfRes);
          setRespostasFormador(merged);
          storageSet('acelera_forms_formador', merged);
          // Reenvia ao servidor qualquer item perdido por cold start
          await reuploadMissing(local, rfRes, '/api/formador');
        }
        if (Array.isArray(rdRes)) {
          const local = storageGet<any[]>('acelera_forms_docente', []);
          const merged = mergeResponses(local, rdRes);
          setRespostas(merged);
          storageSet('acelera_forms_docente', merged);
          await reuploadMissing(local, rdRes, '/api/docente');
        }
        setSyncedAt(new Date());
      } catch {/* offline */}
    }
    loadFromServer();

    // Sincroniza quando outra aba grava no localStorage
    function onStorage(e: StorageEvent) {
      if (e.key === 'acelera_forms_formador') {
        setRespostasFormador(storageGet('acelera_forms_formador', []));
        setSyncedAt(new Date());
      }
      if (e.key === 'acelera_forms_docente') {
        setRespostas(storageGet('acelera_forms_docente', []));
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  async function syncFormador() {
    setSyncing(true);
    try {
      const [rfRes, rdRes] = await Promise.all([
        fetch('/api/formador', { headers: authHeaders() }).then(r => r.json()),
        fetch('/api/docente',  { headers: authHeaders() }).then(r => r.json()),
      ]);
      if (Array.isArray(rfRes)) {
        const local = storageGet<any[]>('acelera_forms_formador', []);
        const merged = mergeResponses(local, rfRes);
        setRespostasFormador(merged);
        storageSet('acelera_forms_formador', merged);
        await reuploadMissing(local, rfRes, '/api/formador');
      }
      if (Array.isArray(rdRes)) {
        const local = storageGet<any[]>('acelera_forms_docente', []);
        const merged = mergeResponses(local, rdRes);
        setRespostas(merged);
        storageSet('acelera_forms_docente', merged);
        await reuploadMissing(local, rdRes, '/api/docente');
      }
    } catch {/* offline */}
    setSyncedAt(new Date());
    setSyncing(false);
  }

  const [linkCopiado, setLinkCopiado] = useState(false);
  const [linkFormadorCopiado, setLinkFormadorCopiado] = useState(false);

  function copiarLink() {
    const url = `${window.location.origin}/avaliacao-docente/${FORM_ID_PUBLICO}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 2500);
    });
  }

  function copiarLinkFormador() {
    const url = `${window.location.origin}/avaliacao-formador/${FORM_ID_FORMADOR}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkFormadorCopiado(true);
      setTimeout(() => setLinkFormadorCopiado(false), 2500);
    });
  }

  function exportPdf() {
    const rs = respostas;
    if (rs.length === 0) { alert('Nenhum dado para exportar.'); return; }
    const total = rs.length;
    const npsValid = rs.filter(r => r.b9_nps >= 0);
    const avgNPS = npsValid.length > 0 ? (npsValid.reduce((a, r) => a + r.b9_nps, 0) / npsValid.length).toFixed(1) : '—';
    const avgImpl = Math.round(rs.reduce((a,r) => a+(r.indiceImplementacao||0),0)/total);
    const avgApre = Math.round(rs.reduce((a,r) => a+(r.indiceAprendizagem||0),0)/total);
    const avgComp = Math.round(rs.reduce((a,r) => a+(r.indiceCompetencias||0),0)/total);
    const avgAuto = Math.round(rs.reduce((a,r) => a+(r.indiceAutoeficacia||0),0)/total);
    const promotores = rs.filter(r => r.b9_nps >= 9).length;
    const neutros = rs.filter(r => r.b9_nps >= 7 && r.b9_nps <= 8).length;
    const detratores = rs.filter(r => r.b9_nps >= 0 && r.b9_nps <= 6).length;
    const difCount: Record<string, number> = {};
    rs.forEach(r => {
      const difs = [
        r.b7_faltaTempo && 'Falta de tempo',
        r.b7_poucoInteresse && 'Pouco interesse dos estudantes',
        r.b7_dificuldadeConteudo && 'Dificuldade de compreensão',
        r.b7_faltaRecursos && 'Falta de recursos',
        r.b7_necessidadeFormacao && 'Necessidade de formação',
        r.b7_ausenciaApoio && 'Ausência de apoio familiar',
        r.b7_cargaHoraria && 'Carga horária insuficiente',
        r.b7_outros && (r.b7_outrosTexto || 'Outros'),
      ].filter(Boolean) as string[];
      difs.forEach(d => { difCount[d] = (difCount[d]||0)+1; });
    });
    const topDif = Object.entries(difCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const byEscola: Record<string, number> = {};
    rs.forEach(r => { const k = r.escola||'Não informado'; byEscola[k]=(byEscola[k]||0)+1; });
    const byMod: Record<string, number> = {};
    rs.forEach(r => { const k = r.moduloAtual||'Não informado'; byMod[k]=(byMod[k]||0)+1; });
    const indices = [
      { label: 'Implementação do Módulo', value: avgImpl, color: '#2E8C99' },
      { label: 'Aprendizagem dos Estudantes', value: avgApre, color: '#16a34a' },
      { label: 'Competências Empreendedoras', value: avgComp, color: '#F48B1B' },
      { label: 'Autoeficácia Docente', value: avgAuto, color: '#9333ea' },
    ];
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Relatório Avaliação Docente — Acelera+</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; padding: 32px; color: #111827; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 22px; font-weight: 800; color: #2E8C99; margin: 0; }
  .subtitle { color: #6b7280; font-size: 13px; margin-top: 2px; }
  .meta { font-size: 11px; color: #9ca3af; margin-top: 4px; }
  .divider { border: none; border-top: 2px solid #e5e7eb; margin: 20px 0; }
  h2 { font-size: 15px; font-weight: 700; color: #374151; margin: 20px 0 12px; }
  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 8px; }
  .kpi { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center; background: #f9fafb; }
  .kpi-val { font-size: 30px; font-weight: 800; color: #2E8C99; line-height: 1; }
  .kpi-lbl { font-size: 11px; color: #6b7280; margin-top: 4px; font-weight: 500; }
  .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .bar-label { font-size: 12px; color: #374151; width: 220px; flex-shrink: 0; font-weight: 500; }
  .bar-bg { flex: 1; height: 22px; background: #f3f4f6; border-radius: 6px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 6px; }
  .bar-val { font-size: 12px; font-weight: 700; color: #374151; width: 50px; text-align: right; }
  .nps-row { display: flex; gap: 12px; }
  .nps-card { flex: 1; padding: 14px; border-radius: 10px; text-align: center; }
  .nps-card.pro { background: #dcfce7; border: 1px solid #86efac; }
  .nps-card.neu { background: #fef9c3; border: 1px solid #fde047; }
  .nps-card.det { background: #fee2e2; border: 1px solid #fca5a5; }
  .nps-big { font-size: 32px; font-weight: 800; }
  .nps-card.pro .nps-big { color: #16a34a; }
  .nps-card.neu .nps-big { color: #ca8a04; }
  .nps-card.det .nps-big { color: #dc2626; }
  .nps-lbl { font-size: 11px; font-weight: 600; margin-top: 2px; color: #374151; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
  th { background: #f3f4f6; padding: 10px 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 11px; }
  td { padding: 10px 12px; border-top: 1px solid #f3f4f6; color: #374151; }
  .footer { margin-top: 40px; font-size: 10px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; }
  @media print { body { padding: 16px; } }
</style></head><body>
<h1>Relatório de Avaliação Docente</h1>
<p class="subtitle">Programa Acelera+ — Questionário Diagnóstico de Professores</p>
<p class="meta">Gerado em ${new Date().toLocaleString('pt-BR')} · Total de respostas: ${total}</p>
<hr class="divider"/>
<h2>Indicadores Gerais</h2>
<div class="kpi-row">
  <div class="kpi"><div class="kpi-val">${total}</div><div class="kpi-lbl">Total de Respostas</div></div>
  <div class="kpi"><div class="kpi-val">${avgNPS}</div><div class="kpi-lbl">NPS Médio</div></div>
  <div class="kpi"><div class="kpi-val">${avgImpl}%</div><div class="kpi-lbl">Implementação</div></div>
  <div class="kpi"><div class="kpi-val">${avgAuto}%</div><div class="kpi-lbl">Autoeficácia</div></div>
</div>
<h2>Índices por Dimensão</h2>
${indices.map(idx => `<div class="bar-row"><span class="bar-label">${idx.label}</span><div class="bar-bg"><div class="bar-fill" style="width:${idx.value}%;background:${idx.color};"></div></div><span class="bar-val">${idx.value}%</span></div>`).join('')}
<h2>Distribuição NPS dos Professores</h2>
<div class="nps-row">
  <div class="nps-card pro"><div class="nps-big">${promotores}</div><div class="nps-lbl">Promotores (9–10)</div><div style="font-size:11px;color:#166534;margin-top:2px;">${total > 0 ? Math.round(promotores/total*100) : 0}%</div></div>
  <div class="nps-card neu"><div class="nps-big">${neutros}</div><div class="nps-lbl">Neutros (7–8)</div><div style="font-size:11px;color:#854d0e;margin-top:2px;">${total > 0 ? Math.round(neutros/total*100) : 0}%</div></div>
  <div class="nps-card det"><div class="nps-big">${detratores}</div><div class="nps-lbl">Detratores (0–6)</div><div style="font-size:11px;color:#991b1b;margin-top:2px;">${total > 0 ? Math.round(detratores/total*100) : 0}%</div></div>
</div>
${topDif.length > 0 ? `<h2>Dificuldades Mais Relatadas</h2>${topDif.map(([d,c]) => `<div class="bar-row"><span class="bar-label">${d}</span><div class="bar-bg"><div class="bar-fill" style="width:${Math.round(c/total*100)}%;background:#F48B1B;"></div></div><span class="bar-val">${c} (${Math.round(c/total*100)}%)</span></div>`).join('')}` : ''}
<h2>Respostas por Escola</h2>
<table><thead><tr><th>Escola</th><th>Respostas</th><th>% do Total</th></tr></thead><tbody>
${Object.entries(byEscola).sort((a,b)=>b[1]-a[1]).map(([escola,cnt]) => `<tr><td>${escola}</td><td>${cnt}</td><td>${Math.round(cnt/total*100)}%</td></tr>`).join('')}
</tbody></table>
<h2>Respostas por Módulo</h2>
<table><thead><tr><th>Módulo</th><th>Respostas</th><th>% do Total</th></tr></thead><tbody>
${Object.entries(byMod).sort((a,b)=>b[1]-a[1]).map(([mod,cnt]) => `<tr><td>${mod}</td><td>${cnt}</td><td>${Math.round(cnt/total*100)}%</td></tr>`).join('')}
</tbody></table>
<h2>Lista de Respondentes</h2>
<table><thead><tr><th>Professor</th><th>Escola</th><th>Município</th><th>Módulo</th><th>Impl.</th><th>Aprendiz.</th><th>NPS</th><th>Data</th></tr></thead><tbody>
${rs.map(r => `<tr><td>${r.nomeProfessor||'—'}</td><td>${r.escola||'—'}</td><td>${r.municipio||'—'}</td><td>${(r.moduloAtual||'—').replace('Módulo ','Mod. ')}</td><td>${r.indiceImplementacao||0}%</td><td>${r.indiceAprendizagem||0}%</td><td>${r.b9_nps>=0?r.b9_nps:'—'}</td><td>${r.createdAt?new Date(r.createdAt).toLocaleDateString('pt-BR'):'—'}</td></tr>`).join('')}
</tbody></table>
<div class="footer">Programa Acelera+ — Relatório gerado automaticamente · ${new Date().getFullYear()}</div>
</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }
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

      {/* Banner de link público — always visible */}
      <div className="bg-gradient-to-r from-[#2E8C99]/10 to-[#F48B1B]/10 border border-[#2E8C99]/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E8C99" strokeWidth="2" className="flex-shrink-0">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <span className="font-semibold text-gray-900 text-sm">Link para os professores responderem externamente</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Ativo</span>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">Avaliação Docente — Programa Acelera+</p>
            <p className="text-xs text-[#2E8C99] font-mono truncate mt-0.5">
              {typeof window !== 'undefined' ? `${window.location.origin}/avaliacao-docente/${FORM_ID_PUBLICO}` : `/avaliacao-docente/${FORM_ID_PUBLICO}`}
            </p>
          </div>
          <a href={`/avaliacao-docente/${FORM_ID_PUBLICO}`} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium transition-colors border border-gray-200">
            Abrir
          </a>
          <button onClick={copiarLink}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              linkCopiado ? 'bg-green-500 text-white' : 'bg-[#2E8C99] hover:bg-[#256e78] text-white'
            }`}>
            {linkCopiado ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>Copiado!</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar link</>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">Envie este link pelo WhatsApp, e-mail ou grupo de professores. Não precisa de login.</p>
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
                        <td className="px-6 py-4 text-center text-gray-300 text-xs">—</td>
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

      {tab === 'Análise' && (() => {
        const total = respostas.length;
        if (total === 0) return (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
            <IconTeacher size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500">Os gráficos de análise serão exibidos quando houver dados.</p>
          </div>
        );
        const npsValid = respostas.filter(r => r.b9_nps >= 0);
        const avgNPS = npsValid.length > 0 ? (npsValid.reduce((a,r) => a+r.b9_nps, 0)/npsValid.length).toFixed(1) : '—';
        const avgImpl = Math.round(respostas.reduce((a,r)=>a+r.indiceImplementacao,0)/total);
        const avgApre = Math.round(respostas.reduce((a,r)=>a+r.indiceAprendizagem,0)/total);
        const avgComp = Math.round(respostas.reduce((a,r)=>a+r.indiceCompetencias,0)/total);
        const avgAuto = Math.round(respostas.reduce((a,r)=>a+r.indiceAutoeficacia,0)/total);
        const avgEng  = Math.round(respostas.reduce((a,r)=>a+r.indiceEngajamento,0)/total);
        const promotores = respostas.filter(r => r.b9_nps >= 9).length;
        const neutros    = respostas.filter(r => r.b9_nps >= 7 && r.b9_nps <= 8).length;
        const detratores = respostas.filter(r => r.b9_nps >= 0 && r.b9_nps <= 6).length;
        // dificuldades
        const difCount: Record<string, number> = {};
        respostas.forEach(r => {
          ([
            [r.b7_faltaTempo, 'Falta de tempo'],
            [r.b7_poucoInteresse, 'Pouco interesse'],
            [r.b7_dificuldadeConteudo, 'Dificuldade de compreensão'],
            [r.b7_faltaRecursos, 'Falta de recursos'],
            [r.b7_necessidadeFormacao, 'Necessidade de formação'],
            [r.b7_ausenciaApoio, 'Ausência de apoio'],
            [r.b7_cargaHoraria, 'Carga horária insuficiente'],
            [r.b7_outros, r.b7_outrosTexto || 'Outros'],
          ] as [boolean, string][]).forEach(([flag, label]) => {
            if (flag) difCount[label] = (difCount[label]||0)+1;
          });
        });
        const topDif = Object.entries(difCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
        // por módulo
        const modCount: Record<string, number> = {};
        respostas.forEach(r => { const k = r.moduloAtual||'Não informado'; modCount[k]=(modCount[k]||0)+1; });
        const modColors = ['#2E8C99','#F48B1B','#16a34a','#9333ea','#3b82f6','#ef4444'];
        const modSegments = Object.entries(modCount).map(([label,value],i) => ({ label, value, color: modColors[i % modColors.length] }));
        // por escola
        const escolaCount: Record<string, number> = {};
        respostas.forEach(r => { const k = r.escola||'Não informado'; escolaCount[k]=(escolaCount[k]||0)+1; });
        const maxEscola = Math.max(...Object.values(escolaCount), 1);
        // bar indices
        const indices = [
          { label: 'Implementação do Módulo', value: avgImpl, color: '#2E8C99' },
          { label: 'Aprendizagem dos Estudantes', value: avgApre, color: '#16a34a' },
          { label: 'Competências Empreendedoras', value: avgComp, color: '#F48B1B' },
          { label: 'Autoeficácia Docente', value: avgAuto, color: '#9333ea' },
          { label: 'Engajamento dos Alunos', value: avgEng, color: '#3b82f6' },
        ];
        const maxDif = topDif.length > 0 ? topDif[0][1] : 1;

        return (
          <div className="space-y-6">
            {/* Header with export */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-lg">Análise das Avaliações Docentes</h2>
              <button onClick={exportPdf}
                className="flex items-center gap-2 bg-[#2E8C99] hover:bg-[#256e78] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Exportar PDF
              </button>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title="Total de Respostas" value={total} icon={<IconTeacher size={18} />} color="blue" />
              <StatCard title="NPS Médio" value={avgNPS} icon={<IconTeacher size={18} />} color="purple" />
              <StatCard title="Índice Implementação" value={`${avgImpl}%`} icon={<IconTeacher size={18} />} color="orange" />
              <StatCard title="Índice Autoeficácia" value={`${avgAuto}%`} icon={<IconTeacher size={18} />} color="green" />
            </div>

            {/* Índices bar chart + NPS pie */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Índices por Dimensão</h3>
                <div className="space-y-3">
                  {indices.map(idx => (
                    <div key={idx.label} className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{idx.label}</span>
                        <span className="font-bold" style={{ color: idx.color }}>{idx.value}%</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${idx.value}%`, backgroundColor: idx.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Distribuição NPS dos Professores</h3>
                <PieChart segments={[
                  { label: 'Promotores (9–10)', value: promotores, color: '#16a34a' },
                  { label: 'Neutros (7–8)', value: neutros, color: '#eab308' },
                  { label: 'Detratores (0–6)', value: detratores, color: '#ef4444' },
                ]} size={160} />
              </div>
            </div>

            {/* Módulos pie + Dificuldades bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Módulos Trabalhados</h3>
                {modSegments.length > 0
                  ? <PieChart segments={modSegments} size={160} />
                  : <p className="text-xs text-gray-400 text-center py-4">Sem dados</p>}
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Dificuldades Mais Relatadas</h3>
                {topDif.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">Nenhuma dificuldade relatada</p>
                ) : (
                  <div className="space-y-2.5">
                    {topDif.map(([label, count]) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="truncate max-w-[70%]">{label}</span>
                          <span className="font-semibold text-[#F48B1B]">{count} ({Math.round(count/total*100)}%)</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-[#F48B1B]" style={{ width: `${(count/maxDif)*100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Respostas por escola */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Distribuição por Escola</h3>
              <div className="space-y-2.5">
                {Object.entries(escolaCount).sort((a,b)=>b[1]-a[1]).map(([escola, count]) => (
                  <div key={escola} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="truncate max-w-[60%]">{escola}</span>
                      <span className="font-semibold text-[#2E8C99]">{count} ({Math.round(count/total*100)}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#2E8C99]" style={{ width: `${(count/maxEscola)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Avaliação do Formador ──────────────────────────────────────────── */}
      {tab === 'Avaliação do Formador' && (() => {
        const total = respostasFormador.length;
        const criterios = [
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

        function seedDemo() {
          const nomes = ['Ana Paula', 'Carlos Souza', 'Maria Lima', 'João Pedro', 'Fernanda Costa', 'Rafael Alves', 'Juliana Neves', 'Marcos Vieira'];
          const escolas = ['E.M. João Paulo II', 'E.M. Monteiro Lobato', 'E.E. Dom Bosco', 'EMEF Santos Dumont'];
          const gerais = ['Excelente','Muito Bom','Muito Bom','Bom','Excelente','Muito Bom','Excelente','Bom'];
          const recomendas = ['Sim','Sim','Sim','Talvez','Sim','Sim','Sim','Sim'];
          const notas = [
            [5,5,4,5,5,5,4,5,5,5],
            [4,4,5,4,4,5,4,4,5,4],
            [5,5,5,5,5,5,5,5,5,5],
            [3,4,4,3,4,3,3,4,4,3],
            [5,4,5,5,5,4,5,5,5,5],
            [4,5,4,4,5,5,4,4,5,4],
            [5,5,5,5,5,5,5,5,5,5],
            [4,3,4,4,3,4,3,4,4,4],
          ];
          const demo = nomes.map((n, i) => ({
            id: 'demo_' + i,
            nomeFormador: 'Prof. Ricardo Melo',
            escola: escolas[i % escolas.length],
            municipio: 'São Paulo',
            dataFormacao: `2025-07-0${(i % 9) + 1}`,
            criterios: notas[i],
            avaliacaoGeral: gerais[i],
            recomendaria: recomendas[i],
            melhor: 'Excelente didática e domínio do conteúdo.',
            melhorar: 'Poderia incluir mais exercícios práticos.',
            aprofundar: 'Gestão financeira básica.',
            comentarios: 'Treinamento muito produtivo!',
            submittedAt: new Date().toISOString(),
            _isDemo: true,
          }));
          setRespostasFormador(demo);
        }

        function limparDemo() {
          setRespostasFormador([]);
        }

        const avgCriterio = (idx: number) => total === 0 ? 0 :
          +(respostasFormador.reduce((a: number, r: any) => a + (r.criterios?.[idx] ?? 0), 0) / total).toFixed(1);
        const geralCount: Record<string, number> = {};
        respostasFormador.forEach((r: any) => { if (r.avaliacaoGeral) geralCount[r.avaliacaoGeral] = (geralCount[r.avaliacaoGeral]||0)+1; });
        const recomendaCount: Record<string, number> = {};
        respostasFormador.forEach((r: any) => { if (r.recomendaria) recomendaCount[r.recomendaria] = (recomendaCount[r.recomendaria]||0)+1; });
        const hasDemo = respostasFormador.some((r: any) => r._isDemo);
        return (
          <div className="space-y-6">
            {/* Link Banner */}
            <div className="bg-gradient-to-r from-[#F48B1B]/10 to-[#2E8C99]/10 border border-[#F48B1B]/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F48B1B" strokeWidth="2" className="flex-shrink-0">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span className="font-semibold text-gray-900 text-sm">Link para avaliação do formador (participantes)</span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Ativo</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">Avaliação de Treinamento — Programa Acelera+</p>
                  <p className="text-xs text-[#F48B1B] font-mono truncate mt-0.5">
                    {typeof window !== 'undefined' ? `${window.location.origin}/avaliacao-formador/${FORM_ID_FORMADOR}` : `/avaliacao-formador/${FORM_ID_FORMADOR}`}
                  </p>
                </div>
                <a href={`/avaliacao-formador/${FORM_ID_FORMADOR}`} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium transition-colors border border-gray-200">
                  Abrir
                </a>
                <button onClick={copiarLinkFormador}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    linkFormadorCopiado ? 'bg-green-500 text-white' : 'bg-[#F48B1B] hover:bg-[#d4720e] text-white'
                  }`}>
                  {linkFormadorCopiado ? (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>Copiado!</>
                  ) : (
                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar link</>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">Compartilhe com os participantes após o treinamento. Não precisa de login.</p>
            </div>

            {/* Demo / clear banner */}
            {total === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">Nenhuma resposta ainda</p>
                  <p className="text-xs text-amber-700 mt-0.5">Compartilhe o link com os participantes ou visualize como o painel ficará com dados.</p>
                </div>
                <button onClick={seedDemo}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Visualizar com dados demo
                </button>
              </div>
            ) : hasDemo && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-xs text-blue-700 flex-1">Você está visualizando <strong>dados de demonstração</strong>. As respostas reais dos participantes aparecerão aqui automaticamente.</p>
                <button onClick={limparDemo} className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline flex-shrink-0">Limpar demo</button>
              </div>
            )}

            {/* Sync bar */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Última sincronização: {syncedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                <span className="text-gray-400">· {total} resposta{total !== 1 ? 's' : ''}</span>
              </div>
              <button onClick={syncFormador} disabled={syncing}
                className={`flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${syncing ? 'bg-gray-400' : 'bg-[#2E8C99] hover:bg-[#256e78]'}`}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className={syncing ? 'animate-spin' : ''}>
                  <polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                {syncing ? 'Sincronizando...' : 'Atualizar respostas'}
              </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard title="Respostas" value={total} icon={<IconTeacher size={18} />} color="orange" />
              <StatCard title="Média Geral" value={total === 0 ? '—' : (criterios.map((_,i) => avgCriterio(i)).reduce((a,b) => a+b, 0) / criterios.length).toFixed(1) + '/5'} icon={<IconTeacher size={18} />} color="blue" />
              <StatCard title="Recomendam" value={total === 0 ? '—' : `${Math.round(((recomendaCount['Sim']||0)/total)*100)}%`} icon={<IconTeacher size={18} />} color="green" />
              <StatCard title="Excelente/MB" value={total === 0 ? '—' : `${Math.round((((geralCount['Excelente']||0)+(geralCount['Muito Bom']||0))/total)*100)}%`} icon={<IconTeacher size={18} />} color="purple" />
            </div>

            {/* Critérios */}
            {total > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Média por Critério (escala 1–5)</h3>
                <div className="space-y-3">
                  {criterios.map((c, i) => {
                    const avg = avgCriterio(i);
                    const pct = (avg / 5) * 100;
                    const color = avg >= 4 ? '#059669' : avg >= 3 ? '#F48B1B' : '#E30613';
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span className="truncate max-w-[80%]">{c}</span>
                          <span className="font-bold ml-2" style={{ color }}>{avg}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Avaliação Geral + Recomendação */}
            {total > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Avaliação Geral</h3>
                  {['Excelente','Muito Bom','Bom','Regular','Insatisfatório'].map(op => (
                    <div key={op} className="flex items-center gap-2 mb-2">
                      <div className="h-5 rounded" style={{ width: `${total > 0 ? Math.round(((geralCount[op]||0)/total)*80) : 0}px`, minWidth: 4, background: '#2E8C99' }} />
                      <span className="text-xs text-gray-700">{op}</span>
                      <span className="text-xs text-gray-400 ml-auto">{geralCount[op]||0} ({total>0?Math.round(((geralCount[op]||0)/total)*100):0}%)</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Recomendaria o formador?</h3>
                  {['Sim','Talvez','Não'].map((op, idx) => {
                    const colors = ['#059669','#F48B1B','#E30613'];
                    return (
                      <div key={op} className="flex items-center gap-2 mb-2">
                        <div className="h-5 rounded" style={{ width: `${total > 0 ? Math.round(((recomendaCount[op]||0)/total)*80) : 0}px`, minWidth: 4, background: colors[idx] }} />
                        <span className="text-xs text-gray-700">{op}</span>
                        <span className="text-xs text-gray-400 ml-auto">{recomendaCount[op]||0} ({total>0?Math.round(((recomendaCount[op]||0)/total)*100):0}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tabela de respostas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Respostas ({total})</h3>
                {total > 0 && (
                  <button onClick={() => {
                    const esc = (s: string) => `"${(s||'').replace(/"/g,'""')}"`;
                    const header = [
                      'Formador','Escola','Município','Data',
                      // Notas por critério
                      'C1-Domínio conteúdo','C2-Clareza','C3-Comunicação','C4-Respondeu dúvidas',
                      'C5-Preparo','C6-Exemplos práticos','C7-Estimulou participação',
                      'C8-Engajamento','C9-Respeito','C10-Gestão do tempo',
                      'Nota Média','Avaliação Geral','Recomenda',
                      // Perguntas abertas
                      'P1-O que o formador fez de melhor?',
                      'P2-O que poderia ser melhorado?',
                      'P3-Conteúdo para aprofundar?',
                      'P4-Comentários adicionais',
                    ].join(',');
                    const rows = [header,
                      ...respostasFormador.map((r: any) => {
                        const notas = criterios.map((_,i)=>r.criterios?.[i]??0);
                        const media = (notas.reduce((a:number,b:number)=>a+b,0)/notas.length).toFixed(1);
                        return [
                          esc(r.nomeFormador), esc(r.escola), esc(r.municipio), esc(r.dataFormacao),
                          ...notas,
                          media, esc(r.avaliacaoGeral), esc(r.recomendaria),
                          esc(r.melhor), esc(r.melhorar), esc(r.aprofundar), esc(r.comentarios),
                        ].join(',');
                      })];
                    const blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                    a.download = `avaliacao_formador_${new Date().toISOString().slice(0,10)}.csv`; a.click();
                  }} className="flex items-center gap-1.5 text-xs font-medium text-[#2E8C99] hover:text-[#226e78] border border-[#2E8C99]/30 px-3 py-1.5 rounded-lg transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Exportar CSV
                  </button>
                )}
              </div>
              {total === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <IconTeacher size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Nenhuma resposta registrada</p>
                  <p className="text-gray-400 text-sm mt-1">Compartilhe o link acima com os participantes do treinamento</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Formador</th>
                        <th className="px-4 py-3 text-left">Escola</th>
                        <th className="px-4 py-3 text-left">Data</th>
                        <th className="px-4 py-3 text-center">Nota Média</th>
                        <th className="px-4 py-3 text-center">Avaliação Geral</th>
                        <th className="px-4 py-3 text-center">Recomenda</th>
                        <th className="px-4 py-3 text-center">Respostas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {respostasFormador.map((r: any) => {
                        const media = (criterios.map((_,i)=>r.criterios?.[i]??0).reduce((a:number,b:number)=>a+b,0)/criterios.length);
                        const cor = media >= 4 ? 'green' : media >= 3 ? 'orange' : 'red';
                        return (
                          <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900">{r.nomeFormador||'—'}</td>
                            <td className="px-4 py-3 text-gray-600">{r.escola||'—'}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{r.dataFormacao||'—'}</td>
                            <td className="px-4 py-3 text-center"><Badge label={media.toFixed(1)+'/5'} variant={cor as any} /></td>
                            <td className="px-4 py-3 text-center text-xs text-gray-700">{r.avaliacaoGeral||'—'}</td>
                            <td className="px-4 py-3 text-center"><Badge label={r.recomendaria||'—'} variant={r.recomendaria==='Sim'?'green':r.recomendaria==='Não'?'red':'orange'} /></td>
                            <td className="px-4 py-3 text-center">
                              <button onClick={() => setViewRespostaFormador(r)}
                                title="Ver respostas abertas"
                                className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── Respostas Abertas consolidadas ──────────────────────── */}
            {total > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Respostas Abertas — Todas as Contribuições</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Todas as respostas discursivas dos participantes, por pergunta</p>
                </div>
                <div className="p-6 space-y-6">
                  {PERGUNTAS_ABERTAS.map(({ key, label }, qi) => {
                    const resps = respostasFormador
                      .map((r: any) => ({ texto: r[key], autor: r.escola || r.nomeFormador || '—', data: r.dataFormacao }))
                      .filter((x: any) => x.texto && x.texto.trim());
                    return (
                      <div key={key}>
                        <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#2E8C99]/10 text-[#2E8C99] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {qi + 1}
                          </span>
                          {label}
                          <span className="ml-auto text-xs text-gray-400 font-normal">{resps.length} resposta{resps.length !== 1 ? 's' : ''}</span>
                        </p>
                        {resps.length === 0 ? (
                          <p className="text-xs text-gray-400 italic pl-7">Nenhuma resposta para esta pergunta.</p>
                        ) : (
                          <div className="space-y-2 pl-7">
                            {resps.map((resp: any, i: number) => (
                              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                                <p className="text-sm text-gray-800 leading-relaxed">"{resp.texto}"</p>
                                <p className="text-[11px] text-gray-400 mt-1.5">{resp.autor}{resp.data ? ` · ${resp.data}` : ''}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Modal: Respostas abertas de um participante ────────────────────── */}
      {viewRespostaFormador && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setViewRespostaFormador(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Respostas Abertas</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {viewRespostaFormador.escola || '—'} · {viewRespostaFormador.dataFormacao || '—'}
                </p>
              </div>
              <button onClick={() => setViewRespostaFormador(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <IconX size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-5">
              {/* Identificação */}
              <div className="flex gap-3 flex-wrap">
                <span className="bg-[#2E8C99]/10 text-[#2E8C99] text-xs font-semibold px-3 py-1 rounded-full">
                  Formador: {viewRespostaFormador.nomeFormador || '—'}
                </span>
                <span className="bg-[#F48B1B]/10 text-[#F48B1B] text-xs font-semibold px-3 py-1 rounded-full">
                  {viewRespostaFormador.avaliacaoGeral || '—'}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  viewRespostaFormador.recomendaria === 'Sim' ? 'bg-green-100 text-green-700' :
                  viewRespostaFormador.recomendaria === 'Não' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  Recomenda: {viewRespostaFormador.recomendaria || '—'}
                </span>
              </div>
              {/* Perguntas abertas */}
              {PERGUNTAS_ABERTAS.map(({ key, label }, i) => (
                <div key={key}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    {i + 1}. {label}
                  </p>
                  {viewRespostaFormador[key] ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                      <p className="text-sm text-gray-800 leading-relaxed">{viewRespostaFormador[key]}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Não respondido.</p>
                  )}
                </div>
              ))}
              {/* Critérios detalhados */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notas por critério</p>
                <div className="space-y-1.5">
                  {[
                    'Domínio do conteúdo','Clareza na explicação','Comunicação acessível',
                    'Respondeu dúvidas','Preparo e organização','Exemplos práticos',
                    'Estimulou participação','Engajamento','Respeito e cordialidade','Gestão do tempo',
                  ].map((c, i) => {
                    const nota = viewRespostaFormador.criterios?.[i] ?? 0;
                    const cor = nota >= 4 ? '#059669' : nota >= 3 ? '#F48B1B' : '#E30613';
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 flex-1 truncate">{c}</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(n => (
                            <div key={n} className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center"
                              style={{ background: n <= nota ? cor : '#f3f4f6', color: n <= nota ? 'white' : '#9ca3af' }}>
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={() => setViewRespostaFormador(null)}
                className="w-full py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                Fechar
              </button>
            </div>
          </div>
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
