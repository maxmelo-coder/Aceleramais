'use client';
import React, { useState } from 'react';
import { IconCheck, IconEval } from '@/components/Icons';

const mockQuestions = [
  {
    id: 'q1',
    text: 'O que é empreendedorismo?',
    options: [
      'A) Apenas abrir um negócio para ganhar dinheiro',
      'B) A capacidade de identificar oportunidades e criar soluções inovadoras',
      'C) Trabalhar em uma grande empresa',
      'D) Nenhuma das anteriores',
    ],
  },
  {
    id: 'q2',
    text: 'Qual das características a seguir é essencial para um empreendedor?',
    options: [
      'A) Medo de errar',
      'B) Evitar riscos a qualquer custo',
      'C) Resiliência e capacidade de aprender com os erros',
      'D) Depender sempre de outros para tomar decisões',
    ],
  },
  {
    id: 'q3',
    text: 'O que é inovação no contexto do empreendedorismo?',
    options: [
      'A) Copiar exatamente o que os concorrentes fazem',
      'B) Criar algo totalmente novo ou melhorar algo existente para gerar valor',
      'C) Manter os processos sem nenhuma mudança',
      'D) Aumentar preços para gerar mais lucro',
    ],
  },
];

type Step = 1 | 2 | 3;

interface IdentificacaoForm {
  nome: string;
  cidade: string;
  escola: string;
  turma: string;
  professor: string;
}

export default function AvaliacaoPublicaPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState<Step>(1);
  const [identificacao, setIdentificacao] = useState<IdentificacaoForm>({
    nome: '', cidade: '', escola: '', turma: '', professor: '',
  });
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Partial<IdentificacaoForm>>({});

  function validateStep1(): boolean {
    const errs: Partial<IdentificacaoForm> = {};
    if (!identificacao.nome.trim())      errs.nome      = 'Campo obrigatório';
    if (!identificacao.cidade.trim())    errs.cidade    = 'Campo obrigatório';
    if (!identificacao.escola.trim())    errs.escola    = 'Campo obrigatório';
    if (!identificacao.turma.trim())     errs.turma     = 'Campo obrigatório';
    if (!identificacao.professor.trim()) errs.professor = 'Campo obrigatório';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleContinue() {
    if (validateStep1()) setStep(2);
  }

  function handleSubmit() {
    setStep(3);
  }

  function setField(key: keyof IdentificacaoForm, value: string) {
    setIdentificacao(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="bg-[#060606] rounded-xl px-3 py-2">
            <img src="/logo.png" alt="Acelera+" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avaliação Diagnóstica</p>
            <p className="text-sm font-semibold text-gray-800">Acelera+ Escola de Empreendedorismo</p>
          </div>
        </div>
      </header>

      {/* Progress */}
      {step !== 3 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              {[1, 2].map(s => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step >= s ? 'bg-[#F48B1B] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>{s}</div>
                    <span className={`text-sm font-medium ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s === 1 ? 'Identificação' : 'Avaliação'}
                    </span>
                  </div>
                  {s < 2 && <div className={`flex-1 h-0.5 transition-colors ${step > s ? 'bg-[#F48B1B]' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-2xl">
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Identificação do Estudante</h1>
                <p className="text-gray-500 text-sm mt-1">Preencha seus dados antes de começar a avaliação.</p>
              </div>
              <div className="space-y-4">
                {(
                  [
                    { key: 'nome',      label: 'Nome completo *',                  placeholder: 'Seu nome completo' },
                    { key: 'cidade',    label: 'Cidade *',                         placeholder: 'Sua cidade' },
                    { key: 'escola',    label: 'Escola *',                         placeholder: 'Nome da sua escola' },
                    { key: 'turma',     label: 'Turma *',                          placeholder: 'Ex: 5A, 7B...' },
                    { key: 'professor', label: 'Professor de Empreendedorismo *',  placeholder: 'Nome do seu professor' },
                  ] as { key: keyof IdentificacaoForm; label: string; placeholder: string }[]
                ).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8C99]/30 transition-colors ${errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      value={identificacao[key]}
                      onChange={e => setField(key, e.target.value)}
                      placeholder={placeholder}
                    />
                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <button
                  onClick={handleContinue}
                  className="w-full bg-[#F48B1B] hover:bg-[#D4720E] text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3E2] flex items-center justify-center">
                    <IconEval size={20} className="text-[#F48B1B]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Avaliação Diagnóstica</h1>
                    <p className="text-gray-500 text-sm">Empreendedorismo · Acelera+ 2025</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                  Respondendo como: <strong className="text-gray-900">{identificacao.nome}</strong> · {identificacao.escola} · Turma {identificacao.turma}
                </div>
              </div>

              {mockQuestions.map((q, qi) => (
                <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <p className="font-semibold text-gray-900 mb-4">
                    <span className="text-[#2E8C99] mr-2">{qi + 1}.</span>{q.text}
                  </p>
                  <div className="space-y-3">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setRespostas(prev => ({ ...prev, [q.id]: oi }))}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                          respostas[q.id] === oi
                            ? 'border-[#F48B1B] bg-[#FEF3E2] text-[#D4720E] font-medium'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={Object.keys(respostas).length < mockQuestions.length}
                className="w-full bg-[#F48B1B] hover:bg-[#D4720E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                {Object.keys(respostas).length < mockQuestions.length
                  ? `Responda todas as questões (${Object.keys(respostas).length}/${mockQuestions.length})`
                  : 'Enviar respostas'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <IconCheck size={36} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Avaliação enviada com sucesso!</h1>
              <p className="text-lg text-[#2E8C99] font-medium mb-4">{identificacao.nome}</p>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Suas respostas foram registradas. O professor receberá os resultados em breve.
              </p>
              <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 text-left space-y-1">
                <p><strong>Escola:</strong> {identificacao.escola}</p>
                <p><strong>Turma:</strong> {identificacao.turma}</p>
                <p><strong>Professor:</strong> {identificacao.professor}</p>
                <p><strong>Questões respondidas:</strong> {Object.keys(respostas).length}/{mockQuestions.length}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
