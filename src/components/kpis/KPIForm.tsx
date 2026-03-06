import React, { useState } from 'react';
import { KPI } from '../../types';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface KPIFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (kpi: KPI) => void;
}

export function KPIForm({ isOpen, onClose, onSave }: KPIFormProps) {
  const [titulo, setTitulo] = useState('');
  const [valorAtual, setValorAtual] = useState(0);
  const [valorMeta, setValorMeta] = useState(100);
  const [unidade, setUnidade] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newKPI: KPI = {
      id: uuidv4(),
      titulo,
      valorAtual,
      valorMeta,
      unidade,
    };
    onSave(newKPI);
    onClose();
    // Reset form
    setTitulo('');
    setValorAtual(0);
    setValorMeta(100);
    setUnidade('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-border-subtle sticky top-0 bg-bg-card/95 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold tracking-tight">Novo KPI</h2>
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
              placeholder="Ex: Livros Lidos"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Valor Atual</label>
              <input 
                type="number"
                required
                value={valorAtual} 
                onChange={(e) => setValorAtual(Number(e.target.value))} 
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Meta</label>
              <input 
                type="number"
                required
                value={valorMeta} 
                onChange={(e) => setValorMeta(Number(e.target.value))} 
                className="input-modern"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-sec">Unidade</label>
            <input 
              value={unidade} 
              onChange={(e) => setUnidade(e.target.value)} 
              className="input-modern"
              placeholder="Ex: livros, kg, %"
            />
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

