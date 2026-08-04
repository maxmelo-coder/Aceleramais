# Auditoria Técnica — IA Eleva+

## Stack

- **Framework**: Next.js 16.2.6 (App Router, React Server Components)
- **Runtime**: React 19.2.4
- **Linguagem**: TypeScript ^5
- **Estilização**: Tailwind CSS v4 (tokens `bib-*` definidos em `app/biblioteca/admin/admin-theme.css` e `app/biblioteca/library-theme.css`)
- **Animações**: framer-motion ^12
- **Ícones**: lucide-react ^1.28
- **Deploy**: Vercel

## Autenticação e Segurança

- **Auth**: Supabase Auth via `@supabase/ssr` ^0.12.4 — cookie-based, SSR-compatible
- **Sessão**: Gerenciada por `middleware.ts` — renova o token em cada request protegido
- **RLS**: Row Level Security habilitado em todas as tabelas sensíveis; o cliente do servidor (`lib/supabase/server.ts`) autentica como o usuário da sessão, nunca bypassa políticas
- **Multi-tenant**: Isolamento por `municipality_id` (= `auth.users.id` do login do município)

## Banco de Dados

- **Banco**: Supabase/PostgreSQL (sem ORM — raw `supabase-js` queries)
- **Tabelas existentes**: `library_profiles`, `library_programs`, `library_books`, `library_book_access_logs`
- **Tabelas novas (IA Eleva+)**: `ia_conversations`, `ia_messages`, `ia_pei`, `ia_lesson_plans`, `ia_usage_logs`

## Storage

- Supabase Storage (PDFs, imagens de capa dos livros)

## AI (novo)

- **Provider**: Anthropic Claude via `@anthropic-ai/sdk` ^0.115.0
- **Modelo padrão**: `claude-3-5-haiku-20241022` (configurável via `IA_ELEVA_MODEL`)
- **Camada de serviço**: `lib/library/ai/` (provider, guardrails, redactor, prompts, logger)
- **API Route**: `app/api/biblioteca/ia/chat/route.ts` (requer autenticação Supabase)

## Rotas Existentes

| Rota | Descrição |
|------|-----------|
| `/biblioteca` | Home — continuar leitura, novidades, programas |
| `/biblioteca/livro/[id]` | Detalhe do livro |
| `/biblioteca/livro/[id]/ler` | Leitor FlipBook |
| `/biblioteca/programa/[slug]` | Página do programa |
| `/biblioteca/admin/` | Dashboard administrativo |
| `/biblioteca/admin/livros/[id]` | Editar livro |
| `/biblioteca/admin/municipios` | Gestão de municípios |
| `/biblioteca/admin/upload` | Upload de conteúdo |
| `/biblioteca/admin/analytics/[bookId]` | Analytics por livro |
| `/biblioteca/login` | Login do município |

## Rotas Novas (IA Eleva+)

| Rota | Descrição |
|------|-----------|
| `/biblioteca/ia` | Hub da IA Eleva+ (8 modos) |
| `/biblioteca/ia/pei` | Construtor de PEI |
| `/biblioteca/ia/estudo-de-caso` | Estudo de Caso Pedagógico |
| `/biblioteca/ia/socioemocional` | Consultoria Socioemocional |
| `/biblioteca/ia/planejamento` | Planejador de Aulas |
| `/biblioteca/ia/percurso-letivo` | Percurso Letivo |
| `/biblioteca/educar-para-cuidar` | Área Educar para Cuidar |
| `/biblioteca/autismo` | Área Autismo e Neurodiversidade |
| `/api/biblioteca/ia/chat` | API Route — chat com a IA |

## Componentes Reutilizáveis Existentes

- `AppHeader` — cabeçalho sticky com nav, busca, drawer mobile
- `BookCard` — card de livro com capa, título, autor
- `BookDetailCover` — capa do livro na página de detalhe
- `ElevaWordmark` — logotipo SVG da Eleva+
- `FlipbookViewer` — visualizador FlipBook (PDF)
- `ProgramBookGrid` — grid de livros de um programa

## Componentes Novos (IA Eleva+)

- `components/library/ia/SafetyBanner` — aviso obrigatório de limitações da IA
- `components/library/ia/ModeCard` — card de modo de IA (link com ícone)
- `components/library/ia/ChatInterface` — interface de chat client-side
- `components/library/ia/AIFloatingButton` — botão flutuante de acesso rápido

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave anon pública do Supabase |
| `ANTHROPIC_API_KEY` | Para IA | Chave da API Anthropic |
| `IA_ELEVA_MODEL` | Não | Override do modelo (padrão: `claude-3-5-haiku-20241022`) |
