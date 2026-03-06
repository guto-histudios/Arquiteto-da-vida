import React, { useState } from 'react';
import { Meta, MetaPeriodo } from '../../types';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getDataStringBrasil } from '../../utils/dataUtils';

interface MetaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meta: Meta) => void;
}

export function MetaForm({ isOpen, onClose, onSave }: MetaFormProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [periodo, setPeriodo] = useState<MetaPeriodo>('semanal');
  const [dataInicio, setDataInicio] = useState(getDataStringBrasil());
  const [dataFim, setDataFim] = useState(getDataStringBrasil());
  const [metaProgresso, setMetaProgresso] = useState(100);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeta: Meta = {
      id: uuidv4(),
      titulo,
      descricao,
      periodo,
      dataInicio,
      dataFim,
      progresso: 0,
      status: 'nao_iniciada',
      metaProgresso,
      tasksVinculadas: [],
      ehIkigai: false,
      ehShokunin: false,
    };
    onSave(newMeta);
    onClose();
    // Reset form
    setTitulo('');
    setDescricao('');
    setPeriodo('semanal');
    setMetaProgresso(100);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-border-subtle sticky top-0 bg-bg-card/95 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold tracking-tight">Nova Meta</h2>
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
              placeholder="Ex: Correr 10km"
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
              <label className="block text-sm font-medium mb-2 text-text-sec">Período</label>
              <select 
                value={periodo} 
                onChange={(e) => setPeriodo(e.target.value as MetaPeriodo)} 
                className="input-modern appearance-none"
              >
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Meta (Valor)</label>
              <input 
                type="number"
                required
                value={metaProgresso} 
                onChange={(e) => setMetaProgresso(Number(e.target.value))} 
                className="input-modern"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Início</label>
              <input 
                type="date"
                required
                value={dataInicio} 
                onChange={(e) => setDataInicio(e.target.value)} 
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Fim</label>
              <input 
                type="date"
                required
                value={dataFim} 
                onChange={(e) => setDataFim(e.target.value)} 
                className="input-modern"
              />
            </div>
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

