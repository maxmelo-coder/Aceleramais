export interface AISource {
  title: string;
  institution: string;
  year?: string;
  url?: string;
  excerpt?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: AISource[];
  wasRedacted?: boolean;
}

export interface AIRequest {
  mode: string;
  messages: AIMessage[];
  municipalityId?: string;
  context?: Record<string, string>;
}

export interface AIResponse {
  content: string;
  sources?: AISource[];
  wasBlocked?: boolean;
  blockReason?: string;
}

export type AIMode =
  | 'pei' | 'estudo-caso' | 'socioemocional'
  | 'planejamento' | 'percurso-letivo' | 'autismo'
  | 'materiais' | 'adaptacao' | 'livre';
