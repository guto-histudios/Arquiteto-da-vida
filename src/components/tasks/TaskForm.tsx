import React, { useState, useMemo } from 'react';
import { Task, TaskCategoria, TaskPrioridade, TipoRepeticao } from '../../types';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getDataStringBrasil } from '../../utils/dataUtils';
import { useApp } from '../../contexts/AppContext';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export function TaskForm({ isOpen, onClose, onSave }: TaskFormProps) {
  const { horariosFixos } = useApp();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [duracao, setDuracao] = useState(30);
  const [horario, setHorario] = useState('');
  const [categoria, setCategoria] = useState<TaskCategoria>('trabalho');
  const [prioridade, setPrioridade] = useState<TaskPrioridade>('media');
  const [data, setData] = useState(getDataStringBrasil());
  const [tipoRepeticao, setTipoRepeticao] = useState<TipoRepeticao>('uma_vez');

  const horarioFim = useMemo(() => {
    if (!horario || !duracao) return null;
    const [h, m] = horario.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + duracao, 0, 0);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }, [horario, duracao]);

  const overlapWarning = useMemo(() => {
    if (!horario || !horarioFim || !horariosFixos.length) return null;
    
    const taskStart = parseInt(horario.replace(':', ''));
    const taskEnd = parseInt(horarioFim.replace(':', ''));

    for (const fixo of horariosFixos) {
      if (!fixo.horaInicio) continue;
      const fixoStart = parseInt(fixo.horaInicio.replace(':', ''));
      let fixoEnd = fixoStart + 60; // default 1h if no end time
      if (fixo.horaFim) {
        fixoEnd = parseInt(fixo.horaFim.replace(':', ''));
      }

      // Check overlap
      if (taskStart < fixoEnd && taskEnd > fixoStart) {
        return `Atenção: Este horário sobrepõe com seu horário fixo: ${fixo.descricao} (${fixo.horaInicio}${fixo.horaFim ? ` - ${fixo.horaFim}` : ''})`;
      }
    }
    return null;
  }, [horario, horarioFim, horariosFixos]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: uuidv4(),
      titulo,
      descricao,
      duracao,
      horario: horario || undefined,
      categoria,
      prioridade,
      status: 'nao_iniciada',
      data,
      tipoRepeticao,
      vezAtual: 1,
      xpGanho: false,
      pomodorosFeitos: 0,
    };
    onSave(newTask);
    onClose();
    // Reset form
    setTitulo('');
    setDescricao('');
    setDuracao(30);
    setHorario('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-border-subtle sticky top-0 bg-bg-card/95 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold tracking-tight">Nova Tarefa</h2>
          <button onClick={onClose} className="text-text-sec hover:text-white transition-colors p-2 hover:bg-bg-sec rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-sec">Título</label>
            <input 
              required
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              className="input-modern"
              placeholder="O que precisa ser feito?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-sec">Descrição</label>
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              className="input-modern min-h-[80px] resize-y"
              placeholder="Detalhes adicionais..."
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Data</label>
              <input 
                type="date"
                required
                value={data} 
                onChange={(e) => setData(e.target.value)} 
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Duração (min)</label>
              <input 
                type="number"
                required
                min="1"
                value={duracao} 
                onChange={(e) => setDuracao(Number(e.target.value))} 
                className="input-modern"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Horário de Início (Opcional)</label>
              <input 
                type="time"
                value={horario} 
                onChange={(e) => setHorario(e.target.value)} 
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Horário de Fim</label>
              <div className="input-modern bg-bg-main flex items-center text-text-sec">
                <Clock size={16} className="mr-2" />
                {horarioFim || '--:--'}
              </div>
            </div>
          </div>

          {overlapWarning && (
            <div className="bg-warning/10 border border-warning/30 text-warning p-3 rounded-lg flex items-start gap-2 text-sm">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p>{overlapWarning}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Categoria</label>
              <select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value as TaskCategoria)} 
                className="input-modern appearance-none"
              >
                <option value="trabalho">Trabalho</option>
                <option value="pessoal">Pessoal</option>
                <option value="saude">Saúde</option>
                <option value="estudos">Estudos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Prioridade</label>
              <select 
                value={prioridade} 
                onChange={(e) => setPrioridade(e.target.value as TaskPrioridade)} 
                className="input-modern appearance-none"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-sec">Repetição</label>
            <select 
              value={tipoRepeticao} 
              onChange={(e) => setTipoRepeticao(e.target.value as TipoRepeticao)} 
              className="input-modern appearance-none"
            >
              <option value="uma_vez">Uma vez</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border-subtle mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn-primary"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

