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
  diasSemana?: number[]; // [0,1,2,3,4,5,6]
  vezAtual: number;
  repeticoesMax?: number;
  kpiVinculado?: string;
  metaVinculada?: string;
  xpGanho: boolean;
  horarioFixo?: boolean;
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
