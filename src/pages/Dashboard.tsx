import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { TaskCard } from '../components/tasks/TaskCard';
import { HabitoCard } from '../components/habitos/HabitoCard';
import { KPICard } from '../components/kpis/KPICard';
import { ImprevistoModal } from '../components/common/ImprevistoModal';
import { getDataStringBrasil, formatarData } from '../utils/dataUtils';
import { AlertTriangle, CheckCircle, Calendar, Target, Activity } from 'lucide-react';

export function Dashboard() {
  const { tasks, habitos, kpis, mudarStatus, toggleConclusaoHabito, atualizarKPI, calcularProgressoHabitos } = useApp();
  const [isImprevistoOpen, setIsImprevistoOpen] = useState(false);
  const hoje = getDataStringBrasil();

  const tasksDoDia = tasks.filter(t => t.data === hoje && t.status !== 'cancelada');
  const habitosDoDia = habitos.filter(h => h.diasSemana.includes(new Date().getDay()));
  
  const tasksConcluidas = tasksDoDia.filter(t => t.status === 'concluida').length;
  const progressoHabitos = calcularProgressoHabitos(hoje);

  const handleImprevisto = (motivo: string, tempoPerdido: number, adiarTodas: boolean) => {
    console.log("Imprevisto:", { motivo, tempoPerdido, adiarTodas });
    // Logic to handle imprevisto would go here (e.g., rescheduling tasks)
    setIsImprevistoOpen(false);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-text-sec font-medium">{formatarData(hoje, "EEEE, d 'de' MMMM 'de' yyyy")}</p>
        </div>
        <button 
          onClick={() => setIsImprevistoOpen(true)}
          className="bg-bg-sec border border-error/30 text-error hover:bg-error hover:text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <AlertTriangle size={20} className="group-hover:animate-pulse" />
          <span className="font-medium">Alerta de Imprevisto</span>
        </button>
      </div>

      {/* Resumo do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-text-sec font-medium">Tarefas Concluídas</h3>
            <div className="p-2 bg-accent-blue/10 rounded-lg">
              <CheckCircle className="text-accent-blue" size={24} />
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">
            {tasksConcluidas} <span className="text-text-sec text-xl font-medium">/ {tasksDoDia.length}</span>
          </div>
          <div className="w-full bg-bg-sec rounded-full h-2 border border-border-subtle overflow-hidden">
            <div className="bg-gradient-to-r from-accent-blue to-accent-purple h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(tasksConcluidas / Math.max(tasksDoDia.length, 1)) * 100}%` }}></div>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-text-sec font-medium">Hábitos</h3>
            <div className="p-2 bg-success/10 rounded-lg">
              <Calendar className="text-success" size={24} />
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">{Math.round(progressoHabitos)}%</div>
          <div className="w-full bg-bg-sec rounded-full h-2 border border-border-subtle overflow-hidden">
            <div className="bg-gradient-to-r from-success to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressoHabitos}%` }}></div>
          </div>
        </div>

        <div className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-text-sec font-medium">Foco (Pomodoro)</h3>
            <div className="p-2 bg-accent-purple/10 rounded-lg">
              <Target className="text-accent-purple" size={24} />
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">0 <span className="text-text-sec text-xl font-medium">min</span></div>
          <p className="text-sm text-text-sec font-medium mt-2">Mantenha o foco!</p>
        </div>
      </div>

      {/* Tasks e Hábitos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-accent-blue/10 rounded-lg">
              <CheckCircle size={24} className="text-accent-blue" />
            </div>
            Tarefas de Hoje
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tasksDoDia.length > 0 ? (
              tasksDoDia.map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={mudarStatus} />
              ))
            ) : (
              <div className="col-span-2 glass-card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-bg-sec rounded-full flex items-center justify-center mb-4 border border-border-subtle">
                  <CheckCircle size={32} className="text-text-sec" />
                </div>
                <h3 className="text-lg font-medium mb-2">Tudo limpo por aqui</h3>
                <p className="text-text-sec">Nenhuma tarefa para hoje. Aproveite o dia!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-success/10 rounded-lg">
                <Calendar size={24} className="text-success" />
              </div>
              Hábitos Diários
            </h2>
            <div className="space-y-4">
              {habitosDoDia.length > 0 ? (
                habitosDoDia.map(habito => (
                  <HabitoCard key={habito.id} habito={habito} onToggle={toggleConclusaoHabito} />
                ))
              ) : (
                <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                  <Calendar size={32} className="text-text-sec mb-3" />
                  <p className="text-text-sec">Nenhum hábito para hoje.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-accent-purple/10 rounded-lg">
                <Activity size={24} className="text-accent-purple" />
              </div>
              KPIs Principais
            </h2>
            <div className="space-y-4">
              {kpis.slice(0, 3).map(kpi => (
                <KPICard key={kpi.id} kpi={kpi} onUpdate={atualizarKPI} />
              ))}
              {kpis.length === 0 && (
                <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                  <Activity size={32} className="text-text-sec mb-3" />
                  <p className="text-text-sec">Nenhum KPI definido.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ImprevistoModal 
        isOpen={isImprevistoOpen} 
        onClose={() => setIsImprevistoOpen(false)} 
        onConfirm={handleImprevisto} 
      />
    </div>
  );
}

