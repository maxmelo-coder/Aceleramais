import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { AutismoTabs } from './AutismoTabs';

export const metadata = {
  title: 'Autismo e Neurodiversidade — Biblioteca Digital Eleva+',
  description: 'Formação para educadores sobre autismo e neurodiversidade, com abordagem centrada na pessoa.',
};

export default function AutismoPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-bib-xl px-6 py-10 sm:px-10 sm:py-12 bg-bib-navy">
        <span className="relative inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70">
          <BookOpen size={12} aria-hidden="true" />
          Educação Inclusiva
        </span>
        <h1
          className="relative mt-4 text-2xl sm:text-3xl font-bold text-white max-w-lg"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Autismo e Neurodiversidade
        </h1>
        <p className="relative mt-2 text-sm text-white/70 max-w-xl">
          Formação baseada em evidências para apoiar educadores a incluir, com qualidade,
          estudantes autistas e neurodivergentes. Abordagem centrada nas potencialidades.
        </p>
        <div className="relative mt-5 flex flex-wrap gap-3">
          {['Lei 12.764/2012', 'LBI — Lei 13.146/2015', 'Abordagem centrada na pessoa', 'Sem práticas coercitivas'].map(tag => (
            <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/70">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Princípios */}
      <section className="bg-white rounded-bib-md border border-bib-border-light p-6 shadow-sm">
        <h2
          className="text-base font-bold text-bib-text-light-primary mb-4"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Princípios norteadores
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Cada estudante autista é único — não existe uma estratégia que funcione para todos.',
            'Parta sempre das potencialidades, interesses e preferências do estudante.',
            'Laudo diagnóstico não é requisito para iniciar apoio pedagógico.',
            'Nenhuma prática coercitiva, punitiva ou que cause sofrimento é aceitável.',
            'A participação da família é essencial — escola e família caminham juntas.',
            'O objetivo é a inclusão real: participação e aprendizagem com qualidade.',
          ].map((principle, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-bib-text-light-secondary">
              <CheckCircle size={15} className="shrink-0 mt-0.5 text-bib-teal" aria-hidden="true" />
              <span>{principle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <AutismoTabs />

      {/* CTA IA */}
      <section className="rounded-bib-lg p-6 border border-bib-teal/20 bg-bib-teal/5">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white bg-bib-teal shrink-0"
            aria-hidden="true"
          >
            <Sparkles size={20} />
          </div>
          <div>
            <h3
              className="font-semibold text-bib-text-light-primary"
              style={{ fontFamily: 'var(--font-bib-display)' }}
            >
              Apoio da IA Eleva+ para autismo
            </h3>
            <p className="mt-1 text-sm text-bib-text-light-muted">
              A IA Eleva+ tem um modo específico para apoiar educadores de estudantes autistas —
              com estratégias individualizadas, perguntas de reflexão e fundamentação legal.
            </p>
            <Link
              href="/biblioteca/ia?mode=autismo"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-bib-teal hover:text-bib-blue transition-colors"
            >
              Usar IA Eleva+ — Modo Autismo
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
