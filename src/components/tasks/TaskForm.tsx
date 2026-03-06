import React, { useState } from 'react';
import { Task, TaskCategoria, TaskPrioridade, TipoRepeticao } from '../../types';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getDataStringBrasil } from '../../utils/dataUtils';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export function TaskForm({ isOpen, onClose, onSave }: TaskFormProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [duracao, setDuracao] = useState(30);
  const [categoria, setCategoria] = useState<TaskCategoria>('trabalho');
  const [prioridade, setPrioridade] = useState<TaskPrioridade>('media');
  const [data, setData] = useState(getDataStringBrasil());
  const [tipoRepeticao, setTipoRepeticao] = useState<TipoRepeticao>('uma_vez');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: uuidv4(),
      titulo,
      descricao,
      duracao,
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
              <label className="block text-sm font-medium mb-2 text-text-sec">Duração (min)</label>
              <input 
                type="number"
                required
                value={duracao} 
                onChange={(e) => setDuracao(Number(e.target.value))} 
                className="input-modern"
              />
            </div>
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
          </div>

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

