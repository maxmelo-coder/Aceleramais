import { Layers, Info } from 'lucide-react';
import { ChatInterface } from '@/components/library/ia/ChatInterface';

export const metadata = {
  title: 'Percurso Letivo — IA Eleva+',
};

const INITIAL_MESSAGE = `Olá! Sou a IA Eleva+ no modo **Planejador do Percurso Letivo**.

Estou aqui para ajudar a organizar o planejamento do ano letivo de forma equilibrada e intencional.

Posso ajudar com:
- Distribuição de unidades temáticas ao longo do ano
- Mapeamento de habilidades da BNCC por bimestre/trimestre
- Identificação de períodos com excesso de avaliações ou conteúdo
- Programação de projetos interdisciplinares
- Previsão de intervenções pedagógicas
- Revisão de habilidades não contempladas

⚠️ Apresentarei **alertas e sugestões** — as decisões são sempre suas. A IA nunca reorganiza automaticamente seu planejamento.

Para começar, me conte:
1. Qual etapa e componente curricular você está planejando?
2. Qual é o regime (semestral, bimestral, trimestral, anual)?
3. Você já tem um esboço do planejamento que gostaria de revisar, ou está começando do zero?`;

export default function PercursoLetivoPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white bg-bib-teal shrink-0"
          aria-hidden="true"
        >
          <Layers size={20} />
        </div>
        <div>
          <h1
            className="text-xl font-bold text-bib-text-light-primary"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            Percurso Letivo
          </h1>
          <p className="text-sm text-bib-text-light-muted">
            Planejamento do ano letivo: unidades, habilidades, projetos, avaliações e intervenções
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 px-4 py-3 mb-6 bg-violet-50 border border-violet-200 rounded-bib-md text-xs text-violet-800">
        <Info size={15} className="shrink-0 mt-0.5 text-violet-600" aria-hidden="true" />
        <div className="space-y-1">
          <p>
            <strong>Planejamento de médio e longo prazo.</strong> A IA identifica desequilíbrios,
            habilidades não cobertas e períodos sobrecarregados, apresentando alertas para sua análise.
          </p>
          <p>
            As decisões finais sobre reorganização do planejamento são sempre do educador.
          </p>
        </div>
      </div>

      <ChatInterface
        mode="percurso-letivo"
        placeholder="Descreva seu planejamento atual ou o que você quer organizar para o ano letivo..."
        initialSystemMessage={INITIAL_MESSAGE}
      />
    </div>
  );
}
