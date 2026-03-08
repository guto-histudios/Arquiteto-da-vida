export type TaskStatus = 'nao_iniciada' | 'em_andamento' | 'concluida' | 'cancelada' | 'nao_feita';
export type TaskCategoria = 'trabalho' | 'pessoal' | 'saude' | 'estudos';
export type TaskPrioridade = 'alta' | 'media' | 'baixa';
export type TipoRepeticao = 'uma_vez' | 'diario' | 'semanal' | 'personalizado';

export interface Task {
  id: string;
  titulo: string;
  descricao?: string;
  duracao: number; // em minutos
  categoria: TaskCategoria;
  prioridade: TaskPrioridade;
  status: TaskStatus;
  data: string; // YYYY-MM-DD
  prazo?: string; // YYYY-MM-DD
  tipoRepeticao: TipoRepeticao;
  dataLimite?: string; // YYYY-MM-DD
  horario?: string; // HH:mm
  diasSemana?: number[]; // [0,1,2,3,4,5,6]
  vezAtual: number;
  repeticoesMax?: number;
  concluidaDefinitivamente?: boolean;
  dataConclusaoDefinitiva?: string;
  kpiVinculado?: string;
  metaVinculada?: string;
  xpGanho: boolean;
  horarioFixo?: boolean;
  deadline?: string; // YYYY-MM-DD
  pomodorosFeitos: number;
  blocosQuebrados?: string[];
}

export interface ConclusaoHabito {
  data: string; // YYYY-MM-DD
  concluido: boolean;
}

export interface Habito {
  id: string;
  nome: string;
  diasSemana: number[]; // [0,1,2,3,4,5,6]
  horario?: string; // HH:mm
  categoria: string;
  conclusoes: ConclusaoHabito[];
}

export type MetaPeriodo = 'semanal' | 'mensal' | 'trimestral';
export type MetaStatus = 'nao_iniciada' | 'em_andamento' | 'concluida';

export interface Meta {
  id: string;
  titulo: string;
  descricao?: string;
  periodo: MetaPeriodo;
  dataInicio: string; // YYYY-MM-DD
  dataFim: string; // YYYY-MM-DD
  progresso: number; // 0-100
  status: MetaStatus;
  kpiVinculado?: string;
  metaProgresso?: number;
  tasksVinculadas: string[];
  ehIkigai: boolean;
  ehShokunin: boolean;
}

export interface KPI {
  id: string;
  titulo: string;
  descricao?: string;
  valorAtual: number;
  valorMeta: number;
  unidade: string;
}

export type TipoHorarioFixo = 'cafe_almoco' | 'almoco' | 'lanche_tarde' | 'jantar' | 'sono_inicio' | 'sono_fim' | 'outro';

export interface HorarioFixo {
  id: string;
  tipo: TipoHorarioFixo;
  horaInicio: string; // HH:mm
  horaFim?: string; // HH:mm
  descricao: string;
}

export interface Configuracao {
  timezone: string;
  duracaoPomodoro: number;
  pomodorosAntesPause: number;
  duracaoPausaCurta: number;
  duracaoPausaLonga: number;
  limiteKanban: number;
  onboardingCompleted: boolean;
  tema?: string;
}

export interface Ikigai {
  paixoes: string[];
  profissoes: string[];
  missoes: string[];
  vocacoes: string[];
}

export interface Kaizen {
  id: string;
  data: string;
  melhoria: string;
  tipo: 'diario' | 'semanal';
}

export interface UserProfile {
  nome: string;
  dataNascimento: string;
  expectativaVida: number;
  objetivos: string;
  rotina: string;
  habitosAtuais: string;
  horariosDisponiveis: string;
  haraHachiBu: string;
  shokunin: string;
}

export interface HealthData {
  peso: number;
  altura: number;
  idade: number;
  genero: string;
  nivelAtividade: 'sedentario' | 'pouco_ativo' | 'ativo' | 'muito_ativo';
  objetivo: 'perder_peso' | 'ganhar_musculo' | 'manter_peso' | 'condicionamento';
  equipamentos: 'nenhum' | 'halteres' | 'elasticos' | 'academia_completa';
  diasTreino: number;
  tempoPorDia: number;
  condicoesMedicas?: string;
}

export interface Exercise {
  nome: string;
  series: number;
  repeticoes: string; // Ex: "10-12", "30s"
  descanso: string; // Ex: "60s"
  instrucoes: string;
}

export interface WorkoutDay {
  dia: number; // 1 to 7
  foco: string; // Ex: "Upper Body", "Cardio", "Rest"
  exercicios: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  dataCriacao: string;
  dias: WorkoutDay[];
  recomendacoesGerais: string;
}

export interface GamificationState {
  totalXP: number;
  badges: string[];
  streakDias: number;
  ultimoAcesso: string;
}

export interface BadgeInfo {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

export interface Meal {
  nome: string;
  quantidade: string;
  porcoes: string;
  calorias: number;
  proteina: number;
  carboidratos: number;
  gorduras: number;
}

export interface MealOption {
  id: string;
  cafeDaManha: Meal;
  almoco: Meal;
  lancheDaTarde: Meal;
  jantar: Meal;
  caloriasTotais: number;
}

export interface DailyMeals {
  data: string; // YYYY-MM-DD
  opcoesGeradas: MealOption[];
  opcaoEscolhidaId?: string;
}
