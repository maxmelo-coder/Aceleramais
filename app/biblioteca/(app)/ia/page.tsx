import {
  FileText,
  Search,
  Calendar,
  BookOpen,
  Brain,
  Layers,
  Scissors,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { ModeCard } from '@/components/library/ia/ModeCard';
import { SafetyBanner } from '@/components/library/ia/SafetyBanner';

export const metadata = {
  title: 'IA Eleva+ — Assistente Pedagógica',
};

// Organizado por intenção de uso (o que o educador quer fazer), não por uma
// grade uniforme onde toda funcionalidade recebe o mesmo peso visual. Os
// destinos/rotas são os mesmos de antes — só a arquitetura de apresentação
// muda.
const groups = [
  {
    label: 'Planejamento pedagógico',
    items: [
      {
        href: '/biblioteca/ia/planejamento',
        icon: <Calendar size={20} />,
        title: 'Planejar Aula',
        description: 'Gere planos de aula alinhados à BNCC com abertura, desenvolvimento, fechamento e avaliação formativa.',
      },
      {
        href: '/biblioteca/ia/percurso-letivo',
        icon: <Layers size={20} />,
        title: 'Percurso Letivo',
        description: 'Planeje o ano letivo completo: unidades, habilidades, projetos, avaliações e intervenções.',
      },
    ],
  },
  {
    label: 'Inclusão e acompanhamento',
    items: [
      {
        href: '/biblioteca/ia/pei',
        icon: <FileText size={20} />,
        title: 'Construtor de PEI',
        description: 'Elabore o Plano Educacional Individualizado passo a passo, com base na LBI e na Lei 12.764/2012.',
        badge: 'Inclusão',
      },
      {
        href: '/biblioteca/ia?mode=autismo',
        icon: <Brain size={20} />,
        title: 'Apoio — Autismo',
        description: 'Estratégias pedagógicas centradas na pessoa autista, individualizadas e baseadas em evidências.',
        badge: 'Inclusão',
      },
    ],
  },
  {
    label: 'Desenvolvimento de materiais',
    items: [
      {
        href: '/biblioteca/ia?mode=materiais',
        icon: <BookOpen size={20} />,
        title: 'Criar Materiais',
        description: 'Sequências didáticas, rubricas, histórias sociais, rotinas visuais e materiais para famílias.',
      },
      {
        href: '/biblioteca/ia?mode=adaptacao',
        icon: <Scissors size={20} />,
        title: 'Adaptar Atividades',
        description: 'Adapte textos, avaliações e instruções com base nos princípios do DUA (Universal Design for Learning).',
      },
    ],
  },
  {
    label: 'Análise pedagógica',
    items: [
      {
        href: '/biblioteca/ia/estudo-de-caso',
        icon: <Search size={20} />,
        title: 'Estudo de Caso Pedagógico',
        description: 'Organize observações de forma colaborativa e contextual sem hipóteses diagnósticas.',
      },
    ],
  },
];

export default function IAHubPage() {
  return (
    <div className="space-y-10">
      {/* Header — compacto e editorial: a hierarquia vem da tipografia, não
          de um bloco navy de hero ocupando a dobra inteira. */}
      <header className="pb-6 border-b border-bib-border-light">
        <p className="text-bib-micro font-semibold uppercase tracking-bib-wide text-bib-teal">
          Assistente Pedagógica
        </p>
        <h1
          className="mt-1.5 text-bib-display font-bold text-bib-text-light-primary"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          IA Eleva+
        </h1>
        <p className="mt-2 text-bib-body text-bib-text-light-secondary max-w-xl">
          Um espaço de trabalho pedagógico para apoiar educadores das redes municipais do Brasil,
          baseado nas legislações vigentes e focado nas potencialidades dos estudantes.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-bib-micro text-bib-text-light-muted">
          <span>Não realiza diagnósticos</span>
          <span>Não emite laudos</span>
          <span>Não prescreve medicamentos</span>
          <span>Sugestões exigem validação profissional</span>
        </div>
      </header>

      <SafetyBanner />

      {/* Ações mais relevantes — a Consultoria Socioemocional lida com
          situações sensíveis/urgentes e o Chat Livre é o ponto de entrada
          mais genérico; ambos merecem mais peso visual que os demais modos. */}
      <section>
        <h2 className="text-bib-micro font-semibold uppercase tracking-bib-wide text-bib-text-light-muted">
          Ações rápidas
        </h2>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModeCard
            variant="featured"
            href="/biblioteca/ia/socioemocional"
            icon={<Heart size={20} />}
            title="Consultoria Socioemocional"
            description="Apoio pedagógico para situações socioemocionais em sala — com protocolo de proteção quando necessário."
            tone="warning"
            badge="Urgente"
          />
          <ModeCard
            variant="featured"
            href="/biblioteca/ia?mode=livre"
            icon={<MessageCircle size={20} />}
            title="Chat Livre"
            description="Tem uma dúvida pedagógica geral? Converse diretamente com a IA Eleva+ sem um modo específico."
          />
        </div>
      </section>

      {/* Grupos de capacidade — organizados por intenção de uso. */}
      {groups.map(group => (
        <section key={group.label}>
          <h2 className="text-bib-micro font-semibold uppercase tracking-bib-wide text-bib-text-light-muted">
            {group.label}
          </h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {group.items.map(item => (
              <ModeCard
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                description={item.description}
                badge={'badge' in item ? item.badge : undefined}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Aviso de responsabilidade */}
      <section className="px-4 py-4 bg-bib-surface-subtle rounded-bib-md border border-bib-border-light text-bib-caption text-bib-text-light-muted leading-relaxed">
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
