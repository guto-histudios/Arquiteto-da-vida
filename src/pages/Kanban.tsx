import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Task, TaskStatus } from '../types';
import { TaskCard } from '../components/tasks/TaskCard';
import { KanbanSquare, Trophy, AlertCircle, CheckSquare, RefreshCw, CheckCircle } from 'lucide-react';
import { getDataStringBrasil } from '../utils/dataUtils';
import { clsx } from 'clsx';

export function Kanban() {
  const { tasks, mudarStatus, atualizarTask, config } = useApp();
  const hoje = getDataStringBrasil();
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);
  
  // Only show tasks for today or overdue tasks
  const kanbanTasks = tasks
    .filter(t => !t.concluidaDefinitivamente && (t.data === hoje || (t.data < hoje && t.status !== 'concluida' && t.status !== 'cancelada')))
    .sort((a, b) => {
      if (!a.horario && !b.horario) return 0;
      if (!a.horario) return 1;
      if (!b.horario) return -1;
      return a.horario.localeCompare(b.horario);
    });

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'nao_iniciada', title: 'A Fazer', color: 'border-text-sec' },
    { id: 'em_andamento', title: 'Fazendo', color: 'border-accent-purple' },
    { id: 'concluida', title: 'Concluído', color: 'border-success' }
  ];

  const getTasksByStatus = (status: TaskStatus) => kanbanTasks.filter(t => t.status === status);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // Check Kanban WIP limit for 'em_andamento'
    if (status === 'em_andamento') {
      const doingTasks = getTasksByStatus('em_andamento');
      if (doingTasks.length >= config.limiteKanban && !doingTasks.find(t => t.id === taskId)) {
        alert(`Limite WIP excedido! Você só pode ter ${config.limiteKanban} tarefas em andamento ao mesmo tempo.`);
        return;
      }
    }

    const task = tasks.find(t => t.id === taskId);
    if (status === 'concluida' && task?.status !== 'concluida') {
      setTaskToComplete(taskId);
      return;
    }

    mudarStatus(taskId, status);
  };

  const handleConfirmCompletion = (continua: boolean) => {
    if (!taskToComplete) return;
    
    const task = tasks.find(t => t.id === taskToComplete);
    if (!task) return;

    if (!continua) {
      atualizarTask(task.id, { 
        concluidaDefinitivamente: true,
        dataConclusaoDefinitiva: getDataStringBrasil()
      });
    } else {
      atualizarTask(task.id, {
        vezAtual: (task.vezAtual || 1) + 1
      });
    }
    
    mudarStatus(task.id, 'concluida');
    setTaskToComplete(null);
  };

  // Calculate total XP
  const totalXP = tasks.filter(t => t.xpGanho).length * 10;

  return (
    <div className="space-y-8 pb-20 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-purple/10 rounded-xl">
            <KanbanSquare size={28} className="text-accent-purple" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Kanban</h1>
            <p className="text-text-sec font-medium">Gerencie seu fluxo de trabalho</p>
          </div>
        </div>
        
        <div className="glass-card px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-warning" />
            <span className="font-bold text-xl text-white">{totalXP} XP</span>
          </div>
          <div className="w-px h-8 bg-border-subtle"></div>
          <div className="text-sm text-text-sec">
            Limite WIP: <span className="text-white font-bold">{config.limiteKanban}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-[600px]">
        {columns.map(col => {
          const colTasks = getTasksByStatus(col.id);
          const isOverLimit = col.id === 'em_andamento' && colTasks.length > config.limiteKanban;

          return (
            <div 
              key={col.id}
              className={clsx(
                "glass-card flex flex-col overflow-hidden border-t-4 transition-colors",
                col.color,
                isOverLimit && "border-error bg-error/5"
              )}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-sec/50">
                <h2 className="font-bold text-lg">{col.title}</h2>
                <span className={clsx(
                  "px-2.5 py-1 rounded-full text-xs font-bold",
                  isOverLimit ? "bg-error text-white" : "bg-bg-main text-text-sec border border-border-subtle"
                )}>
                  {colTasks.length} {col.id === 'em_andamento' && `/ ${config.limiteKanban}`}
                </span>
              </div>
              
              {isOverLimit && (
                <div className="px-4 py-2 bg-error/20 text-error text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={14} />
                  Limite WIP excedido!
                </div>
              )}

              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide">
                {colTasks.length > 0 ? (
                  colTasks.map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <TaskCard task={task} onStatusChange={mudarStatus} />
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-text-sec text-sm border-2 border-dashed border-border-subtle rounded-xl p-8 text-center">
                    Arraste tarefas para cá
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {taskToComplete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card w-full max-w-md p-8 text-center animate-slide-up">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/30">
              <CheckSquare size={40} className="text-success" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3">Tarefa Concluída!</h2>
            <p className="text-text-sec mb-8 text-lg">A tarefa foi finalizada ou vai continuar?</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleConfirmCompletion(true)}
                className="bg-bg-sec border border-border-subtle hover:border-accent-blue/50 hover:bg-accent-blue/10 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 group"
              >
                <RefreshCw size={24} className="text-accent-blue group-hover:rotate-180 transition-transform duration-500" />
                <div className="text-left">
                  <div className="font-bold text-lg">Sim, continua</div>
                  <div className="text-sm text-text-sec">Volta amanhã como não iniciada</div>
                </div>
              </button>
              
              <button 
                onClick={() => handleConfirmCompletion(false)}
                className="bg-success/20 border border-success/50 hover:bg-success hover:text-white text-success px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300"
              >
                <CheckCircle size={24} />
                <div className="text-left">
                  <div className="font-bold text-lg">Não, termina aqui</div>
                  <div className="text-sm opacity-80">Vai para o histórico definitivo</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
