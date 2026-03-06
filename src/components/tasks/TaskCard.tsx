import React from 'react';
import { Task, TaskStatus } from '../../types';
import { formatarData, isDataFutura } from '../../utils/dataUtils';
import { CheckCircle, Circle, Clock, AlertTriangle, XCircle, SkipForward } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const isFuturo = isDataFutura(task.data);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'concluida': return <CheckCircle className="text-success" />;
      case 'cancelada': return <XCircle className="text-error" />;
      case 'nao_feita': return <SkipForward className="text-warning" />;
      default: return <Circle className="text-text-sec" />;
    }
  };

  const getPriorityColor = () => {
    switch (task.prioridade) {
      case 'alta': return 'border-l-4 border-error';
      case 'media': return 'border-l-4 border-warning';
      case 'baixa': return 'border-l-4 border-accent-blue';
      default: return '';
    }
  };

  return (
    <div className={clsx(
      "glass-card p-5 relative group",
      getPriorityColor(),
      isFuturo && "opacity-50 pointer-events-none"
    )}>
      <div className="flex justify-between items-start mb-3">
        <h3 className={clsx("font-semibold text-lg tracking-tight", task.status === 'concluida' && "line-through text-text-sec")}>
          {task.titulo}
        </h3>
        <div className="relative">
          <button className="p-1.5 hover:bg-bg-sec rounded-lg transition-colors">
            {getStatusIcon()}
          </button>
          
          {/* Dropdown menu on hover/click - simplified for now */}
          <div className="absolute right-0 mt-2 w-48 bg-bg-sec border border-border-subtle rounded-xl shadow-2xl py-2 z-10 hidden group-hover:block animate-slide-up">
            <button onClick={() => onStatusChange(task.id, 'concluida')} className="block px-4 py-2 text-sm text-success hover:bg-bg-card w-full text-left transition-colors">Concluir</button>
            <button onClick={() => onStatusChange(task.id, 'em_andamento')} className="block px-4 py-2 text-sm text-accent-blue hover:bg-bg-card w-full text-left transition-colors">Em Andamento</button>
            <button onClick={() => onStatusChange(task.id, 'nao_feita')} className="block px-4 py-2 text-sm text-warning hover:bg-bg-card w-full text-left transition-colors">Não Feita (Adiar)</button>
            <button onClick={() => onStatusChange(task.id, 'cancelada')} className="block px-4 py-2 text-sm text-error hover:bg-bg-card w-full text-left transition-colors">Cancelar</button>
          </div>
        </div>
      </div>

      {task.descricao && <p className="text-text-sec text-sm mb-4 leading-relaxed">{task.descricao}</p>}

      <div className="flex items-center gap-4 text-xs text-text-sec">
        <div className="flex items-center gap-1.5 bg-bg-sec px-2.5 py-1 rounded-md border border-border-subtle">
          <Clock size={14} className="text-accent-blue" />
          <span className="font-medium">{task.duracao} min</span>
        </div>
        {task.prazo && (
          <div className="flex items-center gap-1.5 bg-bg-sec px-2.5 py-1 rounded-md border border-border-subtle">
            <AlertTriangle size={14} className="text-warning" />
            <span className="font-medium">{formatarData(task.prazo)}</span>
          </div>
        )}
        <span className="bg-bg-sec border border-border-subtle px-2.5 py-1 rounded-md text-text-sec capitalize font-medium">{task.categoria}</span>
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

