'use client';
import React, { useState } from 'react';
import Badge, { statusBadge } from '@/components/Badge';
import { IconPlus, IconSearch, IconEye, IconEdit, IconFilter } from '@/components/Icons';
import { turmas, schools } from '@/lib/mock-data';

export default function TurmasPage() {
  const [search, setSearch] = useState('');
  const [filterSchool, setFilterSchool] = useState('');

  const filtered = turmas.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherName.toLowerCase().includes(search.toLowerCase());
    const matchSchool = !filterSchool || t.schoolId === filterSchool;
    return matchSearch && matchSchool;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Turmas</h1>
          <p className="text-sm text-gray-500">{turmas.length} turmas cadastradas</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
          <IconPlus size={16} />
          Nova turma
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <IconSearch size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar turma ou professor…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
            />
          </div>
          <select
            value={filterSchool}
            onChange={e => setFilterSchool(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99]"
          >
            <option value="">Todas as escolas</option>
            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Turma</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Escola</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Professor</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Série</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Alunos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Média</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Participação</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(t => {
                const sb = statusBadge(t.participationStatus);
                return (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.turno}</p>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell text-xs">{t.schoolName}</td>
                    <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell">{t.teacherName}</td>
                    <td className="px-4 py-3.5 text-center text-gray-600">{t.serie}</td>
                    <td className="px-4 py-3.5 text-center font-medium text-gray-700">{t.studentCount}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`font-bold ${t.avgScore >= 7.5 ? 'text-green-600' : t.avgScore >= 6 ? 'text-[#2E8C99]' : 'text-amber-600'}`}>
                        {t.avgScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center"><Badge label={sb.label} variant={sb.variant} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="p-1.5 text-gray-400 hover:text-[#2E8C99] hover:bg-[#EBF6F7] rounded-lg transition-colors"><IconEye size={15} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-[#F48B1B] hover:bg-[#FEF3E2] rounded-lg transition-colors"><IconEdit size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-gray-100 text-xs text-gray-400 text-center">
          {filtered.length} de {turmas.length} turmas
        </div>
      </div>
    </div>
  );
}
