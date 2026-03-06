import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useHabitos } from '../hooks/useHabitos';
import { useMetas } from '../hooks/useMetas';
import { useKPIs } from '../hooks/useKPIs';
import { useConfiguracoes } from '../hooks/useConfiguracoes';
import { Task, Habito, Meta, KPI, Configuracao, HorarioFixo, UserProfile, TaskStatus } from '../types';

interface AppContextData {
  tasks: Task[];
  adicionarTask: (task: Task) => void;
  atualizarTask: (id: string, updates: Partial<Task>) => void;
  removerTask: (id: string) => void;
  mudarStatus: (id: string, status: TaskStatus) => void;

  habitos: Habito[];
  adicionarHabito: (habito: Habito) => void;
  atualizarHabito: (id: string, updates: Partial<Habito>) => void;
  removerHabito: (id: string) => void;
  toggleConclusaoHabito: (id: string, data: string) => void;
  calcularProgressoHabitos: (data: string) => number;

  metas: Meta[];
  adicionarMeta: (meta: Meta) => void;
  atualizarMeta: (id: string, updates: Partial<Meta>) => void;
  removerMeta: (id: string) => void;

  kpis: KPI[];
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
      
      // Logic for Meta update could go here
      // For now, let's assume Meta progress is manually updated or calculated differently
    });
  };

  return (
    <AppContext.Provider value={{
      tasks: tasksHook.tasks,
      adicionarTask: tasksHook.adicionarTask,
      atualizarTask: tasksHook.atualizarTask,
      removerTask: tasksHook.removerTask,
      mudarStatus: mudarStatus, // Use the wrapped function

      habitos: habitosHook.habitos,
      adicionarHabito: habitosHook.adicionarHabito,
      atualizarHabito: habitosHook.atualizarHabito,
      removerHabito: habitosHook.removerHabito,
      toggleConclusaoHabito: habitosHook.toggleConclusao,
      calcularProgressoHabitos: habitosHook.calcularProgressoHabitos,

      metas: metasHook.metas,
      adicionarMeta: metasHook.adicionarMeta,
      atualizarMeta: metasHook.atualizarMeta,
      removerMeta: metasHook.removerMeta,

      kpis: kpisHook.kpis,
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

      carregando,
      activeTaskId,
      setActiveTaskId
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

