'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { ElevaWordmark } from '@/components/library/ElevaWordmark';
import { usePrefersReducedMotion } from '@/lib/library/use-prefers-reduced-motion';
import { municipalityLogin, type LoginFormState } from './actions';

const initialState: LoginFormState = { error: null, success: false };
const REMEMBER_EMAIL_KEY = 'biblioteca-municipio-remember-email';

// Pontos ao redor do livro representando os municípios conectados à rede —
// posições fixas (não aleatórias a cada render) para não "pular" em re-render.
const NETWORK_POINTS = [
  { x: 18, y: 22, r: 2.6 },
  { x: 82, y: 16, r: 2 },
  { x: 92, y: 46, r: 2.8 },
  { x: 78, y: 80, r: 2.2 },
  { x: 46, y: 90, r: 2.6 },
  { x: 12, y: 68, r: 2 },
  { x: 8, y: 42, r: 2.4 },
  { x: 60, y: 8, r: 1.8 },
];

/**
 * Composição "Biblioteca Viva Municipal" — livro aberto com uma rede de
 * pontos luminosos ao redor (municípios conectados), construída inteiramente
 * em CSS 3D (transform + perspective) e SVG, sem motor 3D dedicado. Segue a
 * mesma técnica de camadas usada no Book3D do login administrativo, mas com
 * um conceito distinto: conexão territorial, não um ícone flutuante isolado.
 */
function LivingLibraryScene() {
  const reducedMotion = usePrefersReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 22 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ perspective: 1400 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Rede de municípios — pontos luminosos conectados ao livro central */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {NETWORK_POINTS.map((p, i) => (
          <line
            key={`line-${i}`}
            x1={p.x}
            y1={p.y}
            x2={50}
            y2={52}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={0.25}
          />
        ))}
        {NETWORK_POINTS.map((p, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={i % 3 === 0 ? '#D4AF7A' : '#60C7DE'}
            animate={reducedMotion ? undefined : { opacity: [0.35, 0.9, 0.35] }}
            transition={
              reducedMotion ? undefined : { duration: 3.4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }
            }
          />
        ))}
      </svg>

      {/* Sombra de apoio — dá "chão" ao livro flutuante */}
      <div
        className="absolute w-64 h-10 rounded-full bg-black/20"
        style={{ transform: 'translateY(120px) rotateX(70deg)' }}
      />

      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -12, 0] }}
        transition={reducedMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        {/* Marca Eleva+ — centro da rede de municípios conectados */}
        <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
          <Image
            src="/brand/logo-icon.png"
            alt="Eleva+"
            width={176}
            height={176}
            priority
            className="select-none w-full h-full object-contain"
          />
        </div>
      </motion.div>

      <span
        className="absolute bottom-8 text-xs font-semibold tracking-[0.2em] uppercase text-white/70"
        style={{ fontFamily: 'var(--font-bib-sans)' }}
      >
        Biblioteca Digital dos Municípios
      </span>
    </div>
  );
}

export default function MunicipalityLoginPage() {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const [state, formAction, pending] = useActionState(municipalityLogin, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (saved && emailRef.current) {
      emailRef.current.value = saved;
      setRememberEmail(true);
    }
  }, []);

  useEffect(() => {
    if (!state.success) return;
    if (rememberEmail && emailRef.current) {
      window.localStorage.setItem(REMEMBER_EMAIL_KEY, emailRef.current.value);
    } else {
      window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
    const timeout = setTimeout(() => router.push('/biblioteca'), reducedMotion ? 0 : 650);
    return () => clearTimeout(timeout);
  }, [state.success, rememberEmail, reducedMotion, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden px-4 py-8"
      style={{ backgroundColor: '#EDF3F8', fontFamily: 'var(--font-bib-sans)' }}
    >
      <AnimatePresence>
        {!state.success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl grid md:grid-cols-2 rounded-bib-xl overflow-hidden shadow-bib-glass border border-bib-border-light"
          >
            {/* Painel institucional e visual — oculto em telas pequenas */}
            <div className="hidden md:flex flex-col justify-between h-[600px] p-10 relative bg-bib-navy">
              <div className="relative z-10">
                <ElevaWordmark variant="dark" size="md" />
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-bib-glass-dark border border-bib-border-dark text-bib-text-dark-secondary">
                  <ShieldCheck size={13} aria-hidden="true" />
                  Ambiente exclusivo das redes municipais
                </span>
                <h1
                  className="mt-5 text-[26px] leading-tight font-bold text-bib-text-dark-primary max-w-xs"
                  style={{ fontFamily: 'var(--font-bib-display)' }}
                >
                  Conhecimento que conecta redes, educadores e estudantes.
                </h1>
                <p className="mt-3 text-sm text-bib-text-dark-secondary max-w-xs">
                  Acesse o acervo digital disponibilizado para o seu município.
                </p>
              </div>

              <div className="relative flex-1 -mx-4">
                <LivingLibraryScene />
              </div>
            </div>

            {/* Painel de autenticação */}
            <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex flex-col items-start mb-8 md:hidden">
                <ElevaWordmark size="md" />
              </div>

              <div className="flex flex-col items-start mb-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-bib-teal/10 text-bib-teal">
                  Acesso do Município
                </span>
                <h2
                  className="mt-3 text-xl font-bold text-bib-text-light-primary"
                  style={{ fontFamily: 'var(--font-bib-display)' }}
                >
                  Biblioteca Digital Acelera+
                </h2>
                <p className="mt-1 text-sm text-bib-text-light-secondary">
                  Entre com o login da sua rede municipal de educação para ler os livros do acervo.
                </p>
              </div>

              <form action={formAction} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
                    Usuário do município
                  </label>
                  <div className="relative">
                    <Mail size={16} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-bib-text-light-muted" />
                    <input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="municipio@eleva.com.br"
                      className="w-full pl-11 pr-4 py-3 rounded-bib-md text-sm bg-white border border-bib-border-light text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-blue/30 focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock size={16} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-bib-text-light-muted" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-bib-md text-sm bg-white border border-bib-border-light text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-blue/30 focus:border-transparent transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-bib-text-light-muted hover:text-bib-text-light-primary transition-colors"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-bib-text-light-secondary cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberEmail}
                      onChange={e => setRememberEmail(e.target.checked)}
                      className="rounded border-bib-border-light accent-[#009CA4]"
                    />
                    Lembrar acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => setHelpOpen(v => !v)}
                    className="inline-flex items-center gap-1 text-bib-teal hover:underline"
                  >
                    <HelpCircle size={13} aria-hidden="true" />
                    Esqueci minha senha
                  </button>
                </div>

                <AnimatePresence>
                  {helpOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-bib-gray-bg border border-bib-border-light rounded-bib-md text-xs text-bib-text-light-secondary">
                        A senha de acesso do seu município é única e compartilhada pela rede. Peça ao
                        administrador da Biblioteca Digital na sua Secretaria de Educação para redefini-la.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {state.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="px-4 py-3 bg-red-50 border border-red-200 rounded-bib-md text-sm text-red-700"
                    >
                      {state.error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={pending || state.success}
                  whileHover={reducedMotion ? undefined : { scale: 1.01 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-bib-md transition-colors text-sm bg-bib-teal shadow-bib-md disabled:opacity-70"
                >
                  {pending || state.success ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      {state.success ? 'Redirecionando...' : 'Entrando...'}
                    </>
                  ) : (
                    <>
                      Acessar biblioteca
                      <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 pt-6 border-t border-bib-border-light space-y-2">
                <p className="text-xs text-bib-text-light-muted">
                  Este login é único por município e compartilhado entre todos os educadores da rede.
                </p>
                <p className="text-xs text-bib-text-light-muted">
                  Precisa de ajuda para acessar? Fale com a Secretaria Municipal de Educação ou com o
                  suporte Acelera+.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
