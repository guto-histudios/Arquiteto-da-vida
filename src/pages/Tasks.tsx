import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { getDataStringBrasil, isDataPassada } from '../utils/dataUtils';
import { Plus, Filter, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';

type FilterType = 'todas' | 'hoje' | 'atrasadas' | 'concluidas';

export function Tasks() {
  const { tasks, adicionarTask, mudarStatus } = useApp();
  const [filter, setFilter] = useState<FilterType>('todas');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const hoje = getDataStringBrasil();

  const filteredTasks = tasks.filter(task => {
    if (task.status === 'cancelada') return false;
    
    switch (filter) {
      case 'hoje':
        return task.data === hoje;
      case 'atrasadas':
        return isDataPassada(task.data) && task.status !== 'concluida';
      case 'concluidas':
        return task.status === 'concluida';
      default:
        return true;
    }
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-blue/10 rounded-xl">
            <CheckSquare size={28} className="text-accent-blue" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Minhas Tarefas</h1>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Tarefa
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <button 
          onClick={() => setFilter('todas')}
          className={clsx(
            "px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300",
            filter === 'todas' 
              ? "bg-text-main text-bg-main shadow-lg shadow-white/10" 
              : "bg-bg-sec border border-border-subtle text-text-sec hover:bg-border-subtle hover:text-white"
          )}
        >
          Todas
        </button>
        <button 
          onClick={() => setFilter('hoje')}
          className={clsx(
            "px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300",
            filter === 'hoje' 
              ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/20" 
              : "bg-bg-sec border border-border-subtle text-text-sec hover:bg-border-subtle hover:text-white"
          )}
        >
          Hoje
        </button>
        <button 
          onClick={() => setFilter('atrasadas')}
          className={clsx(
            "px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300",
            filter === 'atrasadas' 
              ? "bg-error text-white shadow-lg shadow-error/20" 
              : "bg-bg-sec border border-border-subtle text-text-sec hover:bg-border-subtle hover:text-white"
          )}
        >
          Atrasadas
        </button>
        <button 
          onClick={() => setFilter('concluidas')}
          className={clsx(
            "px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300",
            filter === 'concluidas' 
              ? "bg-success text-white shadow-lg shadow-success/20" 
              : "bg-bg-sec border border-border-subtle text-text-sec hover:bg-border-subtle hover:text-white"
          )}
        >
          Concluídas
        </button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={mudarStatus} />
          ))
        ) : (
          <div className="col-span-full glass-card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-bg-sec rounded-full flex items-center justify-center mb-6 border border-border-subtle">
              <Filter size={40} className="text-text-sec" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-text-sec max-w-md">Tente mudar os filtros ou crie uma nova tarefa para começar a organizar seu dia.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <TaskForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={adicionarTask} 
        />
      )}
    </div>
  );
}

