'use client';
import React, { useState } from 'react';
import { Gauge } from '@/components/Charts';
import { IconFeedback, IconPlus, IconCheck } from '@/components/Icons';
import { secretaryFeedbacks, trimesters } from '@/lib/mock-data';

export default function FeedbackSecretariaPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Feedback da Secretaria</h1>
          <p className="text-sm text-gray-500">Registros institucionais do Secretário de Educação</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#F48B1B] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#D4720E] transition-colors shadow-sm"
        >
          <IconPlus size={16} />
          Novo feedback
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2E8C99]/20">
          <h3 className="font-semibold text-gray-900 mb-4">Registrar Feedback Institucional</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Trimestre</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
                {trimesters.map(t => <option key={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Avaliação geral (1–5)</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]">
                {[5,4,3,2,1].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            {[
              { label: 'Pontos fortes', key: 'strengths' },
              { label: 'Pontos de melhoria', key: 'improvements' },
              { label: 'Expectativas para o próximo trimestre', key: 'expectations' },
              { label: 'Decisões e encaminhamentos', key: 'decisions' },
            ].map(field => (
              <div key={field.key} className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{field.label}</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99] resize-none" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
            <button className="px-4 py-2 text-sm bg-[#2E8C99] text-white rounded-lg hover:bg-[#226E79] transition-colors font-medium">Salvar feedback</button>
          </div>
        </div>
      )}

      {/* Existing feedbacks */}
      {secretaryFeedbacks.map(fb => (
        <div key={fb.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-full bg-[#060606] flex items-center justify-center text-white font-bold text-sm">
                  {fb.userName.split(' ')[1]?.charAt(0) ?? fb.userName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 leading-none">{fb.userName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{fb.trimesterName} · {fb.submittedAt}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Gauge value={fb.generalRating * 20} size={80} label="Avaliação geral" color="#F48B1B" />
              <Gauge value={fb.perceivedImpact * 20} size={80} label="Impacto percebido" color="#2E8C99" />
              <Gauge value={fb.alignment * 20} size={80} label="Alinhamento" color="#059669" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-green-700 mb-1.5 uppercase tracking-wide">Pontos fortes</p>
              <p className="text-sm text-green-800">{fb.strengths}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-700 mb-1.5 uppercase tracking-wide">Pontos de melhoria</p>
              <p className="text-sm text-amber-800">{fb.improvements}</p>
            </div>
            <div className="bg-[#EBF6F7] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#226E79] mb-1.5 uppercase tracking-wide">Expectativas</p>
              <p className="text-sm text-[#2E8C99]">{fb.expectations}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Decisões e encaminhamentos</p>
              <p className="text-sm text-gray-700">{fb.decisions}</p>
            </div>
          </div>

          {fb.comment && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">Comentário institucional</p>
              <p className="text-sm text-gray-700 italic">&ldquo;{fb.comment}&rdquo;</p>
            </div>
          )}
        </div>
      ))}

      {secretaryFeedbacks.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <IconFeedback size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum feedback registrado ainda.</p>
        </div>
      )}
    </div>
  );
}
