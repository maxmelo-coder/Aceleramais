'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, School, FileText, Library, HeartHandshake, ArrowRight } from 'lucide-react';

const TABS = [
  { id: 'formacao', label: 'Formação', icon: <GraduationCap size={16} /> },
  { id: 'sala', label: 'Sala de Aula', icon: <School size={16} /> },
  { id: 'pei', label: 'PEI e Adaptações', icon: <FileText size={16} /> },
  { id: 'recursos', label: 'Recursos', icon: <Library size={16} /> },
  { id: 'suporte', label: 'Suporte', icon: <HeartHandshake size={16} /> },
];

const TAB_CONTENT: Record<string, React.ReactNode> = {
  formacao: (
    <div className="space-y-5 text-sm text-bib-text-light-secondary leading-relaxed">
      <h3 className="text-base font-bold text-bib-text-light-primary" style={{ fontFamily: 'var(--font-bib-display)' }}>
        Formação em Autismo para Educadores
      </h3>
      <p>
        Compreender o autismo a partir de uma perspectiva educacional e humanizada é o primeiro passo
        para uma inclusão de qualidade. O autismo (Transtorno do Espectro Autista — TEA) é caracterizado
        por variações na comunicação social e padrões de comportamento — mas cada pessoa autista
        tem um perfil completamente único.
      </p>
      <div>
        <p className="font-semibold text-bib-text-light-primary mb-2">O que todo educador deve saber:</p>
        <ul className="space-y-2">
          {[
            'O autismo não é uma doença — é uma forma de neurodiversidade.',
            'Estudantes autistas têm potencialidades, interesses e talentos únicos.',
            'A comunicação pode ser verbal, não-verbal, aumentativa ou alternativa (CAA) — todas são válidas.',
            'Sensibilidades sensoriais são reais e podem impactar significativamente a aprendizagem.',
            'O ambiente da sala de aula pode ser adaptado para reduzir barreiras sensoriais.',
            'Laudo diagnóstico não é requisito para iniciar adaptações pedagógicas.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bib-teal shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-3 bg-bib-blue/5 border border-bib-blue/20 rounded-bib-md text-xs">
        <p className="font-semibold text-bib-text-light-primary mb-1">Base legal</p>
        <p>Lei 12.764/2012 (Lei Berenice Piana) — institui a Política Nacional de Proteção dos Direitos da Pessoa com Transtorno do Espectro Autista.</p>
        <p className="mt-1">LBI — Lei 13.146/2015, Art. 28: garante sistemas educacionais inclusivos em todos os níveis de ensino.</p>
      </div>
    </div>
  ),

  sala: (
    <div className="space-y-5 text-sm text-bib-text-light-secondary leading-relaxed">
      <h3 className="text-base font-bold text-bib-text-light-primary" style={{ fontFamily: 'var(--font-bib-display)' }}>
        Estratégias para a Sala de Aula
      </h3>
      <p>
        Não existe uma receita única. Antes de aplicar qualquer estratégia, conheça o estudante:
        seus interesses, preferências, formas de comunicação, perfil sensorial e o que já funciona bem.
      </p>
      <div>
        <p className="font-semibold text-bib-text-light-primary mb-2">Estrutura e previsibilidade:</p>
        <ul className="space-y-1.5">
          {[
            'Rotinas visuais — quadros de agenda com imagens ou símbolos',
            'Aviso antecipado sobre mudanças de rotina',
            'Tempo extra para transições entre atividades',
            'Instruções claras, objetivas e em partes menores',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bib-teal shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-semibold text-bib-text-light-primary mb-2">Comunicação:</p>
        <ul className="space-y-1.5">
          {[
            'Linguagem direta e literal — evitar ironias, metáforas ambíguas ou duplos sentidos',
            'Tempo de processamento — aguardar a resposta sem pressionar',
            'Oferecer alternativas de resposta: fala, escrita, imagem, gestos',
            'CAA (Comunicação Aumentativa e Alternativa) quando necessário',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bib-teal shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-semibold text-bib-text-light-primary mb-2">Ambiente sensorial:</p>
        <ul className="space-y-1.5">
          {[
            'Reduzir ruído excessivo quando possível (avisar sobre eventos barulhentos com antecedência)',
            'Oferecer opção de assento com menos estímulos visuais laterais se necessário',
            'Permitir objetos de regulação sensorial (fidgets) quando não atrapalhem os outros',
            'Iluminação — algumas crianças são sensíveis a luz fluorescente',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bib-teal shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Link
        href="/biblioteca/ia?mode=autismo"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-bib-teal hover:text-bib-blue transition-colors"
      >
        Pedir estratégias personalizadas para seu estudante na IA Eleva+
        <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </div>
  ),

  pei: (
    <div className="space-y-5 text-sm text-bib-text-light-secondary leading-relaxed">
      <h3 className="text-base font-bold text-bib-text-light-primary" style={{ fontFamily: 'var(--font-bib-display)' }}>
        PEI e Adaptações Curriculares
      </h3>
      <p>
        O Plano Educacional Individualizado (PEI) é o principal instrumento de planejamento para
        estudantes com deficiência ou TEA. Ele não é um formulário burocrático — é um compromisso
        pedagógico construído colaborativamente entre educadores, famílias e, quando possível, o próprio estudante.
      </p>
      <div>
        <p className="font-semibold text-bib-text-light-primary mb-2">Adaptações curriculares para estudantes autistas:</p>
        <ul className="space-y-2">
          {[
            'Adaptar o formato das atividades mantendo o objetivo pedagógico (ex: responder oralmente em vez de escrever)',
            'Usar os interesses do estudante como gancho para o conteúdo',
            'Dividir tarefas complexas em etapas menores e sequenciadas',
            'Ampliar o tempo para realização de atividades e provas quando necessário',
            'Usar suportes visuais: imagens, diagramas, mapas mentais',
            'Oferecer feedback imediato e específico',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bib-teal shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-bib-md text-xs text-amber-800">
        <p className="font-semibold mb-1">Lembrete importante</p>
        <p>O PEI é um documento vivo — deve ser revisado periodicamente (recomenda-se ao menos a cada semestre) e sempre que houver mudanças significativas no desenvolvimento do estudante.</p>
      </div>
      <Link
        href="/biblioteca/ia/pei"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-bib-teal hover:text-bib-blue transition-colors"
      >
        Construir ou revisar um PEI com a IA Eleva+
        <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </div>
  ),

  recursos: (
    <div className="space-y-5 text-sm text-bib-text-light-secondary leading-relaxed">
      <h3 className="text-base font-bold text-bib-text-light-primary" style={{ fontFamily: 'var(--font-bib-display)' }}>
        Recursos e Referências
      </h3>
      <p>
        Selecionar boas fontes de informação é essencial para uma prática pedagógica embasada e ética.
        Abaixo, recursos públicos e de qualidade comprovada.
      </p>
      <div className="space-y-3">
        {[
          {
            title: 'Instituto Rodrigo Mendes — Diversa',
            url: 'https://diversa.org.br',
            description: 'Plataforma de educação inclusiva com artigos, práticas e formação para educadores.',
          },
          {
            title: 'MEC — Política Nacional de Educação Especial na Perspectiva da Educação Inclusiva',
            url: 'https://portal.mec.gov.br',
            description: 'Documento base da política de inclusão do MEC.',
          },
          {
            title: 'CAST — Universal Design for Learning',
            url: 'https://udlguidelines.cast.org',
            description: 'Diretrizes do DUA para adaptar o ensino a todos os estudantes (em inglês).',
          },
          {
            title: 'Autismo e Realidade',
            url: 'https://autismoerealidade.org.br',
            description: 'Informações baseadas em evidências para famílias e educadores.',
          },
          {
            title: 'Lei 12.764/2012 — Lei Berenice Piana (Planalto)',
            url: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12764.htm',
            description: 'Texto integral da Lei de Proteção dos Direitos da Pessoa com TEA.',
          },
        ].map((resource, i) => (
          <a
            key={i}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white rounded-bib-sm border border-bib-border-light hover:border-bib-teal/30 hover:shadow-sm transition-all group"
          >
            <p className="font-medium text-bib-teal group-hover:underline text-sm">{resource.title}</p>
            <p className="mt-0.5 text-xs text-bib-text-light-muted">{resource.description}</p>
            <p className="mt-1 text-xs text-bib-text-light-muted/70">{resource.url}</p>
          </a>
        ))}
      </div>
    </div>
  ),

  suporte: (
    <div className="space-y-5 text-sm text-bib-text-light-secondary leading-relaxed">
      <h3 className="text-base font-bold text-bib-text-light-primary" style={{ fontFamily: 'var(--font-bib-display)' }}>
        Suporte à Família e à Rede
      </h3>
      <p>
        A inclusão de qualidade é um trabalho em rede. Educadores, equipe pedagógica, AEE, família,
        saúde e assistência social precisam dialogar de forma integrada para apoiar o desenvolvimento
        pleno do estudante.
      </p>
      <div>
        <p className="font-semibold text-bib-text-light-primary mb-2">Articulação com o AEE:</p>
        <ul className="space-y-1.5">
          {[
            'O AEE (Atendimento Educacional Especializado) é complementar — não substitui a sala regular',
            'Compartilhar com o professor do AEE as observações pedagógicas do cotidiano',
            'Construir o PEI de forma conjunta com o professor do AEE',
            'Usar os recursos e estratégias do AEE também na sala regular',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bib-teal shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-semibold text-bib-text-light-primary mb-2">Comunicação com a família:</p>
        <ul className="space-y-1.5">
          {[
            'Agendar reuniões regulares — não apenas quando há problemas',
            'Compartilhar avanços e potencialidades, não só dificuldades',
            'Respeitar o tempo de adaptação da família ao diagnóstico (se recente)',
            'Escutar o que a família observa em casa — ela conhece o estudante melhor do que ninguém',
            'Ser cuidadoso com o vocabulário: não use termos clínicos sem explicação',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-bib-teal shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 py-3 bg-bib-teal/5 border border-bib-teal/20 rounded-bib-md text-xs">
        <p className="font-semibold text-bib-text-light-primary mb-1">Serviços de apoio</p>
        <p>CRAS, CREAS, CAPS Infância e Adolescência, Conselho Tutelar e equipes de saúde da família podem ser parceiros fundamentais no suporte integral ao estudante autista.</p>
      </div>
    </div>
  ),
};

export function AutismoTabs() {
  const [active, setActive] = useState('formacao');

  return (
    <section>
      <div className="border-b border-bib-border-light overflow-x-auto">
        <div className="flex gap-1 pb-px min-w-max">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              aria-selected={active === tab.id}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bib-teal/50 ${
                active === tab.id
                  ? 'text-bib-navy'
                  : 'text-bib-text-light-muted hover:text-bib-text-light-primary'
              }`}
            >
              {tab.icon}
              {tab.label}
              {active === tab.id && (
                <span className="absolute left-4 right-4 -bottom-px h-[2px] rounded-full bg-bib-teal" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {TAB_CONTENT[active]}
      </div>
    </section>
  );
}
