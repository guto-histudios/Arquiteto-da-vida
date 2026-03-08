import React, { useState } from 'react';
import { KPI } from '../../types';
import { Edit2, Save, X } from 'lucide-react';
import { clsx } from 'clsx';

interface KPICardProps {
  kpi: KPI;
  onUpdate: (id: string, valor: number) => void;
}

export function KPICard({ kpi, onUpdate }: KPICardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(kpi.valorAtual);

  const handleSave = () => {
    onUpdate(kpi.id, newValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewValue(kpi.valorAtual);
    setIsEditing(false);
  };

  const progress = Math.min((kpi.valorAtual / kpi.valorMeta) * 100, 100);

  return (
    <div className="glass-card p-6 relative group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg tracking-tight">{kpi.titulo}</h3>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="text-success hover:text-emerald-400 transition-colors p-1.5 bg-success/10 rounded-lg"><Save size={18} /></button>
              <button onClick={handleCancel} className="text-error hover:text-red-400 transition-colors p-1.5 bg-error/10 rounded-lg"><X size={18} /></button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-text-sec hover:text-white transition-colors p-1.5 bg-bg-sec rounded-lg border border-border-subtle"><Edit2 size={16} /></button>
          )}
        </div>
      </div>

      <div className="flex items-end gap-3 mb-4">
        {isEditing ? (
          <input 
            type="number" 
            value={newValue} 
            onChange={(e) => setNewValue(Number(e.target.value))} 
            className="input-modern w-32 text-2xl font-bold py-2"
          />
        ) : (
          <span className="text-4xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">{kpi.valorAtual}</span>
        )}
        <span className="text-text-sec text-sm mb-1.5 font-medium">/ {kpi.valorMeta} {kpi.unidade}</span>
      </div>

      <div className="w-full bg-bg-sec rounded-full h-3 border border-border-subtle overflow-hidden mb-3">
        <div 
          className="bg-gradient-to-r from-accent-blue to-accent-purple h-full rounded-full transition-all duration-1000 ease-out relative" 
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      {kpi.descricao && (
        <p className="text-xs text-text-sec mt-3 pt-3 border-t border-border-subtle/50 leading-relaxed">
          {kpi.descricao}
        </p>
      )}
    </div>
  );
}

