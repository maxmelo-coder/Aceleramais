# Segurança e LGPD — IA Eleva+

## Enquadramento Legal

A IA Eleva+ processa dados de educadores municipais e, potencialmente, referências a
estudantes com deficiência ou em situação de vulnerabilidade. Esses dados se enquadram
nas categorias sensíveis da LGPD (Lei 13.709/2018), Art. 11 — especialmente dados
relativos à saúde e educação de menores.

---

## Medidas de Proteção Implementadas

### 1. Redação Automática de Dados Pessoais (`lib/library/ai/redactor.ts`)

Antes de qualquer mensagem ser enviada à API Anthropic, o redactor verifica e remove:

- **CPF**: substituído por `[CPF OCULTADO]`
- **E-mail**: substituído por `[EMAIL OCULTADO]`
- **Telefone**: substituído por `[TELEFONE OCULTADO]`

O campo `was_redacted` nos logs registra se houve redação.

### 2. Guardrails de Conteúdo (`lib/library/ai/guardrails.ts`)

Padrões bloqueados na entrada (regex, sem envio à IA):

- Pedidos de diagnóstico clínico
- Pedidos de laudo médico
- Referências a CID ou DSM como solicitação de classificação
- Pedidos de prescrição de medicamento
- Pedidos de receita médica

Resposta padronizada ao bloqueio:
> "Solicitação fora do escopo pedagógico da IA Eleva+. Esta IA não realiza diagnósticos, não prescreve medicamentos e não emite laudos."

### 3. Restrição de Dados de Identificação de Estudantes

- A tabela `ia_pei` usa `student_ref` (referência interna opaca) em vez de nome real.
- Os system prompts instrui explicitamente a IA a não solicitar nome de estudantes.
- Orientação exibida na UI: "Não inclua nome completo, CPF ou dados que identifiquem diretamente o estudante."

### 4. Autenticação Obrigatória

- A API Route `/api/biblioteca/ia/chat` valida a sessão Supabase antes de processar.
- Retorna HTTP 401 se o usuário não estiver autenticado.
- `municipality_id` é sempre derivado da sessão — não aceito no corpo da requisição.

### 5. Histórico de Mensagens Limitado

- Máximo de 40 mensagens por requisição (evita vazamento de histórico excessivo).
- O histórico atual existe apenas no estado do cliente — não é persistido automaticamente.

### 6. Log de Auditoria (`ia_usage_logs`)

Cada chamada à IA registra: modo, modelo, tokens, bloqueio e motivo — sem registrar
o conteúdo da mensagem.

### 7. Isolamento Multi-tenant (RLS)

Todas as tabelas `ia_*` têm RLS com política `municipality_id = auth.uid()`.
Nenhum município pode acessar dados de outro.

---

## Comunicação de Limitações na Interface

Todos os modos exibem o `SafetyBanner`:

> "A IA Eleva+ oferece apoio pedagógico. Suas sugestões precisam ser analisadas e
> validadas pelos profissionais responsáveis. Ela não realiza diagnósticos nem substitui
> o diálogo com o estudante, a família, a equipe pedagógica, o AEE ou a rede de proteção."

O modo PEI exibe aviso adicional:

> "O PEI gerado pela IA é um rascunho — toda seção exige revisão e aprovação humana
> antes de ser considerada final."

O modo socioemocional exibe aviso destacado sobre o protocolo de proteção para casos
de violência, abuso ou risco.

---

## Retenção de Dados

| Dado | Armazenamento | Retenção |
|------|--------------|----------|
| Mensagens de chat | Somente no estado do cliente (não persistido por padrão) | Sessão do navegador |
| `ia_usage_logs` | Supabase | Definir política de retenção conforme DPA |
| `ia_pei` / `ia_lesson_plans` | Supabase (quando salvos) | Gestão pelo município |

---

## Fornecedores Sub-processadores

| Fornecedor | Dado compartilhado | DPA |
|------------|--------------------|-----|
| Anthropic (API) | Mensagens do chat (após redação) | Anthropic Privacy Policy + DPA disponível |
| Supabase | Dados do banco (RLS) | Supabase DPA (GDPR-ready) |
| Vercel | Requisições HTTP (sem body persistido) | Vercel DPA |

---

## Responsabilidades

- **IA Eleva+**: ferramenta pedagógica de apoio.
- **Educador**: valida e aprova qualquer sugestão gerada antes de aplicá-la.
- **Município**: responsável pelo tratamento dos dados de estudantes em sua rede.
- **Mantenedor da plataforma**: responsável pela infraestrutura, DPA com sub-processadores e resposta a incidentes.
