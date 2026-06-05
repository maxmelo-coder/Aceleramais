'use client';
import React, { useState } from 'react';
import Badge from '@/components/Badge';
import StatCard from '@/components/StatCard';
import { IconUsers, IconPlus, IconEdit, IconEye, IconX, IconSave } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';
import type { User, UserRole } from '@/lib/types';

const tabLabels = ['Usuários', 'Perfis de Acesso'] as const;
type Tab = typeof tabLabels[number];

const PERFIS: { value: UserRole; label: string; desc: string; variant: 'purple' | 'orange' | 'blue' | 'green' | 'gray' }[] = [
  { value: 'super_admin',    label: 'Super Admin',       desc: 'Acesso total à plataforma. Gerencia todos os municípios, usuários e configurações.',    variant: 'purple' },
  { value: 'admin_eleva',    label: 'Admin Acelera+',    desc: 'Administrador da organização. Acessa todos os dados e relatórios.',                     variant: 'orange' },
  { value: 'gestor_municipal',label: 'Gestor Municipal', desc: 'Acessa dados do seu município. Gerencia escolas, turmas e acompanha indicadores.',      variant: 'blue'   },
  { value: 'gestor_escolar', label: 'Gestor Escolar',   desc: 'Acessa dados da sua escola. Visualiza turmas, estudantes e resultados.',                 variant: 'green'  },
  { value: 'professor',      label: 'Professor',         desc: 'Acessa suas turmas, avaliações e formações.',                                           variant: 'gray'   },
  { value: 'formador',       label: 'Formador',          desc: 'Gerencia formações docentes, materiais e presenças.',                                   variant: 'blue'   },
  { value: 'visualizador',   label: 'Visualizador',      desc: 'Acesso somente leitura. Pode ver relatórios e dashboards.',                              variant: 'gray'   },
];

const roleBadgeVariant: Record<UserRole, 'purple' | 'orange' | 'blue' | 'green' | 'gray'> = {
  super_admin:     'purple',
  admin_eleva:     'orange',
  gestor_municipal:'blue',
  gestor_escolar:  'green',
  professor:       'gray',
  formador:        'blue',
  visualizador:    'gray',
};

function emptyForm() {
  return { id: '', name: '', email: '', role: 'gestor_municipal' as UserRole, municipioId: '', schoolId: '' };
}

export default function UsuariosPage() {
  const { all } = useMunicipio();
  const [tab, setTab] = useState<Tab>('Usuários');
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [saved, setSaved] = useState(false);

  function openNew() { setForm(emptyForm()); setSaved(false); setShowModal(true); }
  function closeModal() { setShowModal(false); setForm(null); setSaved(false); }

  function handleSave() {
    if (!form) return;
    if (!form.name.trim()) { alert('Nome é obrigatório.'); return; }
    if (!form.email.trim()) { alert('E-mail é obrigatório.'); return; }
    const munName = all.find(m => m.id === form.municipioId)?.name;
    setUsers(prev => [...prev, {
      ...form, id: 'u' + Date.now(),
      municipioName: munName,
      status: 'ativo',
      lastAccess: new Date().toISOString(),
    }]);
    setSaved(true);
    setTimeout(closeModal, 1200);
  }

  function setField(key: string, value: string) {
    if (!form) return;
    setForm({ ...form, [key]: value } as typeof form);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários e Permissões</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestão de acessos e perfis da plataforma</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#F48B1B] hover:bg-[#D4720E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <IconPlus size={15} /> Convidar usuário
        </button>
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

      {tab === 'Usuários' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Total usuários" value={users.length}                                       icon={<IconUsers size={18} />} color="blue" />
            <StatCard title="Ativos"         value={users.filter(u => u.status === 'ativo').length}    icon={<IconUsers size={18} />} color="green" />
            <StatCard title="Gestores"       value={users.filter(u => u.role.includes('gestor')).length} icon={<IconUsers size={18} />} color="orange" />
            <StatCard title="Professores"    value={users.filter(u => u.role === 'professor').length}  icon={<IconUsers size={18} />} color="blue" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Usuários cadastrados</h2>
            </div>
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <IconUsers size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhum usuário convidado ainda</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">Convide membros da equipe para acessar a plataforma com os perfis adequados.</p>
                <button onClick={openNew}
                  className="mt-4 flex items-center gap-2 bg-[#F48B1B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#D4720E] transition-colors">
                  <IconPlus size={15} /> Convidar usuário
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left font-medium">Nome</th>
                      <th className="px-6 py-3 text-left font-medium">E-mail</th>
                      <th className="px-6 py-3 text-left font-medium">Perfil</th>
                      <th className="px-6 py-3 text-left font-medium">Município</th>
                      <th className="px-6 py-3 text-center font-medium">Status</th>
                      <th className="px-6 py-3 text-left font-medium">Último acesso</th>
                      <th className="px-6 py-3 text-center font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => {
                      const roleCfg = PERFIS.find(p => p.value === u.role);
                      return (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <Badge label={roleCfg?.label ?? u.role} variant={roleBadgeVariant[u.role]} />
                          </td>
                          <td className="px-6 py-4 text-gray-600">{u.municipioName || '—'}</td>
                          <td className="px-6 py-4 text-center">
                            <Badge label={u.status === 'ativo' ? 'Ativo' : 'Inativo'} variant={u.status === 'ativo' ? 'green' : 'red'} />
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs">
                            {u.lastAccess ? new Date(u.lastAccess).toLocaleDateString('pt-BR') : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-1.5 rounded-lg text-[#F48B1B] hover:bg-orange-50 transition-colors"><IconEdit size={14} /></button>
                              <button className="p-1.5 rounded-lg text-[#2E8C99] hover:bg-teal-50 transition-colors"><IconEye size={14} /></button>
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
        </>
      )}

      {tab === 'Perfis de Acesso' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Perfis e permissões</h2>
            <p className="text-sm text-gray-500 mt-0.5">Descrição de cada perfil de acesso disponível na plataforma</p>
          </div>
          <div className="divide-y divide-gray-50">
            {PERFIS.map(p => (
              <div key={p.value} className="flex items-start gap-4 px-6 py-4">
                <div className="flex-shrink-0 mt-0.5">
                  <Badge label={p.label} variant={p.variant} size="md" />
                </div>
                <p className="text-sm text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-lg">Convidar Usuário</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><IconX size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">E-mail *</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.email} onChange={e => setField('email', e.target.value)} placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Perfil de acesso</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.role} onChange={e => setField('role', e.target.value)}>
                  {PERFIS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Município</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30"
                  value={form.municipioId} onChange={e => setField('municipioId', e.target.value)}>
                  <option value="">Selecione (ou deixe em branco para acesso geral)</option>
                  {all.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
              <button onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors ${saved ? 'bg-green-500' : 'bg-[#F48B1B] hover:bg-[#D4720E]'}`}>
                <IconSave size={15} />
                {saved ? 'Convidado!' : 'Enviar convite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
