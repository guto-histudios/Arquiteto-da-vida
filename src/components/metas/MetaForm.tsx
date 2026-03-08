import React, { useState, useEffect } from 'react';
import { Meta, MetaPeriodo } from '../../types';
import { X, Link as LinkIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getDataStringBrasil } from '../../utils/dataUtils';
import { useApp } from '../../contexts/AppContext';

interface MetaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meta: Meta) => void;
  metaToEdit?: Meta | null;
}

export function MetaForm({ isOpen, onClose, onSave, metaToEdit }: MetaFormProps) {
  const { tasks, kpis } = useApp();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [periodo, setPeriodo] = useState<MetaPeriodo>('semanal');
  const [dataInicio, setDataInicio] = useState(getDataStringBrasil());
  const [dataFim, setDataFim] = useState(getDataStringBrasil());
  const [metaProgresso, setMetaProgresso] = useState(100);
  
  const [taskId, setTaskId] = useState<string>('');
  const [kpiId, setKpiId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (metaToEdit && isOpen) {
      setTitulo(metaToEdit.titulo);
      setDescricao(metaToEdit.descricao || '');
      setPeriodo(metaToEdit.periodo);
      setDataInicio(metaToEdit.dataInicio);
      setDataFim(metaToEdit.dataFim);
      setMetaProgresso(metaToEdit.metaProgresso || 100);
      setTaskId(metaToEdit.tasksVinculadas?.[0] || '');
      setKpiId(metaToEdit.kpiVinculado || '');
      setError('');
    } else if (isOpen) {
      // Reset form when opening for a new meta
      setTitulo('');
      setDescricao('');
      setPeriodo('semanal');
      setDataInicio(getDataStringBrasil());
      setDataFim(getDataStringBrasil());
      setMetaProgresso(100);
      setTaskId('');
      setKpiId('');
      setError('');
    }
  }, [metaToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskId && !kpiId) {
      setError('A meta DEVE estar vinculada a pelo menos uma Task ou um KPI.');
      return;
    }
    
    setError('');

    const newMeta: Meta = {
      id: metaToEdit ? metaToEdit.id : uuidv4(),
      titulo,
      descricao,
      periodo,
      dataInicio,
      dataFim,
      progresso: metaToEdit ? metaToEdit.progresso : 0,
      status: metaToEdit ? metaToEdit.status : 'nao_iniciada',
      metaProgresso,
      tasksVinculadas: taskId ? [taskId] : [],
      kpiVinculado: kpiId || undefined,
      ehIkigai: metaToEdit ? metaToEdit.ehIkigai : false,
      ehShokunin: metaToEdit ? metaToEdit.ehShokunin : false,
    };
    onSave(newMeta);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-border-subtle sticky top-0 bg-bg-card/95 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold tracking-tight">{metaToEdit ? 'Editar Meta' : 'Nova Meta'}</h2>
          <button onClick={onClose} className="text-text-sec hover:text-white transition-colors p-2 hover:bg-bg-sec rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

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

          <div className="bg-bg-sec/50 border border-border-subtle p-4 rounded-xl space-y-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <LinkIcon size={16} className="text-accent-blue" />
              Vinculação (Obrigatório pelo menos um)
            </h3>
            
            <div>
              <label className="block text-xs font-medium mb-1 text-text-sec">Vincular a uma Task</label>
              <select 
                value={taskId} 
                onChange={(e) => {
                  setTaskId(e.target.value);
                  setError('');
                }} 
                className="input-modern appearance-none"
              >
                <option value="">-- Nenhuma Task --</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.titulo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-text-sec">Vincular a um KPI</label>
              <select 
                value={kpiId} 
                onChange={(e) => {
                  setKpiId(e.target.value);
                  setError('');
                }} 
                className="input-modern appearance-none"
              >
                <option value="">-- Nenhum KPI --</option>
                {kpis.map(k => (
                  <option key={k.id} value={k.id}>{k.titulo}</option>
                ))}
              </select>
            </div>
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

