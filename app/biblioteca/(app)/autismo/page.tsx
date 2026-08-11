import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { AutismoTabs } from './AutismoTabs';

export const metadata = {
  title: 'Autismo e Neurodiversidade — Biblioteca Digital Eleva+',
  description: 'Formação para educadores sobre autismo e neurodiversidade, com abordagem centrada na pessoa.',
};

export default function AutismoPage() {
  return (
    <div className="space-y-10">
      {/* Header — mesmo padrão editorial das demais páginas do hub (eyebrow +
          título + descrição), sem bloco navy de hero. */}
      <header className="pb-6 border-b border-bib-border-light">
        <p className="text-bib-micro font-semibold uppercase tracking-bib-wide text-bib-teal">
          Educação Inclusiva
        </p>
        <h1
          className="mt-1.5 text-bib-display font-bold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Autismo e Neurodiversidade
        </h1>
        <p className="mt-2 text-bib-body text-bib-text-light-secondary max-w-xl">
          Formação baseada em evidências para apoiar educadores a incluir, com qualidade,
          estudantes autistas e neurodivergentes. Abordagem centrada nas potencialidades.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-bib-micro text-bib-text-light-muted">
          {['Lei 12.764/2012', 'LBI — Lei 13.146/2015', 'Abordagem centrada na pessoa', 'Sem práticas coercitivas'].map(tag => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </header>

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
