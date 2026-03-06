import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { formatarData, isDataFutura } from '../../utils/dataUtils';
import { CheckCircle, Circle, Clock, AlertTriangle, XCircle, SkipForward, Target, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { useApp } from '../../contexts/AppContext';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const isFuturo = isDataFutura(task.data);
  const { activeTaskId, setActiveTaskId, removerTask } = useApp();
  const isActive = activeTaskId === task.id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'concluida': return <CheckCircle className="text-success" />;
      case 'cancelada': return <XCircle className="text-error" />;
      case 'nao_feita': return <SkipForward className="text-warning" />;
      case 'em_andamento': return <Target className="text-accent-purple animate-pulse" />;
      default: return <Circle className="text-text-sec" />;
    }
  };

  const getPriorityColor = () => {
    if (isActive) return 'border-l-4 border-accent-purple shadow-accent-purple/20 shadow-lg';
    switch (task.prioridade) {
      case 'alta': return 'border-l-4 border-error';
      case 'media': return 'border-l-4 border-warning';
      case 'baixa': return 'border-l-4 border-accent-blue';
      default: return '';
    }
  };

  const handleStatusChange = (status: TaskStatus) => {
    onStatusChange(task.id, status);
    if (status === 'em_andamento') {
      setActiveTaskId(task.id);
    } else if (isActive && status !== 'em_andamento') {
      setActiveTaskId(null);
    }
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      removerTask(task.id);
    }
  };

  return (
    <div className={clsx(
      "glass-card p-5 relative group transition-all duration-300",
      getPriorityColor(),
      isFuturo && "opacity-50 pointer-events-none",
      isActive && "bg-accent-purple/5 scale-[1.02]"
    )}>
      {isActive && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-accent-purple/10 rounded-bl-full -z-10"></div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <h3 className={clsx(
          "font-semibold text-lg tracking-tight pr-8", 
          task.status === 'concluida' && "line-through text-text-sec",
          isActive && "text-accent-purple"
        )}>
          {task.titulo}
        </h3>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 hover:bg-bg-sec rounded-lg transition-colors text-text-sec hover:text-white"
          >
            <MoreVertical size={18} />
          </button>
          
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-bg-sec border border-border-subtle rounded-xl shadow-2xl py-2 z-20 animate-slide-up">
                <div className="px-3 py-1 text-xs font-medium text-text-sec uppercase tracking-wider">Status</div>
                <button onClick={() => handleStatusChange('concluida')} className="block px-4 py-2 text-sm text-success hover:bg-bg-card w-full text-left transition-colors">Concluir</button>
                <button onClick={() => handleStatusChange('em_andamento')} className="block px-4 py-2 text-sm text-accent-purple hover:bg-bg-card w-full text-left transition-colors">Focar (Pomodoro)</button>
                <button onClick={() => handleStatusChange('nao_feita')} className="block px-4 py-2 text-sm text-warning hover:bg-bg-card w-full text-left transition-colors">Não Feita (Adiar)</button>
                <button onClick={() => handleStatusChange('cancelada')} className="block px-4 py-2 text-sm text-error hover:bg-bg-card w-full text-left transition-colors">Cancelar</button>
                
                <div className="border-t border-border-subtle my-1"></div>
                <div className="px-3 py-1 text-xs font-medium text-text-sec uppercase tracking-wider">Ações</div>
                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-bg-card w-full text-left transition-colors">
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {task.descricao && <p className="text-text-sec text-sm mb-4 leading-relaxed">{task.descricao}</p>}

      <div className="flex flex-wrap items-center gap-3 text-xs text-text-sec mt-4">
        <div className="flex items-center gap-1.5 bg-bg-sec px-2.5 py-1 rounded-md border border-border-subtle">
          <Clock size={14} className="text-accent-blue" />
          <span className="font-medium">{task.duracao} min</span>
        </div>
        
        {task.pomodorosFeitos > 0 && (
          <div className="flex items-center gap-1.5 bg-accent-purple/10 text-accent-purple px-2.5 py-1 rounded-md border border-accent-purple/20">
            <Target size={14} />
            <span className="font-medium">{task.pomodorosFeitos} ciclos</span>
          </div>
        )}

        {task.prazo && (
          <div className="flex items-center gap-1.5 bg-bg-sec px-2.5 py-1 rounded-md border border-border-subtle">
            <AlertTriangle size={14} className="text-warning" />
            <span className="font-medium">{formatarData(task.prazo)}</span>
          </div>
        )}
        <span className="bg-bg-sec border border-border-subtle px-2.5 py-1 rounded-md text-text-sec capitalize font-medium">{task.categoria}</span>
        <span className="flex items-center gap-1 ml-auto" title="Status atual">
          {getStatusIcon()}
        </span>
      </div>

      {isFuturo && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-main/60 backdrop-blur-sm rounded-2xl">
          <span className="text-sm font-medium bg-bg-card border border-border-subtle px-4 py-2 rounded-xl shadow-lg">
            Disponível em {formatarData(task.data)}
          </span>
        </div>
      )}
    </div>
  );
}

