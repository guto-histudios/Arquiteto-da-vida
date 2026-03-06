import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { MetaCard } from '../components/metas/MetaCard';
import { MetaForm } from '../components/metas/MetaForm';
import { Plus, Target } from 'lucide-react';

export function Metas() {
  const { metas, adicionarMeta, atualizarMeta } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-blue/10 rounded-xl">
            <Target size={28} className="text-accent-blue" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Minhas Metas</h1>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metas.length > 0 ? (
          metas.map(meta => (
            <MetaCard key={meta.id} meta={meta} onUpdate={atualizarMeta} />
          ))
        ) : (
          <div className="col-span-full glass-card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-bg-sec rounded-full flex items-center justify-center mb-6 border border-border-subtle">
              <Target size={40} className="text-text-sec" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhuma meta definida</h3>
            <p className="text-text-sec max-w-md">Onde você quer chegar? Defina suas metas para começar a acompanhar seu progresso.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <MetaForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSave={adicionarMeta} 
        />
      )}
    </div>
  );
}

