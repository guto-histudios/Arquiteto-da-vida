import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useHabitos } from '../hooks/useHabitos';
import { useMetas } from '../hooks/useMetas';
import { useKPIs } from '../hooks/useKPIs';
import { useConfiguracoes } from '../hooks/useConfiguracoes';
import { Task, Habito, Meta, KPI, Configuracao, HorarioFixo, UserProfile, TaskStatus, HealthData, WorkoutPlan } from '../types';

interface AppContextData {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  adicionarTask: (task: Task) => void;
  atualizarTask: (id: string, updates: Partial<Task>) => void;
  removerTask: (id: string) => void;
  mudarStatus: (id: string, status: TaskStatus) => void;

  habitos: Habito[];
  setHabitos: (habitos: Habito[]) => void;
  adicionarHabito: (habito: Habito) => void;
  atualizarHabito: (id: string, updates: Partial<Habito>) => void;
  removerHabito: (id: string) => void;
  toggleConclusaoHabito: (id: string, data: string) => void;
  calcularProgressoHabitos: (data: string) => number;

  metas: Meta[];
  setMetas: (metas: Meta[]) => void;
  adicionarMeta: (meta: Meta) => void;
  atualizarMeta: (id: string, updates: Partial<Meta>) => void;
  removerMeta: (id: string) => void;

  kpis: KPI[];
  setKPIs: (kpis: KPI[]) => void;
  adicionarKPI: (kpi: KPI) => void;
  atualizarKPI: (id: string, valor: number) => void;
  removerKPI: (id: string) => void;

  config: Configuracao;
  atualizarConfig: (updates: Partial<Configuracao>) => void;
  horariosFixos: HorarioFixo[];
  adicionarHorarioFixo: (horario: HorarioFixo) => void;
  removerHorarioFixo: (id: string) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  
  healthData: HealthData | null;
  setHealthData: (data: HealthData | null) => void;
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan | null) => void;

  carregando: boolean;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export function AppProvider({ children }: { children: ReactNode }) {
  const tasksHook = useTasks();
  const habitosHook = useHabitos();
  const metasHook = useMetas();
  const kpisHook = useKPIs();
  const configHook = useConfiguracoes();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const carregando = tasksHook.carregando || habitosHook.carregando || metasHook.carregando || kpisHook.carregando || configHook.carregando;

  const mudarStatus = (id: string, status: TaskStatus) => {
    tasksHook.mudarStatus(id, status, (task) => {
      // Logic when task is completed
      if (task.kpiVinculado) {
        const kpi = kpisHook.kpis.find(k => k.id === task.kpiVinculado);
        if (kpi) {
          kpisHook.atualizarKPI(kpi.id, kpi.valorAtual + 1);
        }
      }
    });
  };

  // Recalculate Metas progress when Tasks or KPIs change
  useEffect(() => {
    if (carregando) return;

    let updated = false;
    const novasMetas = metasHook.metas.map(meta => {
      let progressoTask = 0;
      let progressoKPI = 0;
      let count = 0;

      if (meta.tasksVinculadas && meta.tasksVinculadas.length > 0) {
        const taskId = meta.tasksVinculadas[0];
        const task = tasksHook.tasks.find(t => t.id === taskId);
        if (task && task.status === 'concluida') {
          progressoTask = 100;
        }
        count++;
      }

      if (meta.kpiVinculado) {
        const kpi = kpisHook.kpis.find(k => k.id === meta.kpiVinculado);
        if (kpi && meta.metaProgresso) {
          progressoKPI = Math.min((kpi.valorAtual / meta.metaProgresso) * 100, 100);
        }
        count++;
      }

      if (count > 0) {
        const progressoTotal = Math.round((progressoTask + progressoKPI) / count);
        const novoStatus = progressoTotal >= 100 ? 'concluida' : (progressoTotal > 0 ? 'em_andamento' : 'nao_iniciada');
        
        if (progressoTotal !== meta.progresso || novoStatus !== meta.status) {
          updated = true;
          return { ...meta, progresso: progressoTotal, status: novoStatus };
        }
      }
      return meta;
    });

    if (updated) {
      metasHook.setMetas(novasMetas);
    }
  }, [tasksHook.tasks, kpisHook.kpis, carregando]);

  return (
    <AppContext.Provider value={{
      tasks: tasksHook.tasks,
      setTasks: tasksHook.setTasks,
      adicionarTask: tasksHook.adicionarTask,
      atualizarTask: tasksHook.atualizarTask,
      removerTask: tasksHook.removerTask,
      mudarStatus: mudarStatus,

      habitos: habitosHook.habitos,
      setHabitos: habitosHook.setHabitos,
      adicionarHabito: habitosHook.adicionarHabito,
      atualizarHabito: habitosHook.atualizarHabito,
      removerHabito: habitosHook.removerHabito,
      toggleConclusaoHabito: habitosHook.toggleConclusao,
      calcularProgressoHabitos: habitosHook.calcularProgressoHabitos,

      metas: metasHook.metas,
      setMetas: metasHook.setMetas,
      adicionarMeta: metasHook.adicionarMeta,
      atualizarMeta: metasHook.atualizarMeta,
      removerMeta: metasHook.removerMeta,

      kpis: kpisHook.kpis,
      setKPIs: kpisHook.setKPIs,
      adicionarKPI: kpisHook.adicionarKPI,
      atualizarKPI: kpisHook.atualizarKPI,
      removerKPI: kpisHook.removerKPI,

      config: configHook.config,
      atualizarConfig: configHook.atualizarConfig,
      horariosFixos: configHook.horariosFixos,
      adicionarHorarioFixo: configHook.adicionarHorarioFixo,
      removerHorarioFixo: configHook.removerHorarioFixo,
      userProfile: configHook.userProfile,
      setUserProfile: configHook.setUserProfile,
      healthData: configHook.healthData,
      setHealthData: configHook.setHealthData,
      workoutPlan: configHook.workoutPlan,
      setWorkoutPlan: configHook.setWorkoutPlan,

      carregando,
      activeTaskId,
      setActiveTaskId
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

