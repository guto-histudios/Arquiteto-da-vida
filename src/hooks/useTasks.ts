import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';
import { getDataStringBrasil, isDataFutura } from '../utils/dataUtils';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvos = getStorageItem<Task[]>('tasks', []);
    const hoje = getDataStringBrasil();
    const ultimoAcessoTasks = getStorageItem<string>('ultimoAcessoTasks', hoje);

    let tasksParaSalvar = salvos;

    if (ultimoAcessoTasks !== hoje) {
      tasksParaSalvar = salvos.map(task => {
        if (task.concluidaDefinitivamente) return task;
        
        if (task.status === 'concluida' || task.status === 'nao_feita') {
          // Move the task to today so it appears again
          return { ...task, status: 'nao_iniciada', data: hoje, xpGanho: false };
        }
        return task;
      }).filter(task => task.status !== 'cancelada');
      
      setStorageItem('ultimoAcessoTasks', hoje);
    }

    setTasks(tasksParaSalvar);
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (!carregando) {
      setStorageItem('tasks', tasks);
    }
  }, [tasks, carregando]);

  const adicionarTask = (novaTask: Task) => {
    setTasks(prev => [...prev, novaTask]);
  };

  const atualizarTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removerTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const mudarStatus = (id: string, novoStatus: TaskStatus, onConcluir?: (task: Task) => void) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (novoStatus === 'concluida' && isDataFutura(task.data)) {
      alert('Data inválida: não é possível concluir itens de datas futuras');
      return;
    }

    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const xpGanho = novoStatus === 'concluida' ? true : t.xpGanho;
        return { ...t, status: novoStatus, xpGanho };
      }
      return t;
    }));

    if (novoStatus === 'concluida' && onConcluir) {
       onConcluir(task);
    }
  };

  return { tasks, setTasks, carregando, adicionarTask, atualizarTask, removerTask, mudarStatus };
}
