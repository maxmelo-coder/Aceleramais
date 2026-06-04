'use client';
import React, { useState } from 'react';
import Badge, { roleBadge, statusBadge } from '@/components/Badge';
import { IconPlus, IconSearch, IconEdit, IconTrash, IconUser, IconEye } from '@/components/Icons';
import { users } from '@/lib/mock-data';

export default function UsuariosPage() {
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Usuários e Permissões</h1>
          <p className="text-sm text-gray-500">{users.length} usuários cadastrados</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
          <IconPlus size={16} />
          Novo usuário
        </button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { role: 'super_admin', label: 'Super Admin' },
          { role: 'admin_eleva', label: 'Admin Eleva+' },
          { role: 'secretaria', label: 'Secretaria' },
          { role: 'gestor_escolar', label: 'Gestor' },
          { role: 'professor', label: 'Professor' },
          { role: 'visualizador', label: 'Visualizador' },
        ].map(r => {
          const count = users.filter(u => u.role === r.role).length;
          const rb = roleBadge(r.role);
          return (
            <div key={r.role} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <Badge label={rb.label} variant={rb.variant} size="sm" />
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <IconSearch size={15} className="text-gray-400" />
            <input type="text" placeholder="Buscar por nome ou e-mail…" value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Usuário</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">E-mail</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Perfil</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Último acesso</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => {
                const rb = roleBadge(u.role);
                const sb = statusBadge(u.status);
                return (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2E8C99] to-[#4BAAB6] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-none">{u.name}</p>
                          {u.phone && <p className="text-xs text-gray-400 mt-0.5">{u.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs hidden md:table-cell">{u.email}</td>
                    <td className="px-4 py-3.5 text-center"><Badge label={rb.label} variant={rb.variant} /></td>
                    <td className="px-4 py-3.5 text-center hidden sm:table-cell"><Badge label={sb.label} variant={sb.variant} /></td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 hidden lg:table-cell">
                      {u.lastAccess ? new Date(u.lastAccess).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="p-1.5 text-gray-400 hover:text-[#2E8C99] hover:bg-[#EBF6F7] rounded-lg transition-colors"><IconEye size={15} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-[#F48B1B] hover:bg-[#FEF3E2] rounded-lg transition-colors"><IconEdit size={15} /></button>
                        {u.role !== 'super_admin' && (
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><IconTrash size={15} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
