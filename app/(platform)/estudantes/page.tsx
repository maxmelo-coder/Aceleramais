'use client';
import React, { useState } from 'react';
import Badge, { statusBadge } from '@/components/Badge';
import { IconPlus, IconSearch, IconEye, IconDownload } from '@/components/Icons';
import { students, schools, turmas } from '@/lib/mock-data';

export default function EstudantesPage() {
  const [search, setSearch] = useState('');
  const [filterSchool, setFilterSchool] = useState('');

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.matricula.includes(search);
    const matchSchool = !filterSchool || s.schoolId === filterSchool;
    return matchSearch && matchSchool;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Estudantes</h1>
          <p className="text-sm text-gray-500">{students.length} estudantes (amostra demonstrativa · total estimado: 843)</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors">
            <IconDownload size={14} />
            Exportar
          </button>
          <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
            <IconPlus size={16} />
            Cadastrar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <IconSearch size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Nome ou matrícula…"
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Estudante</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Escola</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Turma</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Série</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Média</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(student => {
                const sb = statusBadge(student.status);
                return (
                  <tr key={student.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2E8C99] to-[#4BAAB6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-400">{student.matricula}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs hidden sm:table-cell">{student.schoolName}</td>
                    <td className="px-4 py-3.5 text-center text-gray-700">{student.turmaName}</td>
                    <td className="px-4 py-3.5 text-center text-gray-600 hidden md:table-cell">{student.serie}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`font-bold ${student.avgScore >= 7.5 ? 'text-green-600' : student.avgScore >= 6 ? 'text-[#2E8C99]' : 'text-amber-600'}`}>
                        {student.avgScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center"><Badge label={sb.label} variant={sb.variant} /></td>
                    <td className="px-4 py-3.5">
                      <button className="p-1.5 text-gray-400 hover:text-[#2E8C99] hover:bg-[#EBF6F7] rounded-lg transition-colors"><IconEye size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-gray-100 text-xs text-gray-400 text-center">
          Exibindo {filtered.length} estudantes (dados de demonstração)
        </div>
      </div>
    </div>
  );
}
