-- IA Eleva+ — Tabelas de conversas, mensagens, PEI, planos de aula e logs de uso.
-- Migração: 20250714000001_ia_eleva

-- AI Conversations (one per session/mode)
create table if not exists ia_conversations (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid references auth.users(id) on delete cascade,
  mode text not null, -- 'pei'|'estudo-caso'|'planejamento'|'socioemocional'|'percurso-letivo'|'autismo'|'materiais'|'adaptacao'|'livre'
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI Messages
create table if not exists ia_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references ia_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  sources jsonb, -- [{title, institution, year, url, excerpt}]
  was_redacted boolean default false,
  created_at timestamptz default now()
);

-- PEI (Plano Educacional Individualizado)
create table if not exists ia_pei (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid references auth.users(id) on delete cascade,
  student_ref text not null, -- internal identifier, NOT student name
  school text,
  etapa text,
  turma text,
  periodo_letivo text,
  elaboracao_date date,
  revisao_date date,
  status text default 'rascunho' check (status in ('rascunho','em_revisao','aprovado','arquivado')),
  sections jsonb default '[]',
  version integer default 1,
  created_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lesson Plans
create table if not exists ia_lesson_plans (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid references auth.users(id) on delete cascade,
  title text not null,
  etapa text,
  ano text,
  componente text,
  tema text,
  duracao text,
  status text default 'rascunho',
  content jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI Usage Log (for analytics, cost tracking, audit)
create table if not exists ia_usage_logs (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid references auth.users(id),
  mode text,
  model text,
  input_tokens integer,
  output_tokens integer,
  was_blocked boolean default false,
  block_reason text,
  created_at timestamptz default now()
);

-- RLS policies
alter table ia_conversations enable row level security;
alter table ia_messages enable row level security;
alter table ia_pei enable row level security;
alter table ia_lesson_plans enable row level security;
alter table ia_usage_logs enable row level security;

create policy "municipality sees own conversations" on ia_conversations
  for all using (municipality_id = auth.uid());

create policy "municipality sees own messages" on ia_messages
  for all using (
    conversation_id in (
      select id from ia_conversations where municipality_id = auth.uid()
    )
  );

create policy "municipality sees own peis" on ia_pei
  for all using (municipality_id = auth.uid());

create policy "municipality sees own lesson plans" on ia_lesson_plans
  for all using (municipality_id = auth.uid());

create policy "municipality sees own usage" on ia_usage_logs
  for all using (municipality_id = auth.uid());
