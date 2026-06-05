// ============================================================
// Acelera+ Escola de Empreendedorismo — TypeScript Types
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'admin_eleva'
  | 'gestor_municipal'
  | 'gestor_escolar'
  | 'professor'
  | 'formador'
  | 'visualizador';

export type TrimesterStatus = 'planejado' | 'ativo' | 'encerrado';
export type SchoolStatus = 'ativo' | 'inativo' | 'suspenso';
export type MunicipioStatus = 'ativo' | 'pausado' | 'concluido' | 'em_analise';
export type EvaluationStatus = 'rascunho' | 'publicada' | 'aplicada' | 'encerrada';
export type GoalStatus = 'nao_iniciada' | 'em_andamento' | 'concluida' | 'atrasada' | 'cancelada';
export type ActionStatus = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
export type ActionPriority = 'baixa' | 'media' | 'alta' | 'critica';
export type IndexLevel = 'critico' | 'desenvolvimento' | 'bom' | 'excelente';
export type FeedbackType =
  | 'avaliacao_geral'
  | 'execucao_projeto'
  | 'formacao_docente'
  | 'material_didatico'
  | 'resultados'
  | 'prestacao_contas'
  | 'ajustes';
export type FeedbackStatus = 'positivo' | 'atencao' | 'critico' | 'resolvido';
export type TrainingModality = 'presencial' | 'online' | 'hibrida';
export type MaterialType = 'ppt' | 'pdf' | 'video' | 'link' | 'outro';
export type EtapaEnsino = 'EF Anos Iniciais' | 'EF Anos Finais' | 'EJA';
export type SwotCategory = 'forca' | 'fraqueza' | 'oportunidade' | 'ameaca';
export type SwotOrigin = 'avaliacao' | 'formacao' | 'feedback' | 'manual';
export type ReportType =
  | 'geral_municipio'
  | 'por_escola'
  | 'por_turma'
  | 'desempenho_discente'
  | 'avaliacao_docente'
  | 'formacao_docente'
  | 'feedback_secretaria'
  | 'execucao_projeto'
  | 'prestacao_contas';

// ── Usuário ───────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  schoolId?: string;
  municipioId?: string;
  municipioName?: string;
  status: 'ativo' | 'inativo';
  lastAccess?: string;
  avatar?: string;
}

// ── Município ─────────────────────────────────────────────────
export interface MunicipioData {
  id: string;
  name: string;
  state: string;
  uf: string;
  codigoIBGE?: string;
  secretaria?: string;
  secretario: string;
  email?: string;
  telefone?: string;
  dataInicio?: string;
  status: MunicipioStatus;
  observacoes?: string;
  schools: School[];
}

// ── Escola ────────────────────────────────────────────────────
export interface School {
  id: string;
  name: string;
  code: string; // código INEP
  municipioId: string;
  municipioName?: string;
  address?: string;
  bairro?: string;
  zona?: 'urbana' | 'rural';
  gestorName: string;
  email: string;
  phone: string;
  classCount: number;
  studentCount: number;
  teacherCount: number;
  status: SchoolStatus;
  observations?: string;
  participationRate: number;
  avgScore: number;
  elevaIndex: number;
}

// ── Turma ─────────────────────────────────────────────────────
export interface Turma {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  municipioId?: string;
  etapa: EtapaEnsino;
  serie: string;
  turno: 'manhã' | 'tarde' | 'noite' | 'integral';
  teacherId?: string;
  teacherName: string;
  studentCount: number;
  participationRate: number;
  status: 'ativo' | 'inativo';
  observations?: string;
}

// ── Estudante ─────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  turmaId: string;
  turmaName: string;
  serie: string;
  matricula: string;
  age?: number;
  status: 'ativo' | 'inativo' | 'transferido';
  scores?: { trimestre: string; score: number }[];
  avgScore?: number;
  observations?: string;
}

// ── Professor ─────────────────────────────────────────────────
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  schoolId: string;
  schoolName: string;
  municipioId?: string;
  turmas: string[];
  status: 'ativo' | 'inativo';
}

// ── Trimestre ─────────────────────────────────────────────────
export interface Trimester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: TrimesterStatus;
  year: number;
}

// ── Avaliação Diagnóstica ─────────────────────────────────────
export interface DiagnosticAssessment {
  id: string;
  title: string;
  etapa: EtapaEnsino;
  serie: string;
  trimestre: string;
  trimesterId?: string;
  competencia: string;
  status: EvaluationStatus;
  respondents: number;
  totalStudents: number;
  avgScore: number;
  createdAt: string;
  publicUrl?: string;
}

export interface DiagnosticQuestion {
  id: string;
  assessmentId: string;
  order: number;
  text: string;
  type: 'multipla_escolha' | 'verdadeiro_falso' | 'dissertativa';
  options?: string[];
  correctOption?: number;
  points: number;
}

export interface DiagnosticAnswer {
  id: string;
  assessmentId: string;
  studentName: string;
  cidade: string;
  escola: string;
  turma: string;
  professor: string;
  answers: { questionId: string; selected?: number; text?: string }[];
  submittedAt: string;
  score?: number;
}

export interface DiagnosticResult {
  assessmentId: string;
  totalRespondents: number;
  avgScore: number;
  byQuestion: { questionId: string; correctRate: number }[];
}

// ── Avaliação Docente ─────────────────────────────────────────
export interface TeacherEvaluationForm {
  id: string;
  title: string;
  municipioId?: string;
  municipioName?: string;
  trimestre: string;
  totalProfessores: number;
  respondentes: number;
  participacaoPct: number;
  mediasMaterial: number;
  mediasFormacao: number;
  mediasEngajamento: number;
  status: 'aberto' | 'encerrado';
  createdAt: string;
}

export interface TeacherEvaluation {
  id: string;
  formId: string;
  teacherId?: string;
  teacherName: string;
  schoolId?: string;
  schoolName: string;
  municipioId?: string;
  trimestre: string;
  materialUse: number;
  activityClarity: number;
  studentEngagement: number;
  trainingQuality: number;
  supportReceived: number;
  difficulties: string;
  suggestions: string;
  submittedAt: string;
}

// ── Feedback da Secretaria ────────────────────────────────────
export interface SecretaryFeedback {
  id: string;
  userId: string;
  userName: string;
  municipioId?: string;
  municipioName: string;
  tipo: FeedbackType;
  status: FeedbackStatus;
  texto: string;
  trimestre?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

// ── Formação Docente ──────────────────────────────────────────
export interface TrainingSession {
  id: string;
  title: string;
  municipioId?: string;
  municipioName?: string;
  schools: string[];
  date: string;
  startTime?: string;
  cargaHoraria: number;
  modalidade: TrainingModality;
  formador: string;
  temas: string[];
  objetivos?: string;
  totalProfessores: number;
  presentes: number;
  presencaPct: number;
  observations?: string;
}

export interface TrainingAttendance {
  id: string;
  trainingId: string;
  teacherId?: string;
  teacherName: string;
  schoolName: string;
  presente: boolean;
  observacao?: string;
}

// ── Material para Formações ───────────────────────────────────
export interface TrainingMaterial {
  id: string;
  title: string;
  description?: string;
  tipo: MaterialType;
  tema: string;
  municipioId?: string;
  municipioName?: string;
  trainingId?: string;
  trainingTitle?: string;
  responsavel: string;
  tags: string[];
  url?: string;
  createdAt: string;
}

// ── Evidências ────────────────────────────────────────────────
export interface Evidence {
  id: string;
  title: string;
  description: string;
  type: 'foto' | 'pdf' | 'link' | 'relato' | 'projeto';
  schoolId: string;
  schoolName: string;
  turmaId?: string;
  turmaName?: string;
  teacherName: string;
  trimestre: string;
  competencia: string;
  createdAt: string;
  url?: string;
}

// ── Análise SWOT ──────────────────────────────────────────────
export interface SwotItem {
  id: string;
  category: SwotCategory;
  text: string;
  origem: SwotOrigin;
  auto?: boolean;
}

export interface SwotAnalysis {
  id: string;
  municipioId?: string;
  municipioName?: string;
  schoolId?: string;
  schoolName?: string;
  trimestre: string;
  items: SwotItem[];
  updatedAt: string;
}

// ── Meta SMART ────────────────────────────────────────────────
export interface SmartGoal {
  id: string;
  title: string;
  municipioId?: string;
  municipioName?: string;
  schoolId?: string;
  schoolName?: string;
  turmaId?: string;
  responsible: string;
  especifica: string;
  mensuravel: string;
  atingivel: string;
  relevante: string;
  temporal: string;
  deadline: string;
  initialValue: number;
  targetValue: number;
  currentValue: number;
  status: GoalStatus;
  origem?: string;
  observations?: string;
}

// ── Plano de Ação ─────────────────────────────────────────────
export interface ActionPlan {
  id: string;
  title: string;
  description?: string;
  municipioId?: string;
  municipioName?: string;
  schoolId?: string;
  schoolName?: string;
  turmaId?: string;
  metaId?: string;
  metaTitle?: string;
  problema: string;
  origem?: string;
  responsible: string;
  deadline: string;
  prioridade: ActionPriority;
  status: ActionStatus;
  observations?: string;
  createdAt: string;
}

export interface ActionPlanTask {
  id: string;
  actionPlanId: string;
  title: string;
  responsible: string;
  deadline: string;
  status: ActionStatus;
}

// ── Relatório ─────────────────────────────────────────────────
export interface Report {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  municipioId?: string;
  schoolId?: string;
  periodo?: string;
  generatedAt?: string;
  generatedBy?: string;
}

// ── Dashboard Stats ───────────────────────────────────────────
export interface DashboardStats {
  totalMunicipios: number;
  totalSchools: number;
  totalClasses: number;
  totalStudents: number;
  totalTeachers: number;
  totalEvaluations: number;
  totalTeacherEvaluations: number;
  totalTrainings: number;
  totalSmartGoals: number;
  totalActionPlans: number;
  evaluationResponseRate: number;
  avgStudentScore: number;
  projectExecutionLevel: number;
  teacherTrainingParticipation: number;
  teacherSatisfaction: number;
  secretarySatisfaction: number;
  trainingPresencaPct: number;
  pendingActionPlans: number;
  overdueActionPlans: number;
  elevaIndex: number;
  elevaIndexLevel: IndexLevel;
}

// ── Configuração do Projeto ───────────────────────────────────
export interface ProjectConfig {
  projectName: string;
  networkName: string;
  year: number;
  executionPeriod: string;
  company: string;
  coordinator: string;
  description: string;
  objectives: string[];
  segments: string[];
  series: string[];
  estimatedStudents: number;
  estimatedTeachers: number;
  estimatedSchools: number;
}

// ── Gráficos ──────────────────────────────────────────────────
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}
