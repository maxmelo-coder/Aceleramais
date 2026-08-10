import Link from 'next/link';
import { Play, Sparkles, ArrowRight, BookOpen, Users, Shield, ClipboardList, MessageCircle, Star, Eye, Lightbulb, Heart } from 'lucide-react';
import { AccordionItem } from './AccordionItem';

export const metadata = {
  title: 'Educar para Cuidar — Biblioteca Digital Eleva+',
  description: 'Formação em educação socioemocional e cuidado integral para educadores das redes municipais.',
};

const sections = [
  {
    id: '10.1',
    icon: <Heart size={18} />,
    title: '10.1 — O que é Educar para Cuidar?',
    content: `Educar para Cuidar é uma abordagem pedagógica que reconhece que o desenvolvimento integral do estudante envolve, ao mesmo tempo, aprendizagem cognitiva e bem-estar socioemocional. O cuidado não é uma tarefa separada do ensino — é parte constitutiva de uma boa prática pedagógica.

Nas redes municipais, isso significa criar ambientes de aprendizagem seguros, acolhedores e estimulantes, onde cada estudante se sente reconhecido e pertencente.

**Bases legais:**
- Lei 9.394/1996 (LDB) — educação como pleno desenvolvimento da pessoa
- BNCC — competências socioemocionais como parte do currículo
- ECA (Lei 8.069/1990) — proteção integral da criança e do adolescente`,
  },
  {
    id: '10.2',
    icon: <Users size={18} />,
    title: '10.2 — Vínculo educador-estudante',
    content: `O vínculo afetivo seguro entre educador e estudante é um fator protetor comprovado para o desenvolvimento e a aprendizagem. Pesquisas em neurociência da educação mostram que estudantes que se sentem vistos e respeitados pelo educador apresentam maior engajamento, melhor regulação emocional e mais disposição para assumir riscos cognitivos.

**Práticas que fortalecem o vínculo:**
- Chamar cada estudante pelo nome e demonstrar interesse genuíno pela sua vida
- Criar rituais de acolhida no início das aulas
- Dar feedback específico, positivo e construtivo
- Reconhecer publicamente os esforços, não apenas os resultados
- Estar presente — olhar nos olhos, escutar sem interromper

**Atenção:** vínculo não significa ausência de limites. Estrutura e afeto coexistem e se reforçam.`,
  },
  {
    id: '10.3',
    icon: <Shield size={18} />,
    title: '10.3 — Clima escolar e pertencimento',
    content: `Clima escolar é o conjunto de percepções, expectativas e experiências compartilhadas por toda a comunidade escolar — estudantes, educadores, equipe gestora e famílias. Um clima positivo é um dos melhores preditores de aprendizagem e bem-estar.

**Dimensões do clima escolar:**
1. **Segurança física e emocional** — ausência de bullying, violência e humilhação
2. **Qualidade das relações** — respeito mútuo, cooperação, pertencimento
3. **Engajamento** — participação ativa, relevância do conteúdo
4. **Ambiente de ensino** — clareza das expectativas, suporte ao aprendizado

**Como educadores podem contribuir:**
- Criar normas de convivência colaborativamente com a turma
- Intervir imediatamente diante de situações de exclusão ou humilhação
- Celebrar a diversidade como riqueza coletiva
- Envolver as famílias como parceiras`,
  },
  {
    id: '10.4',
    icon: <Lightbulb size={18} />,
    title: '10.4 — Competências socioemocionais na BNCC',
    content: `A Base Nacional Curricular Comum (BNCC) traz as competências socioemocionais como parte das 10 Competências Gerais da Educação Básica, especialmente nas competências 8, 9 e 10:

**Competência 8 — Autoconhecimento e autocuidado:** conhecer-se, apreciar-se e cuidar de sua saúde física e emocional, compreendendo-se na diversidade humana.

**Competência 9 — Empatia e cooperação:** exercitar a empatia, o diálogo, a resolução de conflitos e a cooperação, fazendo-se respeitar e promovendo o respeito ao outro.

**Competência 10 — Responsabilidade e cidadania:** agir pessoal e coletivamente com autonomia, responsabilidade, flexibilidade, resiliência e determinação.

**Na prática pedagógica:**
- Não são uma disciplina separada — permeiam todas as áreas
- Podem ser desenvolvidas em projetos, assembleias de classe, literatura e atividades cotidianas
- Demandam modelagem — o educador também as pratica`,
  },
  {
    id: '10.5',
    icon: <ClipboardList size={18} />,
    title: '10.5 — Regulação emocional em sala de aula',
    content: `Regulação emocional é a capacidade de reconhecer, compreender e gerenciar as próprias emoções de forma adaptativa. Em contexto escolar, isso significa que estudantes — e educadores — conseguem funcionar bem mesmo diante de desafios, frustrações e conflitos.

**Estratégias para apoiar a regulação emocional:**
- Criar espaços de "pausa segura" para estudantes que precisam se reequilibrar
- Ensinar explicitamente nomes para emoções (alfabetização emocional)
- Usar técnicas de respiração e atenção plena como parte da rotina
- Modelar a regulação emocional — o educador também nomeia suas emoções

**Sinais de desregulação que precisam de atenção:**
- Explosões frequentes e desproporcionais
- Retraimento persistente
- Dificuldade de retornar à calma após conflitos
- Comportamentos autolesivos

Quando esses sinais persistirem, acione a equipe pedagógica e, se necessário, os serviços especializados.`,
  },
  {
    id: '10.6',
    icon: <MessageCircle size={18} />,
    title: '10.6 — Comunicação não-violenta na escola',
    content: `A Comunicação Não-Violenta (CNV), desenvolvida por Marshall Rosenberg, é uma abordagem para melhorar a qualidade das relações e resolver conflitos de forma empática e respeitosa. No contexto escolar, ela transforma a forma como educadores se comunicam com estudantes e famílias.

**Os quatro componentes da CNV:**
1. **Observação** — descrever o fato sem julgamento ("Você não entregou a atividade")
2. **Sentimento** — expressar o que sente ("Estou preocupado")
3. **Necessidade** — identificar a necessidade subjacente ("Preciso que você aprenda esse conteúdo")
4. **Pedido** — fazer um pedido concreto ("Podemos conversar sobre o que está acontecendo?")

**Aplicações práticas:**
- Assembleias de classe para resolver conflitos coletivos
- Conversas individuais com estudantes em dificuldade
- Comunicação com famílias em situações delicadas
- Mediação de bullying e desentendimentos entre pares`,
  },
  {
    id: '10.7',
    icon: <Eye size={18} />,
    title: '10.7 — Reconhecimento de sinais de vulnerabilidade',
    content: `Educadores são muitas vezes os primeiros adultos a perceber mudanças de comportamento em estudantes que podem indicar situações de risco. Reconhecer esses sinais e saber o que fazer é parte do cuidado integral.

**Sinais que podem indicar vulnerabilidade:**
- Mudança súbita de comportamento (retraimento, agressividade, choro frequente)
- Queda no desempenho escolar sem causa aparente
- Ausências frequentes e não justificadas
- Marcas físicas inexplicadas
- Relato ou insinuação de situações de violência ou abuso
- Demonstração de medo ao mencionar pessoas específicas

**O que fazer ao identificar esses sinais:**
1. Não confronte diretamente nem investigue — isso é papel de profissionais especializados
2. Comunique imediatamente à coordenação pedagógica e à direção
3. Registre por escrito as observações de forma objetiva (o que você viu, quando, em que contexto)
4. Se houver suspeita de violência ou abuso, a escola tem **obrigação legal** de notificar o Conselho Tutelar (ECA, Art. 56)

**Disque 100:** Central de atendimento a violações de direitos de crianças e adolescentes.`,
  },
  {
    id: '10.8',
    icon: <Star size={18} />,
    title: '10.8 — Autocuidado do educador',
    content: `Cuidar bem dos outros começa por cuidar de si. O desgaste profissional dos educadores — síndrome de burnout, exaustão emocional — é um problema real e crescente nas redes públicas. Reconhecer os próprios limites e buscar apoio é um ato de responsabilidade, não de fraqueza.

**Sinais de esgotamento profissional:**
- Sentimento persistente de exaustão, mesmo após descanso
- Dificuldade de sentir satisfação com o trabalho
- Irritabilidade aumentada com estudantes ou colegas
- Sensação de ineficácia ("não adianta o que eu faço")
- Isolamento e dificuldade de pedir ajuda

**Estratégias de autocuidado sustentáveis:**
- Estabelecer limites de tempo (não responder mensagens profissionais fora do horário de trabalho)
- Cultivar conexões com colegas — grupos de apoio entre pares são poderosos
- Procurar supervisão ou acompanhamento psicológico quando necessário
- Praticar atividade física regular
- Reservar tempo para atividades que tragam prazer

**Para a gestão escolar:** o cuidado com a saúde mental dos educadores é uma responsabilidade institucional — não apenas individual.`,
  },
];

const quizzes = [
  {
    id: 'q1',
    question: 'O que melhor define o conceito de "clima escolar"?',
    options: [
      'A temperatura e o estado do tempo na região da escola.',
      'O conjunto de percepções, expectativas e experiências compartilhadas pela comunidade escolar.',
      'A qualidade das instalações físicas da escola.',
      'O desempenho médio dos estudantes nas avaliações externas.',
    ],
    correct: 1,
    explanation: 'Clima escolar refere-se às percepções subjetivas compartilhadas, incluindo segurança, relações, engajamento e ambiente de ensino — não às condições físicas ou resultados acadêmicos.',
  },
  {
    id: 'q2',
    question: 'De acordo com o ECA (Art. 56), quando a escola suspeita de violência ou abuso contra um estudante, o que ela deve fazer?',
    options: [
      'Esperar ter certeza absoluta antes de tomar qualquer medida.',
      'Resolver internamente sem acionar órgãos externos.',
      'Notificar o Conselho Tutelar — esta é uma obrigação legal.',
      'Comunicar apenas à família do estudante.',
    ],
    correct: 2,
    explanation: 'O ECA é claro: a escola tem obrigação legal de comunicar ao Conselho Tutelar casos de suspeita ou confirmação de violência, maus-tratos ou abuso. A notificação não é opcional.',
  },
  {
    id: 'q3',
    question: 'Quais são os quatro componentes da Comunicação Não-Violenta (CNV)?',
    options: [
      'Disciplina, respeito, obediência e cooperação.',
      'Observação, sentimento, necessidade e pedido.',
      'Empatia, diálogo, mediação e resolução.',
      'Escuta, fala, silêncio e reflexão.',
    ],
    correct: 1,
    explanation: 'A CNV de Marshall Rosenberg é estruturada em quatro etapas: (1) Observação objetiva do fato, (2) Expressão do sentimento, (3) Identificação da necessidade subjacente, (4) Pedido concreto e realizável.',
  },
];

export default function EducarParaCuidarPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-bib-xl px-6 py-10 sm:px-10 sm:py-12 bg-bib-navy">
        <span className="relative inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70">
          <BookOpen size={12} aria-hidden="true" />
          Formação de Educadores
        </span>
        <h1
          className="relative mt-4 text-2xl sm:text-3xl font-bold text-white max-w-lg"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Educar para Cuidar
        </h1>
        <p className="relative mt-2 text-sm text-white/70 max-w-xl">
          Formação em educação socioemocional e cuidado integral para educadores das redes municipais.
          Porque ensinar bem também é cuidar de quem aprende.
        </p>
      </section>

      {/* Vídeo */}
      <section>
        <h2
          className="text-lg font-bold text-bib-text-light-primary mb-4"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Vídeo de apresentação
        </h2>
        <div
          className="relative w-full rounded-bib-lg overflow-hidden bg-bib-navy shadow-bib-glass"
          style={{ paddingBottom: '56.25%' }}
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube-nocookie.com/embed/E9BMUIwXGKQ"
            title="Educar para Cuidar — Vídeo de apresentação"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <p className="mt-2 text-xs text-bib-text-light-muted flex items-center gap-1.5">
          <Play size={11} aria-hidden="true" />
          Assista ao vídeo de apresentação do programa Educar para Cuidar.
        </p>
      </section>

      {/* Seções de conteúdo */}
      <section>
        <h2
          className="text-lg font-bold text-bib-text-light-primary mb-2"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Conteúdo formativo
        </h2>
        <p className="text-sm text-bib-text-light-muted mb-5">
          Explore os temas em qualquer ordem. Cada seção traz conceitos, exemplos práticos e referências.
        </p>
        <div className="space-y-3">
          {sections.map(section => (
            <AccordionItem
              key={section.id}
              id={section.id}
              icon={section.icon}
              title={section.title}
              content={section.content}
            />
          ))}
        </div>
      </section>

      {/* Quizzes formativos */}
      <section>
        <h2
          className="text-lg font-bold text-bib-text-light-primary mb-2"
          style={{ fontFamily: 'var(--font-bib-display)' }}
        >
          Quiz formativo
        </h2>
        <p className="text-sm text-bib-text-light-muted mb-5">
          Verifique sua compreensão dos conceitos principais. As respostas são exibidas após a seleção.
        </p>
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* CTA IA */}
      <section
        className="rounded-bib-lg p-6 border border-bib-teal/20 bg-bib-teal/5"
      >
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
              Aprofunde com a IA Eleva+
            </h3>
            <p className="mt-1 text-sm text-bib-text-light-muted">
              A IA Eleva+ pode ajudar com situações socioemocionais concretas da sua sala de aula,
              planejamento de atividades e apoio a estudantes que precisam de cuidado especial.
            </p>
            <Link
              href="/biblioteca/ia/socioemocional"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-bib-teal hover:text-bib-blue transition-colors"
            >
              Abrir consultoria socioemocional
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Quiz card — server component with static correct answer reveal via CSS
function QuizCard({ quiz }: {
  quiz: { id: string; question: string; options: string[]; correct: number; explanation: string };
}) {
  return (
    <div className="bg-white rounded-bib-md border border-bib-border-light p-5 shadow-sm">
      <p className="text-sm font-medium text-bib-text-light-primary mb-4">{quiz.question}</p>
      <QuizOptions quiz={quiz} />
    </div>
  );
}

// Needs to be a client sub-component for interactivity
import { QuizOptions } from './QuizOptions';
