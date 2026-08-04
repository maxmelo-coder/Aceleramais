# Plano de Implementação — IA Eleva+

## Visão Geral

A IA Eleva+ é um assistente pedagógico integrado à Biblioteca Digital,
exclusivo para educadores das redes municipais autenticadas.
Não realiza diagnósticos, não emite laudos, não prescreve medicamentos.

---

## Fase 1 — Fundação técnica e segurança (concluída)

- [x] Instalar `@anthropic-ai/sdk`
- [x] Criar camada de serviço desacoplada em `lib/library/ai/`
  - `types.ts` — interfaces compartilhadas
  - `guardrails.ts` — bloqueio de solicitações fora do escopo pedagógico
  - `redactor.ts` — redação automática de dados pessoais antes de enviar à IA
  - `prompts.ts` — system prompts por modo + disclaimer obrigatório
  - `provider.ts` — integração Anthropic (server-only)
  - `logger.ts` — log de uso (auditoria, custo, compliance)
  - `index.ts` — barrel export
- [x] Criar migração Supabase com 5 novas tabelas + RLS
- [x] Criar API Route `/api/biblioteca/ia/chat` (autenticada, com guardrails)
- [x] Documentar variáveis de ambiente (`.env.example`)

## Fase 2 — Componentes de UI (concluída)

- [x] `SafetyBanner` — aviso sempre visível sobre limitações da IA
- [x] `ModeCard` — card de seleção de modo com ícone e descrição
- [x] `ChatInterface` — interface de chat client-side (streaming futuro)
- [x] `AIFloatingButton` — acesso rápido flutuante em todas as páginas

## Fase 3 — Páginas da IA Eleva+ (concluída)

- [x] `/biblioteca/ia` — hub com 8 modos
- [x] `/biblioteca/ia/pei` — construtor de PEI
- [x] `/biblioteca/ia/estudo-de-caso` — estudo de caso pedagógico
- [x] `/biblioteca/ia/socioemocional` — consultoria socioemocional
- [x] `/biblioteca/ia/planejamento` — planejador de aulas com pré-formulário
- [x] `/biblioteca/ia/percurso-letivo` — planejador do percurso letivo

## Fase 4 — Novas áreas de conteúdo (concluída)

- [x] `/biblioteca/educar-para-cuidar` — área temática com vídeo, quizzes e conteúdo
- [x] `/biblioteca/autismo` — área com 5 abas (Formação, Sala de Aula, PEI, Recursos, Suporte)

## Fase 5 — Integração na navegação (concluída)

- [x] Atualizar `AppHeader` — adicionar IA Eleva+, Educar para Cuidar, Autismo ao `navLinks`
- [x] Atualizar `layout.tsx` da área autenticada — adicionar `AIFloatingButton`

---

## Modos da IA Eleva+

| Modo | Rota | Descrição |
|------|------|-----------|
| PEI | `/ia/pei` | Construtor de Plano Educacional Individualizado |
| Estudo de Caso | `/ia/estudo-de-caso` | Organização colaborativa de observações pedagógicas |
| Socioemocional | `/ia/socioemocional` | Consultoria para situações socioemorionais em sala |
| Planejamento | `/ia/planejamento` | Geração de planos de aula alinhados à BNCC |
| Percurso Letivo | `/ia/percurso-letivo` | Planejamento do ano letivo completo |
| Autismo | `mode=autismo` | Estratégias para estudantes autistas |
| Materiais | `mode=materiais` | Criação de materiais pedagógicos |
| Adaptação | `mode=adaptacao` | Adaptação de atividades (princípios DUA) |

---

## Próximos Passos (backlog)

- [ ] Streaming de respostas (SSE / ReadableStream) para melhor UX
- [ ] Salvar conversas no Supabase (`ia_conversations` + `ia_messages`)
- [ ] Exportar PEI rascunho como PDF
- [ ] Dashboard de uso da IA no admin
- [ ] Feedback do educador por resposta (👍/👎)
- [ ] Rate limiting por município
- [ ] Integração da tabela `ia_usage_logs` com Supabase (atualmente só console.log)
