import type {
  User, School, Trimester, DashboardStats, ProjectConfig, ChartDataPoint,
  MunicipioData,
} from './types';

export type { MunicipioData };

// ── Helper: escola sem dados numéricos ───────────────────────
function emptySchool(id: string, name: string, code: string, municipioId: string): School {
  return {
    id, name, code, municipioId,
    address: '', bairro: '', zona: 'urbana',
    gestorName: '', email: '', phone: '',
    classCount: 0, studentCount: 0, teacherCount: 0,
    status: 'ativo', participationRate: 0, avgScore: 0, elevaIndex: 0,
  };
}

// ── Município 01 — Limoeiro de Anadia, AL ─────────────────────
const schoolsLimoeiro: School[] = [
  emptySchool('la-s01', 'CAEE Profª Divaneuza Clarindo Duarte',         'LA-001', 'm01'),
  emptySchool('la-s02', 'CEI Jorge Possidonio dos Reis',                 'LA-002', 'm01'),
  emptySchool('la-s03', 'CEI Luzinete Maria da Conceição',               'LA-003', 'm01'),
  emptySchool('la-s04', 'CMEI Edite Barbosa de Almeida',                 'LA-004', 'm01'),
  emptySchool('la-s05', 'CMEI Marina Soares Barbosa',                    'LA-005', 'm01'),
  emptySchool('la-s06', 'CMEI Nizete Barbosa da Silva Faustino',         'LA-006', 'm01'),
  emptySchool('la-s07', 'EMEB Araci Cavalcante da Silva',                'LA-007', 'm01'),
  emptySchool('la-s08', 'EMEB Benedito Galdino da Silva',                'LA-008', 'm01'),
  emptySchool('la-s09', 'EMEB Coronel Adauto Gomes Barbosa',             'LA-009', 'm01'),
  emptySchool('la-s10', 'EMEB Izabel Ferreira Boia',                     'LA-010', 'm01'),
  emptySchool('la-s11', 'EMEB João de Deus Barbosa',                     'LA-011', 'm01'),
  emptySchool('la-s12', 'EMEB José Teodoro da Silva',                    'LA-012', 'm01'),
  emptySchool('la-s13', 'EMEB Maria Ferreira de Almeida',                'LA-013', 'm01'),
  emptySchool('la-s14', 'EMEB Maria Julia Ferreira de Albuquerque',      'LA-014', 'm01'),
  emptySchool('la-s15', 'EMEB Maria Lima da Conceição',                  'LA-015', 'm01'),
  emptySchool('la-s16', 'EMEB Nossa Senhora da Conceição',               'LA-016', 'm01'),
  emptySchool('la-s17', 'EMEB Olival Tenorio Costa Neto',                'LA-017', 'm01'),
  emptySchool('la-s18', 'EMEB Pedro Antonio Lino',                       'LA-018', 'm01'),
  emptySchool('la-s19', 'EMEB Pedro Araújo dos Santos',                  'LA-019', 'm01'),
  emptySchool('la-s20', 'EMEB Pedro Ribeiro',                            'LA-020', 'm01'),
  emptySchool('la-s21', 'EMEB Prefeito Benicio Ferreira Reis',           'LA-021', 'm01'),
  emptySchool('la-s22', 'EMEB Prefeito Pedro Ferreira da Silva',         'LA-022', 'm01'),
  emptySchool('la-s23', 'EMEB Presidente Ernesto Geisel',                'LA-023', 'm01'),
  emptySchool('la-s24', 'EMEB Rodrigo da Rocha Cavalcante Camelo',       'LA-024', 'm01'),
  emptySchool('la-s25', 'EMEB Rosalia Ferreira Reis',                    'LA-025', 'm01'),
];

// ── Município 02 — Lagoa da Canoa, AL ────────────────────────
const schoolsLagoa: School[] = [];

// ── Município 03 — Taquarana, AL ─────────────────────────────
const schoolsTaquarana: School[] = [];

// ── Lista de Municípios ───────────────────────────────────────
export const municipiosData: MunicipioData[] = [
  {
    id: 'm01',
    name: 'Limoeiro de Anadia',
    state: 'Alagoas', uf: 'AL',
    codigoIBGE: '2704005',
    secretario: '—',
    status: 'ativo',
    schools: schoolsLimoeiro,
  },
  {
    id: 'm02',
    name: 'Lagoa da Canoa',
    state: 'Alagoas', uf: 'AL',
    codigoIBGE: '2703908',
    secretario: '—',
    status: 'ativo',
    schools: schoolsLagoa,
  },
  {
    id: 'm03',
    name: 'Taquarana',
    state: 'Alagoas', uf: 'AL',
    codigoIBGE: '2708956',
    secretario: '—',
    status: 'ativo',
    schools: schoolsTaquarana,
  },
];

// ── Usuário atual (simulado) ──────────────────────────────────
export const currentUser: User = {
  id: 'u001',
  name: 'Administrador',
  email: 'admin@acelera.com.br',
  role: 'super_admin',
  municipioName: 'Limoeiro de Anadia',
  status: 'ativo',
};

// ── Configuração do Projeto ───────────────────────────────────
export const projectConfig: ProjectConfig = {
  projectName: 'Acelera+ Escola de Empreendedorismo',
  networkName: '—',
  year: 2025,
  executionPeriod: '—',
  company: 'Acelera+ Escola de Empreendedorismo',
  coordinator: '—',
  description: '—',
  objectives: [],
  segments: [],
  series: ['4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano'],
  estimatedStudents: 0,
  estimatedTeachers: 0,
  estimatedSchools: 0,
};

// ── Trimestres ────────────────────────────────────────────────
export const trimesters: Trimester[] = [
  { id: 'tr1', name: '1º Trimestre', startDate: '2025-02-03', endDate: '2025-04-30', status: 'encerrado', year: 2025 },
  { id: 'tr2', name: '2º Trimestre', startDate: '2025-05-05', endDate: '2025-07-31', status: 'ativo',     year: 2025 },
  { id: 'tr3', name: '3º Trimestre', startDate: '2025-08-04', endDate: '2025-10-31', status: 'planejado', year: 2025 },
  { id: 'tr4', name: '4º Trimestre', startDate: '2025-11-03', endDate: '2025-12-12', status: 'planejado', year: 2025 },
];

// ── Dashboard Stats zerado ────────────────────────────────────
export const emptyDashboardStats: DashboardStats = {
  totalMunicipios: 3,
  totalSchools: 0,
  totalClasses: 0,
  totalStudents: 0,
  totalTeachers: 0,
  totalEvaluations: 0,
  totalTeacherEvaluations: 0,
  totalTrainings: 0,
  totalSmartGoals: 0,
  totalActionPlans: 0,
  evaluationResponseRate: 0,
  avgStudentScore: 0,
  projectExecutionLevel: 0,
  teacherTrainingParticipation: 0,
  teacherSatisfaction: 0,
  secretarySatisfaction: 0,
  trainingPresencaPct: 0,
  pendingActionPlans: 0,
  overdueActionPlans: 0,
  elevaIndex: 0,
  elevaIndexLevel: 'critico',
};

// Alias para compatibilidade
export const dashboardStats = emptyDashboardStats;

// ── Arrays vazios ─────────────────────────────────────────────
export const turmas:                  never[] = [];
export const students:                never[] = [];
export const teachers:                never[] = [];
export const evaluations:             never[] = [];
export const teacherEvaluations:      never[] = [];
export const teacherEvaluationForms:  never[] = [];
export const secretaryFeedbacks:      never[] = [];
export const trainings:               never[] = [];
export const trainingMaterials:       never[] = [];
export const evidences:               never[] = [];
export const smartGoals:              never[] = [];
export const actionPlans:             never[] = [];
export const users:                   never[] = [];

export const swotAnalysis = {
  id: 'sw001',
  trimestre: '2º Trimestre',
  items: [] as never[],
  updatedAt: new Date().toISOString(),
};

// Para compatibilidade com páginas que usam municipios como lista simples
export const municipios = municipiosData.map(m => ({
  id: m.id,
  name: m.name,
  state: m.state,
  secretario: m.secretario,
  status: m.status,
  schools: m.schools.length,
}));

// ── Gráficos (vazios) ─────────────────────────────────────────
export const scoreBySchool:         ChartDataPoint[] = [];
export const participationBySchool: ChartDataPoint[] = [];
export const scoreByTrimester: ChartDataPoint[] = [
  { label: '1º Trim.', value: 0, color: '#2E8C99' },
  { label: '2º Trim.', value: 0, color: '#F48B1B' },
  { label: '3º Trim.', value: 0, color: '#E8EAED' },
  { label: '4º Trim.', value: 0, color: '#E8EAED' },
];
