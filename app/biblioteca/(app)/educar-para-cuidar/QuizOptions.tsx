'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizOptionsProps {
  quiz: { id: string; options: string[]; correct: number; explanation: string };
}

export function QuizOptions({ quiz }: QuizOptionsProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {quiz.options.map((option, i) => {
        const isSelected = selected === i;
        const isCorrect = i === quiz.correct;
        const showResult = selected !== null;

        let borderColor = 'border-bib-border-light';
        let bgColor = 'bg-white hover:bg-bib-gray-bg/60';
        let textColor = 'text-bib-text-light-secondary';

        if (showResult) {
          if (isCorrect) {
            borderColor = 'border-green-300';
            bgColor = 'bg-green-50';
            textColor = 'text-green-800';
          } else if (isSelected && !isCorrect) {
            borderColor = 'border-red-300';
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
          }
        }

        return (
          <button
            key={i}
            type="button"
            disabled={selected !== null}
            onClick={() => setSelected(i)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-bib-sm border text-sm text-left transition-colors ${borderColor} ${bgColor} ${textColor} disabled:cursor-default`}
          >
            <span className="shrink-0">
              {showResult && isCorrect ? (
                <CheckCircle size={16} className="text-green-600" aria-hidden="true" />
              ) : showResult && isSelected && !isCorrect ? (
                <XCircle size={16} className="text-red-500" aria-hidden="true" />
              ) : (
                <span
                  className={`w-4 h-4 rounded-full border-2 inline-block ${isSelected ? 'border-bib-teal bg-bib-teal' : 'border-bib-border-light'}`}
                />
              )}
            </span>
            {option}
          </button>
        );
      })}
      {selected !== null && (
        <div className="mt-3 px-4 py-3 bg-bib-gray-bg rounded-bib-sm text-xs text-bib-text-light-secondary leading-relaxed border border-bib-border-light">
          <strong className="text-bib-text-light-primary">Explicação: </strong>
          {quiz.explanation}
        </div>
      )}
    </div>
  );
}
