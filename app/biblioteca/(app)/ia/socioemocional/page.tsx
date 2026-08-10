import { Heart, AlertOctagon } from 'lucide-react';
import { ChatInterface } from '@/components/library/ia/ChatInterface';

export const metadata = {
  title: 'Consultoria Socioemocional — IA Eleva+',
};

const INITIAL_MESSAGE = `Olá! Sou a IA Eleva+ no modo **Consultoria Socioemocional**.

Estou aqui para apoiar você, educador(a), diante de situações socioemocionais desafiadoras em sala de aula.

Para cada situação que você me descrever, vou estruturar minha resposta em:
1. Compreensão pedagógica da situação
2. Perguntas de reflexão para você
3. Ações imediatas possíveis
4. Estratégias para a aula
5. Atividade socioemocional sugerida
6. Formas de comunicação com a família
7. Sugestões de acompanhamento
8. Sinais que indicam necessidade de ajuda especializada
9. Fontes e referências

⚠️ **Se você estiver diante de uma situação que envolva sinais de violência, abuso ou risco à integridade do estudante, me informe imediatamente — apresentarei o protocolo de proteção.**

Me conta o que está acontecendo em sala de aula.`;

export default function SocioemocionalPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white bg-bib-orange shrink-0"
          aria-hidden="true"
        >
          <Heart size={20} />
        </div>
        <div>
          <h1
            className="text-xl font-bold text-bib-text-light-primary"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            Consultoria Socioemocional
          </h1>
          <p className="text-sm text-bib-text-light-muted">
            Apoio pedagógico para situações socioemocionais em sala de aula
          </p>
        </div>
      </div>

      {/* Aviso de proteção */}
      <div className="flex items-start gap-3 px-4 py-4 mb-6 bg-red-50 border border-red-200 rounded-bib-md">
        <AlertOctagon size={16} className="shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
        <div className="text-xs text-red-800 space-y-1">
          <p className="font-semibold">Protocolo de Proteção</p>
          <p>
            Se você identificar sinais de violência doméstica, abuso sexual, negligência grave ou
            risco à integridade física ou emocional do estudante, <strong>não espere</strong> — acione
            imediatamente o Conselho Tutelar (pelo Disque 100 ou presencialmente), a direção da escola
            e o sistema de proteção da sua rede municipal.
          </p>
          <p>
            Informe a situação à IA e ela apresentará o painel de orientações do protocolo institucional.
          </p>
        </div>
      </div>

      <ChatInterface
        mode="socioemocional"
        placeholder="Descreva a situação socioemocional que você está enfrentando em sala de aula..."
        initialSystemMessage={INITIAL_MESSAGE}
      />
    </div>
  );
}
