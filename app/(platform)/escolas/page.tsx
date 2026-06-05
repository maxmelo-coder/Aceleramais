'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Badge, { statusBadge } from '@/components/Badge';
import { IconPlus, IconSearch, IconEye, IconEdit, IconSchool, IconDownload } from '@/components/Icons';
import { useMunicipio } from '@/lib/municipio-context';

export default function EscolasPage() {
  const [search, setSearch] = useState('');
  const { selected } = useMunicipio();
  const schools = selected.schools;

  const filtered = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Escolas</h1>
          <p className="text-sm text-gray-500">{schools.length} escolas cadastradas · {selected.name} — {selected.uf}</p>
        </div>
        <button className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm">
          <IconPlus size={16} />
          Nova escola
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total de escolas', value: schools.length, color: 'text-[#2E8C99]' },
          { label: 'Total de turmas', value: schools.reduce((a, s) => a + s.classCount, 0), color: 'text-[#F48B1B]' },
          { label: 'Total de estudantes', value: schools.reduce((a, s) => a + s.studentCount, 0), color: 'text-green-600' },
          { label: 'Participação média', value: `${Math.round(schools.reduce((a, s) => a + s.participationRate, 0) / schools.length)}%`, color: 'text-purple-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <IconSearch size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar escola…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
            <IconDownload size={14} />
            Exportar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Escola</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Gestor</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Turmas</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Alunos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Participação</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Índice Acelera+</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(school => {
                const sb = statusBadge(school.status);
                return (
                  <tr key={school.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EBF6F7] flex items-center justify-center flex-shrink-0">
                          <IconSchool size={14} className="text-[#2E8C99]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-none">{school.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{school.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden sm:table-cell">{school.gestorName}</td>
                    <td className="px-4 py-3.5 text-center font-medium text-gray-700">{school.classCount}</td>
                    <td className="px-4 py-3.5 text-center text-gray-600 hidden md:table-cell">{school.studentCount}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`font-semibold ${school.participationRate >= 90 ? 'text-green-600' : school.participationRate >= 75 ? 'text-[#2E8C99]' : 'text-amber-600'}`}>
                        {school.participationRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${school.elevaIndex}%`,
                              backgroundColor: school.elevaIndex >= 80 ? '#059669' : school.elevaIndex >= 60 ? '#2E8C99' : '#F48B1B',
                            }}
                          />
                        </div>
                        <span className="font-bold text-gray-700 text-xs w-8">{school.elevaIndex}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <Badge label={sb.label} variant={sb.variant} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/eleva/escolas/${school.id}`}>
                          <button className="p-1.5 text-gray-400 hover:text-[#2E8C99] hover:bg-[#EBF6F7] rounded-lg transition-colors">
                            <IconEye size={15} />
                          </button>
                        </Link>
                        <button className="p-1.5 text-gray-400 hover:text-[#F48B1B] hover:bg-[#FEF3E2] rounded-lg transition-colors">
                          <IconEdit size={15} />
                        </button>
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
