'use client';

import { useState, useRef, useEffect } from 'react';
import { SafetyBanner } from './SafetyBanner';
import type { AIMessage } from '@/lib/library/ai/types';

interface ChatInterfaceProps {
  mode: string;
  placeholder?: string;
  initialSystemMessage?: string;
}

export function ChatInterface({ mode, placeholder = 'Escreva sua pergunta aqui...', initialSystemMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialSystemMessage && messages.length === 0) {
      setMessages([{ role: 'assistant', content: initialSystemMessage }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSystemMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages: AIMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/biblioteca/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Erro ${res.status}`);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content, sources: data.sources }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao conectar com a IA Eleva+');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <SafetyBanner />

      <div
        className="flex-1 overflow-y-auto py-4 space-y-4 mt-4"
        role="log"
        aria-live="polite"
        aria-label="Conversa com a IA Eleva+"
      >
        {messages.length === 0 && (
          <p className="text-center text-sm text-bib-text-light-muted py-12">
            Inicie a conversa enviando uma mensagem.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
                aria-hidden="true"
              >
                IA
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-bib-md px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-bib-navy text-white ml-auto'
                  : 'bg-white border border-bib-border-light text-bib-text-light-primary shadow-sm'
              }`}
            >
              {msg.content}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-bib-border-light space-y-1">
                  <p className="text-xs font-semibold text-bib-text-light-muted">Fontes:</p>
                  {msg.sources.map((s, si) => (
                    <div key={si} className="text-xs text-bib-text-light-muted">
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-bib-teal hover:underline">
                          {s.title}
                        </a>
                      ) : s.title} — {s.institution}{s.year ? ` (${s.year})` : ''}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-bib-gray-bg border border-bib-border-light text-bib-text-light-muted text-xs"
                aria-hidden="true"
              >
                Eu
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
            >
              IA
            </div>
            <div className="bg-white border border-bib-border-light rounded-bib-md px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-bib-teal animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-bib-teal animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-bib-teal animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-bib-md text-sm text-red-700">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 border border-bib-border-light rounded-bib-md bg-white shadow-sm focus-within:ring-2 focus-within:ring-bib-teal/40 transition-shadow">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          disabled={loading}
          aria-label="Mensagem para a IA Eleva+"
          className="w-full px-4 pt-3 pb-2 text-sm text-bib-text-light-primary placeholder:text-bib-text-light-muted bg-transparent resize-none focus:outline-none disabled:opacity-50"
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <p className="text-xs text-bib-text-light-muted">Enter para enviar · Shift+Enter para nova linha</p>
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-bib-sm text-sm font-medium text-white transition-opacity disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #009CA4, #13A4CC)' }}
          >
            {loading ? 'Aguarde…' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}
