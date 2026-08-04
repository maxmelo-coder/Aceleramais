'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { ElevaWordmark } from '@/components/library/ElevaWordmark';
import { usePrefersReducedMotion } from '@/lib/library/use-prefers-reduced-motion';
import { adminLogin, type AdminLoginState } from './actions';

const initialState: AdminLoginState = { error: null, success: false };
const REMEMBER_EMAIL_KEY = 'biblioteca-admin-remember-email';

/** Pilha de "capas de livro" em CSS 3D, com paralaxe leve seguindo o mouse. */
function Book3D() {
  const reducedMotion = usePrefersReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);

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

  // Cópias desfocadas atrás do ícone real, para simular profundidade/glow
  // 3D sem depender de um motor 3D — só CSS transform + blur em camadas.
  const echoLayers = [
    { z: -70, scale: 1.12, opacity: 0.18, blur: 22 },
    { z: -40, scale: 1.07, opacity: 0.28, blur: 10 },
    { z: -18, scale: 1.03, opacity: 0.4, blur: 3 },
  ];

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: 1400 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glows de fundo */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full opacity-40 blur-bib-lg"
        style={{ background: 'radial-gradient(circle, #7957FF, transparent 70%)' }}
      />
      <div
        className="absolute w-[320px] h-[320px] rounded-full opacity-30 blur-bib-lg translate-x-24 translate-y-16"
        style={{ background: 'radial-gradient(circle, #009CA4, transparent 70%)' }}
      />

      {/* Partículas flutuantes */}
      {!reducedMotion &&
        Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/60"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
            animate={{ y: [0, -16, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}

      {/* Pedestal de vidro — dá "chão" ao ícone flutuante */}
      <div
        className="absolute w-56 h-10 rounded-full bg-white/10 blur-bib-md"
        style={{ transform: 'translateY(150px) rotateX(70deg)' }}
      />

      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -14, 0] }}
        transition={reducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-56 h-56 flex items-center justify-center"
      >
        {echoLayers.map((layer, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              transform: `translateZ(${layer.z}px) scale(${layer.scale})`,
              opacity: layer.opacity,
              filter: `blur(${layer.blur}px)`,
            }}
          >
            <Image src="/brand/logo-icon.png" alt="" fill sizes="224px" style={{ objectFit: 'contain' }} />
          </div>
        ))}
        <div className="relative w-full h-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.45)]" style={{ transform: 'translateZ(10px)' }}>
          <Image src="/brand/logo-icon.png" alt="Eleva+" fill sizes="224px" priority style={{ objectFit: 'contain' }} />
        </div>
      </motion.div>

      <span
        className="absolute bottom-10 text-xs font-semibold tracking-[0.2em] uppercase text-white/70"
        style={{ fontFamily: 'var(--font-bib-sans)' }}
      >
        Biblioteca Digital
      </span>
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const [state, formAction, pending] = useActionState(adminLogin, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
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
    const timeout = setTimeout(() => router.push('/biblioteca/admin'), reducedMotion ? 0 : 650);
    return () => clearTimeout(timeout);
  }, [state.success, rememberEmail, reducedMotion, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#040D1A', fontFamily: 'var(--font-bib-sans)' }}
    >
      <AnimatePresence>
        {!state.success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl mx-4 grid md:grid-cols-2 rounded-bib-xl overflow-hidden shadow-bib-glass border border-bib-border-dark"
            style={{ background: 'linear-gradient(160deg, #0B1F35, #071426)' }}
          >
            {/* Painel visual 3D — oculto em telas pequenas */}
            <div className="hidden md:block relative h-[560px]" style={{ background: '#040D1A' }}>
              <Book3D />
            </div>

            {/* Painel de autenticação */}
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex flex-col items-start mb-8">
                <ElevaWordmark variant="dark" size="lg" />
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-bib-glass-dark border border-bib-border-dark text-bib-text-dark-secondary">
                  <ShieldCheck size={13} />
                  Acesso administrativo
                </span>
                <h1
                  className="mt-4 text-2xl font-bold text-bib-text-dark-primary"
                  style={{ fontFamily: 'var(--font-bib-display)' }}
                >
                  Painel da Biblioteca Digital
                </h1>
                <p className="mt-1 text-sm text-bib-text-dark-secondary">
                  Acesso restrito à equipe Editora Inovar / Acelera+.
                </p>
              </div>

              <form action={formAction} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-bib-text-dark-secondary mb-1.5">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-bib-text-dark-muted"
                    />
                    <input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@editorainovar.com.br"
                      className="w-full pl-11 pr-4 py-3 rounded-bib-md text-sm bg-bib-glass-dark border border-bib-border-dark text-bib-text-dark-primary placeholder:text-bib-text-dark-muted focus:outline-none focus:ring-2 focus:ring-bib-blue focus:border-transparent transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-bib-text-dark-secondary mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-bib-text-dark-muted"
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-bib-md text-sm bg-bib-glass-dark border border-bib-border-dark text-bib-text-dark-primary placeholder:text-bib-text-dark-muted focus:outline-none focus:ring-2 focus:ring-bib-blue focus:border-transparent transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-bib-text-dark-muted hover:text-bib-text-dark-primary transition-colors"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-bib-text-dark-secondary cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberEmail}
                      onChange={e => setRememberEmail(e.target.checked)}
                      className="rounded border-bib-border-dark-strong bg-transparent accent-[#009CA4]"
                    />
                    Lembrar e-mail
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(v => !v)}
                    className="text-bib-blue hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <AnimatePresence>
                  {forgotOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-bib-glass-dark border border-bib-border-dark rounded-bib-md text-xs text-bib-text-dark-secondary">
                        Redefinição de senha por e-mail ainda não está disponível neste painel.
                        Entre em contato com o administrador do sistema para redefinir seu acesso.
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
                      className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-bib-md text-sm text-red-300"
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
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-bib-md transition-colors text-sm shadow-bib-glow-teal disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
                >
                  {pending || state.success ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {state.success ? 'Redirecionando...' : 'Entrando...'}
                    </>
                  ) : (
                    <>
                      Entrar no painel
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-8 text-xs text-bib-text-dark-muted">
                Este acesso é restrito. Tentativas indevidas de login são registradas.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
