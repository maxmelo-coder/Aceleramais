import { Search, Info } from 'lucide-react';
import { ChatInterface } from '@/components/library/ia/ChatInterface';

export const metadata = {
  title: 'Estudo de Caso Pedagógico — IA Eleva+',
};

const INITIAL_MESSAGE = `Olá! Sou a IA Eleva+ no modo **Estudo de Caso Pedagógico**.

Aqui organizamos juntos observações pedagógicas de forma colaborativa e contextual, com foco nas potencialidades, interesses e participação do estudante.

⚠️ **O que este modo faz:**
- Organiza e estrutura observações que você já fez em sala de aula
- Identifica padrões de participação, comunicação e aprendizagem
- Sugere estratégias pedagógicas fundamentadas
- Pode oferecer "Transformar em rascunho de PEI" ao final

⚠️ **O que este modo não faz:**
- Não utiliza escalas clínicas
- Não gera hipótese diagnóstica
- Não substitui avaliação psicológica ou médica

📌 Para começar, me conte sobre o estudante que você quer discutir — lembre-se de usar uma referência interna, sem incluir o nome completo. O que você tem observado?`;

export default function EstudoDeCasoPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #13A4CC, #009CA4)' }}
          aria-hidden="true"
        >
          <Search size={20} />
        </div>
        <div>
          <h1
            className="text-xl font-bold text-bib-text-light-primary"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            Estudo de Caso Pedagógico
          </h1>
          <p className="text-sm text-bib-text-light-muted">
            Organização colaborativa de observações pedagógicas — sem hipóteses diagnósticas
          </p>
        </div>
      </div>

      {/* Explicação */}
      <div className="flex items-start gap-3 px-4 py-3 mb-6 bg-bib-blue/5 border border-bib-blue/20 rounded-bib-md text-xs text-bib-text-light-secondary">
        <Info size={15} className="shrink-0 mt-0.5 text-bib-blue" aria-hidden="true" />
        <div className="space-y-1">
          <p>
            <strong>Como usar:</strong> compartilhe observações que você já fez em sala de aula —
            comportamentos, participação, comunicação, interesses, dificuldades e estratégias que
            funcionaram. A IA ajuda a estruturar essas informações de forma pedagógica.
          </p>
          <p>
            <strong>Nenhuma escala clínica é utilizada.</strong> O resultado é sempre pedagógico,
            nunca diagnóstico. Não inclua o nome completo do estudante.
          </p>
        </div>
      </div>

      <ChatInterface
        mode="estudo-caso"
        placeholder="Descreva suas observações sobre o estudante: participação, comunicação, interesses..."
        initialSystemMessage={INITIAL_MESSAGE}
      />
    </div>
  );
}
