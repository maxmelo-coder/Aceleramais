import Link from 'next/link';
import { Sparkles, FileText, Search, Heart, Calendar, BookOpen, Brain, Layers, Scissors, MessageCircle, ArrowRight } from 'lucide-react';
import { ModeCard } from '@/components/library/ia/ModeCard';
import { SafetyBanner } from '@/components/library/ia/SafetyBanner';

export const metadata = {
  title: 'IA Eleva+ — Assistente Pedagógica',
};

const modes = [
  {
    href: '/biblioteca/ia/pei',
    icon: <FileText size={20} />,
    title: 'Construtor de PEI',
    description: 'Elabore o Plano Educacional Individualizado passo a passo, com base na LBI e na Lei 12.764/2012.',
    color: '#009CA4',
    badge: 'Inclusão',
  },
  {
    href: '/biblioteca/ia/estudo-de-caso',
    icon: <Search size={20} />,
    title: 'Estudo de Caso Pedagógico',
    description: 'Organize observações de forma colaborativa e contextual sem hipóteses diagnósticas.',
    color: '#13A4CC',
  },
  {
    href: '/biblioteca/ia/planejamento',
    icon: <Calendar size={20} />,
    title: 'Planejar Aula',
    description: 'Gere planos de aula alinhados à BNCC com abertura, desenvolvimento, fechamento e avaliação formativa.',
    color: '#009CA4',
  },
  {
    href: '/biblioteca/ia/socioemocional',
    icon: <Heart size={20} />,
    title: 'Consultoria Socioemocional',
    description: 'Apoio pedagógico para situações socioemocionais em sala — com protocolo de proteção quando necessário.',
    color: '#FE6509',
    badge: 'Urgente',
  },
  {
    href: '/biblioteca/ia/percurso-letivo',
    icon: <Layers size={20} />,
    title: 'Percurso Letivo',
    description: 'Planeje o ano letivo completo: unidades, habilidades, projetos, avaliações e intervenções.',
    color: '#7957FF',
  },
  {
    href: '/biblioteca/ia?mode=autismo',
    icon: <Brain size={20} />,
    title: 'Apoio — Autismo',
    description: 'Estratégias pedagógicas centradas na pessoa autista, individualizadas e baseadas em evidências.',
    color: '#13A4CC',
  },
  {
    href: '/biblioteca/ia?mode=materiais',
    icon: <BookOpen size={20} />,
    title: 'Criar Materiais',
    description: 'Sequências didáticas, rubricas, histórias sociais, rotinas visuais e materiais para famílias.',
    color: '#009CA4',
  },
  {
    href: '/biblioteca/ia?mode=adaptacao',
    icon: <Scissors size={20} />,
    title: 'Adaptar Atividades',
    description: 'Adapte textos, avaliações e instruções com base nos princípios do DUA (Universal Design for Learning).',
    color: '#D4AF7A',
  },
];

export default function IAHubPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-bib-xl px-6 py-10 sm:px-10 sm:py-12"
        style={{ background: 'linear-gradient(135deg, #072441, #0B3560 60%, #072441)' }}
      >
        <Sparkles
          size={200}
          aria-hidden="true"
          className="absolute -right-8 -top-8 text-white/[0.05] rotate-12 pointer-events-none"
        />
        <span className="relative inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70">
          <Sparkles size={12} aria-hidden="true" />
          Assistente Pedagógica
        </span>
        <h1
          className="relative mt-4 text-2xl sm:text-3xl font-bold text-white max-w-lg"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          IA Eleva+
        </h1>
        <p className="relative mt-2 text-sm text-white/70 max-w-xl">
          Uma assistente pedagógica para apoiar educadores das redes municipais do Brasil.
          Baseada nas legislações vigentes, focada nas potencialidades dos estudantes.
        </p>
        <div className="relative mt-5 flex flex-wrap gap-2 text-xs text-white/50">
          <span>Não realiza diagnósticos</span>
          <span aria-hidden="true">·</span>
          <span>Não emite laudos</span>
          <span aria-hidden="true">·</span>
          <span>Não prescreve medicamentos</span>
          <span aria-hidden="true">·</span>
          <span>Sugestões exigem validação profissional</span>
        </div>
      </section>

      {/* Safety */}
      <SafetyBanner />

      {/* Modos */}
      <section>
        <h2
          className="text-lg font-bold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Escolha um modo
        </h2>
        <p className="mt-1 text-sm text-bib-text-light-muted">
          Cada modo tem um foco diferente e um conjunto de instruções específicas para apoiar sua prática.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map(mode => (
            <ModeCard
              key={mode.href}
              href={mode.href}
              icon={mode.icon}
              title={mode.title}
              description={mode.description}
              color={mode.color}
              badge={mode.badge}
            />
          ))}
        </div>
      </section>

      {/* Chat livre */}
      <section className="bg-white rounded-bib-md border border-bib-border-light p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
            aria-hidden="true"
          >
            <MessageCircle size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-bib-text-light-primary"
              style={{ fontFamily: 'var(--font-bib-display)' }}
            >
              Chat Livre
            </h3>
            <p className="mt-1 text-sm text-bib-text-light-muted">
              Tem uma dúvida pedagógica geral? Converse diretamente com a IA Eleva+ sem um modo específico.
            </p>
            <Link
              href="/biblioteca/ia?mode=livre"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-bib-teal hover:text-bib-blue transition-colors"
            >
              Iniciar conversa livre
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Aviso de responsabilidade */}
      <section className="px-4 py-4 bg-bib-gray-bg rounded-bib-md border border-bib-border-light text-xs text-bib-text-light-muted leading-relaxed">
        <strong className="text-bib-text-light-secondary">Aviso de uso responsável:</strong>{' '}
        A IA Eleva+ é uma ferramenta de apoio pedagógico e não substitui o trabalho de psicólogos,
        médicos, terapeutas, assistentes sociais ou advogados. Toda sugestão gerada precisa ser
        analisada e validada pelos profissionais responsáveis antes de ser aplicada.
        Em situações que envolvam risco à integridade física ou emocional de estudantes, acione
        imediatamente o protocolo institucional e os serviços oficiais de proteção.
      </section>
    </div>
  );
}
