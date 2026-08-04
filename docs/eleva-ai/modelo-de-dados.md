# Modelo de Dados — IA Eleva+

## Tabelas Novas

### `ia_conversations`

Armazena uma conversa por sessão/modo. Cada município pode ter várias conversas.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PK | Identificador |
| `municipality_id` | `uuid` FK → `auth.users(id)` | Município dono da conversa |
| `mode` | `text` | Modo da IA: `pei`, `estudo-caso`, `planejamento`, etc. |
| `title` | `text` | Título gerado ou digitado pelo usuário |
| `created_at` | `timestamptz` | Criação |
| `updated_at` | `timestamptz` | Última atualização |

**RLS**: município vê apenas suas próprias conversas.

---

### `ia_messages`

Mensagens de uma conversa.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PK | Identificador |
| `conversation_id` | `uuid` FK → `ia_conversations(id)` | Conversa pai |
| `role` | `text` | `user` ou `assistant` |
| `content` | `text` | Conteúdo da mensagem |
| `sources` | `jsonb` | Array de `{title, institution, year, url, excerpt}` |
| `was_redacted` | `boolean` | Se dados pessoais foram removidos antes de enviar à IA |
| `created_at` | `timestamptz` | Criação |

**RLS**: acesso via `conversation_id` que pertence ao município.

---

### `ia_pei`

Planos Educacionais Individualizados rascunhados com apoio da IA.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PK | Identificador |
| `municipality_id` | `uuid` FK | Município |
| `student_ref` | `text` | Referência interna — **NUNCA** o nome real do estudante |
| `school` | `text` | Escola |
| `etapa` | `text` | Etapa de ensino |
| `turma` | `text` | Turma |
| `periodo_letivo` | `text` | Ex: `2025` |
| `elaboracao_date` | `date` | Data de elaboração |
| `revisao_date` | `date` | Data prevista de revisão |
| `status` | `text` | `rascunho` → `em_revisao` → `aprovado` → `arquivado` |
| `sections` | `jsonb` | Array de seções do PEI geradas |
| `version` | `integer` | Versão do documento |
| `created_by` | `uuid` FK | Usuário que criou |
| `reviewed_by` | `uuid` FK | Usuário que aprovou |
| `reviewed_at` | `timestamptz` | Data de aprovação |

**LGPD**: `student_ref` é uma referência interna opaca — o nome real do estudante nunca deve ser armazenado aqui.

---

### `ia_lesson_plans`

Planos de aula gerados pela IA.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PK | Identificador |
| `municipality_id` | `uuid` FK | Município |
| `title` | `text` | Título do plano |
| `etapa` | `text` | Etapa de ensino |
| `ano` | `text` | Ano escolar |
| `componente` | `text` | Componente curricular |
| `tema` | `text` | Tema da aula |
| `duracao` | `text` | Duração estimada |
| `status` | `text` | `rascunho`, `finalizado` |
| `content` | `jsonb` | Conteúdo estruturado do plano |

---

### `ia_usage_logs`

Log de uso para auditoria, controle de custo e compliance.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PK | Identificador |
| `municipality_id` | `uuid` FK | Município |
| `mode` | `text` | Modo utilizado |
| `model` | `text` | Modelo Anthropic utilizado |
| `input_tokens` | `integer` | Tokens de entrada |
| `output_tokens` | `integer` | Tokens de saída |
| `was_blocked` | `boolean` | Se a solicitação foi bloqueada pelos guardrails |
| `block_reason` | `text` | Motivo do bloqueio, se aplicável |
| `created_at` | `timestamptz` | Timestamp |

---

## Diagrama de Relacionamentos

```
auth.users (Supabase)
    │
    ├── library_profiles (1:1) — perfil do município
    │
    ├── ia_conversations (1:N) — conversas com a IA
    │       └── ia_messages (1:N) — mensagens da conversa
    │
    ├── ia_pei (1:N) — PEIs rascunhados
    │
    ├── ia_lesson_plans (1:N) — planos de aula
    │
    └── ia_usage_logs (1:N) — logs de auditoria
```
