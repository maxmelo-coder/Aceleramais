import { FileText, AlertTriangle, ChevronRight } from 'lucide-react';
import { ChatInterface } from '@/components/library/ia/ChatInterface';

export const metadata = {
  title: 'Construtor de PEI — IA Eleva+',
};

const PEI_STAGES = [
  { num: 1, label: 'Identificação e contexto' },
  { num: 2, label: 'Participação e pertencimento' },
  { num: 3, label: 'Perfil pedagógico (potencialidades)' },
  { num: 4, label: 'Barreiras de aprendizagem' },
  { num: 5, label: 'Objetivos e metas pedagógicas' },
  { num: 6, label: 'Recursos de acessibilidade' },
  { num: 7, label: 'Articulação com o AEE' },
  { num: 8, label: 'Avaliação e revisão' },
];

const INITIAL_MESSAGE = `Olá! Sou a IA Eleva+, seu apoio para construir o Plano Educacional Individualizado (PEI).

Vamos trabalhar juntos pelas 8 etapas do PEI, sempre começando pelas **potencialidades** do estudante — nunca pelas limitações.

📌 **Importante antes de começar:**
- Não inclua o nome completo do estudante nesta conversa — use uma referência interna (ex: "Estudante A" ou um código interno da escola).
- O laudo médico **não é requisito** para iniciar o PEI.
- Todo rascunho gerado aqui precisa de revisão e aprovação humana antes de ser considerado final.

Para começar, me conte:
1. Qual é a etapa de ensino (Educação Infantil, Ensino Fundamental I, II ou Ensino Médio)?
2. Quais são as principais potencialidades e interesses que você observa neste estudante?`;

export default function PEIPage() {
  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-8">
      {/* Main content */}
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-bib-sm flex items-center justify-center text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
            aria-hidden="true"
          >
            <FileText size={20} />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-bib-text-light-primary"
              style={{ fontFamily: 'var(--font-bib-display)' }}
            >
              Construtor de PEI
            </h1>
            <p className="text-sm text-bib-text-light-muted">
              Plano Educacional Individualizado — Portaria MEC nº 421/2026, LBI e Lei 12.764/2012
            </p>
          </div>
        </div>

        {/* Aviso de rascunho */}
        <div className="flex items-start gap-3 px-4 py-3 mb-6 bg-amber-50 border border-amber-200 rounded-bib-md text-xs text-amber-800">
          <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
          <p>
            <strong>Aviso:</strong> O PEI gerado pela IA é um <strong>rascunho</strong> — toda seção exige
            revisão e aprovação humana antes de ser considerada final. Não inclua o nome completo
            do estudante nesta conversa.
          </p>
        </div>

        <ChatInterface
          mode="pei"
          placeholder="Descreva o estudante, suas potencialidades, o contexto da escola..."
          initialSystemMessage={INITIAL_MESSAGE}
        />
      </div>

      {/* Sidebar — etapas do PEI */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 bg-white rounded-bib-md border border-bib-border-light p-5 shadow-sm">
          <h2
            className="text-sm font-bold text-bib-text-light-primary mb-4"
            style={{ fontFamily: 'var(--font-bib-display)' }}
          >
            Etapas do PEI
          </h2>
          <ol className="space-y-2">
            {PEI_STAGES.map(stage => (
              <li key={stage.num} className="flex items-start gap-2.5 text-xs text-bib-text-light-muted">
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
                >
                  {stage.num}
                </span>
                <span className="leading-relaxed pt-0.5">{stage.label}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 pt-4 border-t border-bib-border-light space-y-2 text-xs text-bib-text-light-muted">
            <div className="flex items-center gap-1.5">
              <ChevronRight size={11} aria-hidden="true" />
              <span>Portaria MEC nº 421/2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ChevronRight size={11} aria-hidden="true" />
              <span>LBI — Lei 13.146/2015</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ChevronRight size={11} aria-hidden="true" />
              <span>Lei 12.764/2012</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
