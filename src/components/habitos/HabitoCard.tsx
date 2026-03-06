import React from 'react';
import { Habito } from '../../types';
import { Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import { getDataStringBrasil, isDataFutura } from '../../utils/dataUtils';

interface HabitoCardProps {
  habito: Habito;
  onToggle: (id: string, data: string) => void;
}

export function HabitoCard({ habito, onToggle }: HabitoCardProps) {
  const hoje = getDataStringBrasil();
  const isConcluidoHoje = habito.conclusoes.some(c => c.data === hoje && c.concluido);
  const isFuturo = isDataFutura(hoje); // Wait, hoje is today, so it's not future.

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    // Logic for streak calculation would go here
    return streak;
  };

  return (
    <div className="glass-card p-5 flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-lg tracking-tight">{habito.nome}</h3>
        <p className="text-text-sec text-sm mt-1">Streak: <span className="text-accent-blue font-medium">{calculateStreak()} dias</span></p>
      </div>
      
      <button 
        onClick={() => onToggle(habito.id, hoje)}
        className={clsx(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
          isConcluidoHoje 
            ? "bg-gradient-to-br from-success to-emerald-600 text-white shadow-lg shadow-success/20 scale-105" 
            : "bg-bg-sec border border-border-subtle text-text-sec hover:bg-border-subtle hover:text-white"
        )}
      >
        {isConcluidoHoje ? <Check size={24} /> : <div className="w-5 h-5 rounded-full border-2 border-text-sec/50" />}
      </button>
    </div>
  );
}

