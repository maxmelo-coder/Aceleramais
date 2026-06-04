// ============================================================
// Eleva+ Educação Empreendedora — TypeScript Types
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'admin_eleva'
  | 'secretaria'
  | 'gestor_escolar'
  | 'professor'
  | 'visualizador';

export type TrimesterStatus = 'planejado' | 'ativo' | 'encerrado';
export type SchoolStatus = 'ativo' | 'inativo' | 'suspenso';
export type EvaluationStatus = 'rascunho' | 'publicada' | 'aplicada' | 'encerrada';
export type GoalStatus = 'planejada' | 'em_andamento' | 'concluida' | 'atrasada';
export type ActionStatus = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
export type IndexLevel = 'critico' | 'desenvolvimento' | 'bom' | 'excelente';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  schoolId?: string;
  municipio?: string;
  status: 'ativo' | 'inativo';
  lastAccess?: string;
  avatar?: string;
}

export interface Municipio {
  id: string;
  name: string;
  state: string;
  secretario?: string;
  schools: number;
}

export interface School {
  id: string;
  name: string;
  code: string;
  municipioId: string;
  address: string;
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

export interface Turma {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  serie: string;
  turno: 'manhã' | 'tarde' | 'noite' | 'integral';
  teacherId: string;
  teacherName: string;
  studentCount: number;
  trimestre: string;
  participationStatus: 'alta' | 'media' | 'baixa';
  avgScore: number;
  observations?: string;
}

export interface Student {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  turmaId: string;
  turmaName: string;
  serie: string;
  matricula: string;
  age: number;
  status: 'ativo' | 'inativo' | 'transferido';
  scores: { trimestre: string; score: number }[];
  avgScore: number;
  observations?: string;
}

export interface Trimester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: TrimesterStatus;
  year: number;
}

export interface Evaluation {
  id: string;
  title: string;
  serie: string;
  turmaId?: string;
  schoolId?: string;
  trimesterId: string;
  trimesterName: string;
  competencia: string;
  habilidade: string;
  conteudo: string;
  totalPoints: number;
  applicationDate: string;
  status: EvaluationStatus;
  respondents: number;
  totalStudents: number;
  avgScore: number;
}

export interface TeacherEvaluation {
  id: string;
  teacherId: string;
  teacherName: string;
  schoolId: string;
  schoolName: string;
  trimesterId: string;
  trimesterName: string;
  materialUse: number;
  activityClarity: number;
  studentEngagement: number;
  trainingQuality: number;
  supportReceived: number;
  difficulties: string;
  suggestions: string;
  submittedAt: string;
}

export interface SecretaryFeedback {
  id: string;
  userId: string;
  userName: string;
  trimesterId: string;
  trimesterName: string;
  generalRating: number;
  perceivedImpact: number;
  strengths: string;
  improvements: string;
  alignment: number;
  expectations: string;
  decisions: string;
  comment: string;
  submittedAt: string;
}

export interface Training {
  id: string;
  title: string;
  date: string;
  hours: number;
  trainer: string;
  schools: string[];
  teacherCount: number;
  topic: string;
  rating: number;
  observations?: string;
}

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
  trimesterId: string;
  competencia: string;
  createdAt: string;
  url?: string;
}

export interface SwotItem {
  id: string;
  category: 'forca' | 'fraqueza' | 'oportunidade' | 'ameaca';
  text: string;
  auto?: boolean;
}

export interface SwotAnalysis {
  id: string;
  schoolId?: string;
  schoolName?: string;
  trimesterId: string;
  trimesterName: string;
  items: SwotItem[];
  updatedAt: string;
}

export interface SmartGoal {
  id: string;
  title: string;
  schoolId?: string;
  schoolName?: string;
  turmaId?: string;
  indicator: string;
  description: string;
  initialValue: number;
  targetValue: number;
  currentValue: number;
  deadline: string;
  responsible: string;
  status: GoalStatus;
  evidences: string[];
  observations?: string;
}

export interface ActionPlan {
  id: string;
  problem: string;
  schoolId?: string;
  schoolName?: string;
  turmaId?: string;
  cause: string;
  action: string;
  responsible: string;
  deadline: string;
  resources: string;
  successIndicator: string;
  status: ActionStatus;
  observations?: string;
}

export interface DashboardStats {
  totalSchools: number;
  totalClasses: number;
  totalStudents: number;
  totalTeachers: number;
  evaluationResponseRate: number;
  avgStudentScore: number;
  projectExecutionLevel: number;
  teacherTrainingParticipation: number;
  teacherSatisfaction: number;
  secretarySatisfaction: number;
  elevaIndex: number;
  elevaIndexLevel: IndexLevel;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

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
