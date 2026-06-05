'use client';
import React, { useState } from 'react';
import { IconCheck, IconEye } from '@/components/Icons';

const USERS = [
  { email: 'admin@eleva.com.br',       password: 'Eleva@2025',    name: 'Administrador Acelera+',     role: 'Super Administrador' },
  { email: 'secretaria@limoeiro.al.gov.br', password: 'Sec@2025', name: 'Sec. Francisco das Chagas', role: 'Secretaria Municipal' },
  { email: 'gestor@escola.edu.br',      password: 'Gestor@2025',   name: 'Gestor Escolar',           role: 'Gestor Escolar' },
];

export default function ElevaLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = USERS.find(u => u.email === email.trim().toLowerCase() && u.password === password);
      if (user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('eleva_user', JSON.stringify({ name: user.name, role: user.role, email: user.email }));
        }
        window.location.href = '/dashboard';
      } else {
        setError('E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.');
        setLoading(false);
      }
    }, 600);
  }

  function fillDemo(u: typeof USERS[0]) {
    setEmail(u.email);
    setPassword(u.password);
    setError('');
  }

  return (
    <div className="min-h-screen flex bg-[#F7F8FA]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-[#060606] p-12">
        <div>
          <div className="flex items-center">
            <img src="/logo.png" alt="Acelera+" className="h-12 w-auto brightness-0 invert" />
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Plataforma de<br />
              <span className="text-[#F48B1B]">Gestão Pedagógica</span><br />
              Inteligente
            </h2>
            <p className="mt-4 text-white/50 text-sm leading-relaxed">
              Acompanhe em tempo real o desempenho dos estudantes, a execução do projeto e os indicadores estratégicos da rede municipal de ensino de Limoeiro de Anadia, AL.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              'Dashboard analítico com indicadores em tempo real',
              'Avaliações diagnósticas por competência',
              'Relatórios exportáveis por escola, turma e trimestre',
              'Análise SWOT e Metas SMART integradas',
            ].map(item => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F48B1B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconCheck size={12} className="text-[#F48B1B]" />
                </div>
                <p className="text-white/60 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">
          © 2025 Acelera+ Escola de Empreendedorismo · Todos os direitos reservados
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center mb-8 lg:hidden">
            <img src="/logo.png" alt="Acelera+" className="h-10 w-auto" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
            <p className="mt-1 text-gray-500 text-sm">Acesse com suas credenciais institucionais</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail institucional</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E8C99] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IconEye size={16} />
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F48B1B] hover:bg-[#D4720E] disabled:bg-[#F48B1B]/60 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm"
            >
              {loading ? 'Autenticando...' : 'Entrar na plataforma'}
            </button>
          </form>


          <p className="mt-6 text-center text-xs text-gray-400">
            Ao acessar, você concorda com os{' '}
            <a href="#" className="text-[#2E8C99] hover:underline">Termos de Uso</a>{' '}
            e a{' '}
            <a href="#" className="text-[#2E8C99] hover:underline">Política de Privacidade (LGPD)</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
