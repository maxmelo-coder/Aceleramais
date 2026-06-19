'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconAction, IconPlus, IconEdit, IconEye, IconTrash, IconX, IconSave } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import { storageGet, storageSet } from '@/lib/storage';
import type { ActionPlan, ActionStatus, ActionPriority } from '@/lib/types';

const PRIORIDADE_CONFIG: Record<ActionPriority, { label: string; variant: 'gray' | 'blue' | 'orange' | 'red' }> = {
  baixa:   { label: 'Baixa',   variant: 'gray'   },
  media:   { label: 'Média',   variant: 'blue'   },
  alta:    { label: 'Alta',    variant: 'orange' },
  critica: { label: 'Crítica', variant: 'red'    },
};

const STATUS_CONFIG: Record<ActionStatus, { label: string; variant: 'yellow' | 'blue' | 'green' | 'red' }> = {
  pendente:     { label: 'Pendente',     variant: 'yellow' },
  em_andamento: { label: 'Em andamento', variant: 'blue'   },
  concluido:    { label: 'Concluído',    variant: 'green'  },
  cancelado:    { label: 'Cancelado',    variant: 'red'    },
};

function emptyForm() {
  return {
    id: '',
    title: '',
    description: '',
    municipioId: '',
    municipioName: '',
    schoolId: '',
    responsible: '',
    deadline: '',
    prioridade: 'media' as ActionPriority,
    status: 'pendente' as ActionStatus,
    problema: '',
    origem: '',
    observations: '',
  };
}

export default function PlanoAcaoPage() {
  const { selected, all } = useMunicipio();
  const [filterMunicipio, setFilterMunicipio] = useState('todos');
  const [filterPrioridade, setFilterPrioridade] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [acoes, setAcoes] = useState<ActionPlan[]>(() => storageGet('acelera_planos', []));
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { storageSet('acelera_planos', acoes); }, [acoes]);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = acoes.filter(a => {
    if (filterMunicipio !== 'todos' && a.municipioId !== filterMunicipio) return false;
    if (filterPrioridade !== 'todos' && a.prioridade !== filterPrioridade) return false;
    if (filterStatus !== 'todos' && a.status !== filterStatus) return false;
    return true;
  });

  const pendentes    = acoes.filter(a => a.status === 'pendente').length;
  const emAndamento  = acoes.filter(a => a.status === 'em_andamento').length;
  const atrasadas    = acoes.filter(a => {
    if (!a.deadline) return false;
    return new Date(a.deadline) < new Date() && a.status !== 'concluido';
  }).length;

  function openNew() { setForm(emptyForm()); setSaved(false); setShowModal(true); }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.title.trim()) { alert('Título é obrigatório.'); return; }
    const munName = all.find(m => m.id === form.municipioId)?.name ?? '';
    setAcoes(prev => [...prev, {
      id: 'ac' + Date.now(),
      title: form.title,
      description: form.description,
      municipioId: form.municipioId || undefined,
      municipioName: munName || undefined,
      schoolId: form.schoolId || undefined,
      responsible: form.responsible,
      deadline: form.deadline,
      prioridade: form.prioridade,
      status: form.status,
      problema: form.problema,
      origem: form.origem || undefined,
      observations: form.observations || undefined,
      createdAt: new Date().toISOString(),
    }]);
    setSaved(true);
    setTimeout(closeModal, 1200);
  }

  function handleDelete(id: string) {
    setAcoes(prev => prev.filter(a => a.id !== id));
    setDeleteId(null);
  }

  function setField(key: string, value: string) {
    if (!form) return;
    setForm({ ...form, [key]: value } as typeof form);
  }

  function gerarPlanosDocentes() {
    const respostas = storageGet<any[]>('acelera_forms_docente', []);
    if (respostas.length === 0) { alert('Nenhum dado de avaliação docente disponível.'); return; }
    const total = respostas.length;
    const avgImpl = Math.round(respostas.reduce((a,r) => a+(r.indiceImplementacao||0),0)/total);
    const avgApre = Math.round(respostas.reduce((a,r) => a+(r.indiceAprendizagem||0),0)/total);
    const difCount: Record<string, number> = {};
    respostas.forEach(r => {
      ([
        [r.b7_faltaTempo, 'Falta de tempo'],
        [r.b7_poucoInteresse, 'Pouco interesse dos estudantes'],
        [r.b7_dificuldadeConteudo, 'Dificuldade de compreensão dos conteúdos'],
        [r.b7_faltaRecursos, 'Falta de recursos tecnológicos'],
        [r.b7_necessidadeFormacao, 'Necessidade de mais formação'],
        [r.b7_ausenciaApoio, 'Ausência de apoio familiar'],
        [r.b7_cargaHoraria, 'Carga horária insuficiente'],
        [r.b7_outros, r.b7_outrosTexto || 'Outros'],
      ] as [boolean, string][]).forEach(([flag, label]) => {
        if (flag) difCount[label] = (difCount[label]||0)+1;
      });
    });
    const topDif = Object.entries(difCount).sort((a,b)=>b[1]-a[1])[0];
    const now = Date.now();
    const newPlanos: ActionPlan[] = [];
    const deadline3m = new Date(new Date().setMonth(new Date().getMonth()+3)).toISOString().split('T')[0];
    const deadline1m = new Date(new Date().setMonth(new Date().getMonth()+1)).toISOString().split('T')[0];
    if (avgImpl < 70) {
      newPlanos.push({
        id: 'pa_impl_' + now,
        title: 'Plano de melhoria da implementação do módulo',
        description: 'Ações para elevar o índice de implementação abaixo da meta de 70%.',
        responsible: 'Coordenação Pedagógica',
        deadline: deadline3m,
        prioridade: avgImpl < 50 ? 'critica' : 'alta',
        status: 'em_andamento',
        problema: `Índice de implementação médio em ${avgImpl}% — abaixo da meta de 70%.`,
        origem: 'avaliacao_docente',
        observations: `Baseado em ${total} avaliação(ões) docente(s). Índice atual: ${avgImpl}%.`,
        createdAt: new Date().toISOString(),
      });
    }
    if (avgApre < 65) {
      newPlanos.push({
        id: 'pa_apre_' + (now+1),
        title: 'Reforço pedagógico para aprendizagem dos estudantes',
        description: 'Intervenções para melhorar a absorção do conteúdo empreendedor pelos estudantes.',
        responsible: 'Formadores e Professores',
        deadline: deadline3m,
        prioridade: 'alta',
        status: 'pendente',
        problema: `Índice de aprendizagem em ${avgApre}% — professores relatam dificuldade de absorção do conteúdo.`,
        origem: 'avaliacao_docente',
        observations: `Índice de aprendizagem atual: ${avgApre}%.`,
        createdAt: new Date().toISOString(),
      });
    }
    if (topDif && topDif[1] >= Math.ceil(total * 0.3)) {
      newPlanos.push({
        id: 'pa_dif_' + (now+2),
        title: `Resolver: "${topDif[0]}"`,
        description: `Dificuldade mais relatada pelos professores (${topDif[1]} de ${total} respondentes).`,
        responsible: 'Equipe Acelera+',
        deadline: deadline1m,
        prioridade: topDif[1] >= total * 0.5 ? 'critica' : 'media',
        status: 'pendente',
        problema: `${topDif[1]} professor(es) (${Math.round(topDif[1]/total*100)}%) relataram: "${topDif[0]}".`,
        origem: 'avaliacao_docente',
        observations: 'Dificuldade identificada nas avaliações docentes.',
        createdAt: new Date().toISOString(),
      });
    }
    if (newPlanos.length === 0) { alert('Todos os índices estão dentro da meta! Nenhum plano de ação necessário.'); return; }
    setAcoes(prev => [...prev.filter(p => p.origem !== 'avaliacao_docente'), ...newPlanos]);
    alert(`${newPlanos.length} plano(s) de ação gerado(s)!`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plano de Ação</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registro e acompanhamento das ações corretivas e preventivas</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={gerarPlanosDocentes}
            className="flex items-center gap-2 border border-[#2E8C99] text-[#2E8C99] hover:bg-[#2E8C99]/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Gerar Planos dos Docentes
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <IconPlus size={15} /> Nova ação
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total ações"   value={acoes.length}  icon={<IconAction size={18} />} color="blue" />
        <StatCard title="Pendentes"     value={pendentes}     icon={<IconAction size={18} />} color="orange" />
        <StatCard title="Em andamento"  value={emAndamento}   icon={<IconAction size={18} />} color="orange" />
        <StatCard title="Atrasadas"     value={atrasadas}     icon={<IconAction size={18} />} color="red" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterMunicipio} onChange={e => setFilterMunicipio(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os municípios</option>
          {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <select value={filterPrioridade} onChange={e => setFilterPrioridade(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todas as prioridades</option>
          {(Object.keys(PRIORIDADE_CONFIG) as ActionPriority[]).map(p => (
            <option key={p} value={p}>{PRIORIDADE_CONFIG[p].label}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
          <option value="todos">Todos os status</option>
          {(Object.keys(STATUS_CONFIG) as ActionStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Ações cadastradas</h2>
          <span className="text-sm text-gray-400">{filtered.length} ação{filtered.length !== 1 ? 'ões' : ''}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconAction size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma ação cadastrada ainda</p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">Registre ações corretivas e preventivas para acompanhar a execução do projeto.</p>
            <button onClick={openNew}
              className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
              <IconPlus size={15} /> Nova ação
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-medium">Título</th>
                  <th className="px-6 py-3 text-left font-medium">Município</th>
                  <th className="px-6 py-3 text-left font-medium">Responsável</th>
                  <th className="px-6 py-3 text-left font-medium">Prazo</th>
                  <th className="px-6 py-3 text-center font-medium">Prioridade</th>
                  <th className="px-6 py-3 text-center font-medium">Status</th>
                  <th className="px-6 py-3 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(a => {
                  const pc = PRIORIDADE_CONFIG[a.prioridade];
                  const sc = STATUS_CONFIG[a.status];
                  const isOverdue = a.deadline && new Date(a.deadline) < new Date() && a.status !== 'concluido';
                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{a.title}</td>
                      <td className="px-6 py-4 text-gray-600">{a.municipioName || '—'}</td>
                      <td className="px-6 py-4 text-gray-600">{a.responsible || '—'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                          {a.deadline ? new Date(a.deadline).toLocaleDateString('pt-BR') : '—'}
                          {isOverdue && ' ⚠'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center"><Badge label={pc.label} variant={pc.variant} /></td>
                      <td className="px-6 py-4 text-center"><Badge label={sc.label} variant={sc.variant} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors"><IconEdit size={14} /></button>
                          <button className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors"><IconEye size={14} /></button>
                          <button onClick={() => setDeleteId(a.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"><IconTrash size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <p className="font-semibold text-gray-900 text-lg mb-2">Excluir ação?</p>
            <p className="text-gray-500 text-sm mb-6">Esta operação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Nova Ação</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Título da ação" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Problema identificado</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  value={form.problema} onChange={e => setField('problema', e.target.value)} placeholder="Descreva o problema que esta ação resolve..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Município</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.municipioId} onChange={e => setField('municipioId', e.target.value)}>
                  <option value="">Selecione</option>
                  {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Responsável</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.responsible} onChange={e => setField('responsible', e.target.value)} placeholder="Nome do responsável" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Prazo</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.deadline} onChange={e => setField('deadline', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Prioridade</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.prioridade} onChange={e => setField('prioridade', e.target.value)}>
                  {(Object.keys(PRIORIDADE_CONFIG) as ActionPriority[]).map(p => (
                    <option key={p} value={p}>{PRIORIDADE_CONFIG[p].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.status} onChange={e => setField('status', e.target.value)}>
                  {(Object.keys(STATUS_CONFIG) as ActionStatus[]).map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Origem</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.origem} onChange={e => setField('origem', e.target.value)} placeholder="Ex: SWOT, feedback, avaliação..." />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Observações</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 resize-none"
                  value={form.observations} onChange={e => setField('observations', e.target.value)} placeholder="Observações adicionais..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Salvo!' : 'Salvar ação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
